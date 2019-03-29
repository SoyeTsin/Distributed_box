<template>
    <el-container class="details">
        <el-header height="48px" class="header-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>用户端管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/userList' }"><a>用户列表</a></el-breadcrumb-item>
                <el-breadcrumb-item><a>用户ID {{user_id}}</a></el-breadcrumb-item>
            </el-breadcrumb>
        </el-header>
        <div class="details-content">
            <div class="details-content-top">
                <div class="details-title">
                    <div>用户ID：{{user_id}}</div>
                    <div>手机号：{{mobile}}</div>
                    <div>注册时间：{{register_time}}</div>
                </div>
            </div>
            <el-table class="box-table"
                      empty-text="暂无绑定任何设备"
                      :header-cell-style="{background:'rgb(244,247,251)'}"
                      :data="boxList"
                      stripe
                      style="width: 100%">
                <el-table-column
                        prop=""
                        label=""
                        width="36">
                </el-table-column>
                <el-table-column
                        label="盒子Device ID">
                    <template slot-scope="scope">
                        <el-button @click="boxClick(scope.row)" type="text" size="small">
                            {{scope.row.device_id|stringFilter}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="device_type"
                        label="机型"
                >
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        label="版本（固件／软件）">
                    <template slot-scope="scope">
                        {{scope.row.firmware_version}}／{{scope.row.software_version}}
                    </template>
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        label="容量／（总量／共享／已用）">
                    <template slot-scope="scope">
                        {{scope.row.storage_total|numFil}}／{{scope.row.storage_shared|numFil}}／{{scope.row.storage_used|numFil}}
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <div>
                    共{{boxPageParameter.total}}条记录，每页10条
                </div>
                <el-pagination background @current-change="handleCurrentChange"
                               :current-page.sync="boxPageParameter.currentPage"
                               :page-sizes="boxPageParameter.pageSizes"
                               :page-size="boxPageParameter.pageSize"
                               layout="prev, pager, next" :total="boxPageParameter.total">
                </el-pagination>
            </div>
            <div class="details-content-top">
                <div class="details-title">
                    <div>积分详情</div>
                </div>
            </div>
            <el-table class="box-table"
                      :header-cell-style="{background:'rgb(244,247,251)'}"
                      :data="storeList"
                      stripe
                      style="width: 100%">
                <el-table-column
                        prop=""
                        label=""
                        width="36">
                </el-table-column>
                <el-table-column
                        prop="credit_count"
                        label="积分数目"
                >
                </el-table-column>
                <el-table-column
                        label="盒子Device ID"
                >
                    <template slot-scope="scope">
                        <el-button @click="boxClick(scope.row)" type="text" size="small">
                            {{scope.row.device_id|stringFilter}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="transaction_time"
                        sortable
                        label="收入时间">
                </el-table-column>
            </el-table>
            <div class="pagination">
                <div>
                    共{{storePageParameter.total}}条记录，每页10条
                </div>
                <el-pagination background @current-change="handleClick"
                               :current-page.sync="storePageParameter.currentPage"
                               :page-sizes="storePageParameter.pageSizes"
                               :page-size="storePageParameter.pageSize"
                               layout="prev, pager, next" :total="storePageParameter.total">
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
                user_id: '', mobile: '', register_time: '',
                boxList: [],
                storeList: [],
                boxParameter: {
                    page_index: 1,
                    page_size: 10,
                },
                storeParameter: {
                    page_index: 1,
                    page_size: 10,
                },

                boxPageParameter: {
                    currentPage: 0,
                    nowPage: 0,
                    pageSizes: [10, 20, 30, 40],
                    pageSize: 10,
                    total: 0
                },
                storePageParameter: {
                    currentPage: 0,
                    nowPage: 0,
                    pageSizes: [10, 20, 30, 40],
                    pageSize: 10,
                    total: 0
                },

            }
        }, filters: {
            stringFilter(val) {
                return '' + val
            },
            numFil(num) {
                num = (num / (1000 * 1000 * 1000 * 1000)).toFixed(2)
                return num + ' GB'
            }
        }, mounted() {
            this.user_id = this.$route.query.user_id
            this.mobile = this.$route.query.mobile
            this.register_time = this.$route.query.register_time
            this.getUserDetails();
            this.getCheck();
        }, methods: {
            getUserDetails() {
                this.$post(this.$api.userDetails + this.user_id, this.boxParameter)
                    .then((response) => {
                        if (response.code != '10200') {
                            this.msg = response.message
                            return
                        }
                        this.boxList = response.data.list
                        this.boxPageParameter.total = response.data.total_number
                    })
            },
            getCheck() {
                this.$post(this.$api.storeCredits + this.user_id, this.storeParameter)
                    .then((response) => {
                        if (response.code != '10200') {
                            this.msg = response.message
                            return
                        }
                        this.storeList = response.data.list
                        this.storePageParameter.total = response.data.total_number
                    })
            },

            handleCurrentChange(val) {
                this.boxPageParameter.page_index = val
                this.getData()
            },
            handleClick(val) {
                this.storePageParameter.page_index = val
                this.getData()
            },
            boxClick(e) {
                this.$router.push({
                    path: '/boxDetails',
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
