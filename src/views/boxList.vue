<template>
    <el-container class="list">
        <el-header height="48px" class="header-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>盒子端管理</el-breadcrumb-item>
                <el-breadcrumb-item><a>盒子列表</a></el-breadcrumb-item>
            </el-breadcrumb>
        </el-header>
        <div class="list-content">
            <div class="list-content-top">
                <div class="title"> 盒子列表</div>
                <div>
                    <el-input placeholder="搜索盒子Device ID、Node ID、用户ID" class="search" clearable
                              v-model="parameter.filter_keyword" @input="getData"
                              @clear="getData"></el-input>
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
                        fixed
                        width="36">
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        fixed
                        label="Device ID">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">
                            {{scope.row.device_id|stringFilter}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="node_id"
                        show-overflow-tooltip
                        label="Node ID">
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        prop="device_type"
                        label="机型"
                        width="90">
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        label="绑定用户 ID">
                    <template slot-scope="scope">
                        {{scope.row.user_id|ifNull}}
                    </template>
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        prop="activate_time"
                        width="160"
                        sortable="custom"
                        label="激活时间">
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
                <el-table-column
                        width="60"
                        label="评分">
                    <template>
                        -
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
            stringFilter(val) {
                return '' + val
            },
            numFil(num) {
                num = (num / (1000 * 1000 * 1000 * 1000)).toFixed(2)
                return num + ' GB'
            },
            ifNull(val) {
                if (val) {
                    return val
                } else {
                    return '无'
                }
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            sortFun(e) {
                if (e.order == 'descending') {
                    this.parameter.sort_type = 'desc'
                } else if (e.order == 'ascending') {
                    this.parameter.sort_type = 'asc'
                } else {
                    this.parameter.sort_type = null
                }
                this.getData()
            },
            getData() {
                this.$post(this.$api.boxList, this.parameter)
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
