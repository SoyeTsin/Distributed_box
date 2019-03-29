<template>
    <el-container class="list">
        <el-header height="48px" class="header-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>盒子端管理</el-breadcrumb-item>
                <el-breadcrumb-item><a>积分对账</a></el-breadcrumb-item>
            </el-breadcrumb>
        </el-header>
        <div class="list-content">
            <div class="list-content-top">
                <div class="title">积分对账</div>
            </div>
            <el-table class="box-table"
                      :header-cell-style="{background:'rgb(244,247,251)'}"
                      :data="tableData"
                      stripe
                      style="width: 100%">
                <el-table-column
                        prop=""
                        label=""
                        width="36">
                </el-table-column>
                <el-table-column
                        prop="date"
                        label=" 对账时间"
                        sortable>
                </el-table-column>
                <el-table-column
                        label="个人积分"
                        >
                    <template slot-scope="scope">
                        <div v-show="scope.row.user_exception==0">
                            {{scope.row.user_exception|userExceptionFile}}
                        </div>
                        <el-button @click="handleClick(scope.row)" type="text"
                                   v-show="scope.row.user_exception!=0">
                            <b class="red text">异常</b>{{scope.row.user_exception|userExceptionFile}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        label="平台积分">
                    <template slot-scope="scope">
                        <div v-show="scope.row.total_deliver==scope.row.total_income">
                            {{scope.row|countFile}}
                        </div>
                        <el-button @click="handleClick(scope.row)" type="text"
                                   v-show="scope.row.total_deliver!=scope.row.total_income">
                            <b class="red text">异常</b>{{scope.row|countFile}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <div>
                    共{{pageParameter.total}}条记录，每页10条
                </div>
                <el-pagination background @current-change="handleCurrentChange"
                               :current-page.sync="pageParameter.currentPage" :page-sizes="pageParameter.pageSizes"
                               :page-size="pageParameter.pageSize"
                               layout="prev, pager, next" :total="pageParameter.total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="异常用户" :visible.sync="dialogTableVisible" :modal-append-to-body='false'>
            <el-table :data="gridData">
                <el-table-column property="user_id" label="异常用户ID"></el-table-column>
                <el-table-column property="total_income" label="积分明细合计"></el-table-column>
                <el-table-column property="balance" label="总积分数"></el-table-column>
            </el-table>
            <div class="pagination dialog-pagination">
                <div>
                    共{{userExceptionPageParameter.total}}条记录，每页10条
                </div>
                <el-pagination background @current-change="gridDataCurrentChange"
                               :current-page.sync="userExceptionPageParameter.currentPage"
                               :page-sizes="userExceptionPageParameter.pageSizes"
                               :page-size="userExceptionPageParameter.pageSize"
                               layout="prev, pager, next" :total="userExceptionPageParameter.total">
                </el-pagination>
            </div>
            <div>
                <el-button type="primary" @click="dialogTableVisible=false">关闭</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    export default {
        name: "boxList",
        data() {
            return {
                dialogTableVisible: false,
                gridData: [],
                tableData: [],
                pageParameter: {
                    currentPage: 0,
                    nowPage: 0,
                    pageSizes: [10, 20, 30, 40],
                    pageSize: 10,
                    total: 0
                },
                parameter: {
                    start_time: "2019-1-11",
                    end_time: "2099-1-13",
                    page_index: 1,
                    page_size: 10,
                },
                userExceptionPageParameter: {
                    currentPage: 0,
                    nowPage: 0,
                    pageSizes: [10, 20, 30, 40],
                    pageSize: 10,
                    total: 0
                },
                userExceptionParameter: {
                    date: '2019-03-21',
                    page_index: 1,
                    page_size: 10,
                }
            }
        },
        filters: {
            userExceptionFile(val) {
                if (val == 0) {
                    return '正常'
                } else {
                    return '(' + val + '个异常用户)'
                }
            },
            countFile(data) {
                if (data.total_deliver == data.total_income) {
                    return '正常'
                } else {
                    return '(用户积分合计' + data.total_income + ' 平台已发放积分合计' + data.total_deliver + ')'
                }
            },
            countBooFile(data) {
                if (data.total_deliver == data.total_income) {
                    return true
                } else {
                    return false
                }
            }
        },
        mounted() {
            this.getData();
            this.getGridData()
        },
        methods: {
            getData() {
                this.$post(this.$api.storeList, this.parameter)
                    .then((response) => {
                        if (response.code != '10200') {
                            this.msg = response.message
                            return
                        }
                        this.tableData = response.data.list
                        this.pageParameter.total = response.data.total_number
                    })
            },
            getGridData() {
                this.$post(this.$api.userException, this.userExceptionParameter)
                    .then((response) => {
                        if (response.code != '10200') {
                            this.msg = response.message
                            return
                        }
                        this.gridData = response.data.list
                        this.userExceptionPageParameter.total = response.data.total_number
                    })
            },
            handleCurrentChange(val) {
                this.parameter.page_index = val
                this.getData()
            },
            handleClick(e) {
                this.userExceptionParameter.date = e.date
                this.getGridData()
                this.dialogTableVisible=true
            },
            gridDataCurrentChange(val) {
                this.userExceptionPageParameter.page_index = val
                this.getGridData()
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../common/common";

    .a {
        margin-left: 40px;
    }

</style>
