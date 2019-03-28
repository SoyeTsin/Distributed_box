<template>
    <el-container class="list">
        <el-header height="48px" class="header-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>盒子端管理</el-breadcrumb-item>
                <el-breadcrumb-item><a>用户列表</a></el-breadcrumb-item>
            </el-breadcrumb>
        </el-header>
        <div class="list-content">
            <div class="list-content-top">
                <div class="title">用户列表</div>
                <div>
                    <el-input placeholder="搜索手机号、用户ID" class="search" clearable
                              v-model="parameter.filter_keyword" @input="getData"
                              @clear="getData"></el-input>
                    <!--@keyup.enter.native="getData"-->
                </div>
            </div>
            <el-table class="box-table" @sort-change="sortFun"
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
                        label="用户ID"
                >
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">
                            {{scope.row.user_id|userIdFilter}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="手机号"
                >
                </el-table-column>
                <el-table-column
                        sortable="custom"
                        prop="store_credit"
                        label="积分"
                >
                </el-table-column>
                <el-table-column
                        sortable="custom"
                        prop="register_time"
                        label="注册时间">
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
    </el-container>
</template>

<script>
    export default {
        name: "boxList",
        data() {
            return {
                tableData: [],
                pageParameter: {
                    currentPage: 0,
                    nowPage: 0,
                    pageSizes: [10, 20, 30, 40],
                    pageSize: 10,
                    total: 0
                },
                parameter: {
                    page_index: 1,
                    page_size: 10,
                    filter_keyword: '',
                    sort_type: null,
                    sort_by: null,
                }
            }
        }, filters: {
            userIdFilter(val) {
                return '' + val
            }
        }, mounted() {
            this.getData();
        }, methods: {
            sortFun(e) {
                if (e.order == 'descending') {
                    this.parameter.sort_type = 'desc'
                } else if (e.order == 'ascending') {
                    this.parameter.sort_type = 'asc'
                } else {
                    this.parameter.sort_type = null
                }
                this.parameter.sort_by = e.prop
                this.getData()
            },
            getData() {
                this.$post(this.$api.userList, this.parameter)
                    .then((response) => {
                        if (response.code != '10200') {
                            this.msg = response.message
                            return
                        }
                        this.tableData = response.data.list
                        this.pageParameter.total = response.data.total_number
                    })
            },
            handleCurrentChange(val) {
                this.parameter.page_index = val
                this.getData()
            },
            handleClick(e) {
                this.$router.push({
                    path: '/userDetails',
                    query: e
                })
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
