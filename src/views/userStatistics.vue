<template>
    <el-container class="list">
        <el-header height="48px" class="header-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>数据统计</el-breadcrumb-item>
                <el-breadcrumb-item><a href="/">用户统计</a></el-breadcrumb-item>
            </el-breadcrumb>
        </el-header>
        <div class="list-content">
            <div class="list-content-top">
                <div class="title">用户统计</div>
            </div>
            <div class="details-content-top">
                <div class="details-title text-center">
                    <div class="chart-content-title">APP用户数</div>
                </div>
            </div>
            <div class="chart-title blue-title">
                <div>新增数：今日 {{userNumberList.total_appusers[userNumberList.total_appusers.length-1]}} 昨日
                    {{userNumberList.total_appusers[userNumberList.total_appusers.length-2]}}
                </div>
                <div>在线数：今日 {{userNumberList.line_appusers[userNumberList.line_appusers.length-1]}} 昨日
                    {{userNumberList.line_appusers[userNumberList.line_appusers.length-2]}}
                </div>
            </div>
            <div class="chart-title">
                <div>
                    <el-button :class="item.state?'chart-button active':'chart-button'"
                               v-for="item in userNumberButton" v-bind:key="item.id"
                               @click="selectCycle(item,'userNumberButton')">{{item.name}}
                    </el-button>
                </div>
                <div class="legend">
                    <div>新增数</div>
                    <div>在线数</div>
                </div>
            </div>
            <div class="chart-content" id="userNumber"></div>
            <div class="details-content-top">
                <div class="details-title text-center">
                    <div class="chart-content-title">APP软件版本</div>
                </div>
            </div>
            <div class="so-bar-top">
                <div class="so-bar" v-for="(item, ve) in appusersVersionsList" v-bind:key="item.id">
                    <div class="bar-item" v-for="(val,key) in item" v-bind:key="key">
                        <div class="bar">
                            <div class="active" :style="'width: '+val+'%'"></div>
                        </div>
                        <div class="title">{{ve}} {{key}}</div>
                        <div class="title">{{val}}%</div>
                    </div>
                </div>
                <div class="null-data" v-if="JSON.stringify(appusersVersionsList.android)=='{}'&&JSON.stringify(appusersVersionsList.iOS)=='{}'">
                    <div>暂无数据</div>
                </div>
            </div>
        </div>
    </el-container>
</template>

<script>
    import common from '../utils/common'

    let echarts = require('echarts/lib/echarts')
    require('echarts/lib/chart/line')
    // 引入提示框和title组件
    require('echarts/lib/component/tooltip')
    require('echarts/lib/component/title')


    export default {
        name: "boxList",
        data() {
            return {
                userNumberButton: [
                    {name: '24H', state: true, cycle: 0},
                    {name: '一周', state: false, cycle: 6},
                    {name: '一月', state: false, cycle: 29},
                    {name: '半年', state: false, cycle: 182}
                ],
                userNumberParameter: {
                    start_time: '',
                    end_time: '',
                },
                userNumberList: {
                    line_appusers: [0, 0],
                    total_appusers: [0, 0]
                },
                appusersVersionsList: {},
                titleData: {
                    today: {add: 0, online: 0}
                }
            }
        },
        mounted() {
            this.userNumberParameter = common.getDataDay(0)

            this.onlineNumber()
            this.appusersVersions()
        },
        filters: {
            ifNull(obj) {
                debugger
                for (let key in obj) {
                    return true;
                }
                return false;
            }
        },
        methods: {
            selectCycle(item, name) {
                let list = []
                if (name == 'userNumberButton') {
                    list = this.userNumberButton
                    this.userNumberParameter = common.getDataDay(item.cycle)
                    this.onlineNumber()
                }
                for (let i in list) {
                    list[i].state = false
                }
                item.state = true
            },
            onlineNumber() {
                this.$post(this.$api.appusersOnline, this.userNumberParameter)
                    .then((response) => {
                        if (response.code != '10200') {
                            this.msg = response.message
                            return
                        }

                        this.$post(this.$api.appusersNew, this.userNumberParameter)
                            .then((newResponse) => {
                                if (newResponse.code != '10200') {
                                    this.msg = newResponse.message
                                    return
                                }
                                this.userNumberList = {
                                    date: [],
                                    line_appusers: [],
                                    total_appusers: []
                                }
                                for (let i in response.data) {
                                    this.userNumberList.date.push(response.data[i].date)
                                    this.userNumberList.line_appusers.push(response.data[i].total_appusers)
                                    this.userNumberList.total_appusers.push(newResponse.data[i].total_appusers)
                                }
                                this.userNumberEchart()
                            })
                    })
            },
            userNumberEchart() {
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('userNumber'));
                // 指定图表的配置项和数据
                var option = {
                    legend: {
                        data: ['新增数', '在线数']
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter(params) {
                            let relVal = params[0].axisValue
                            for (let i = 0, l = params.length; i < l; i++) {
                                let color = (typeof (params[i].color) == 'string') ? params[i].color : ('linear-gradient(180deg, ' + params[i].color.colorStops[0].color + ', ' + params[i].color.colorStops[1].color + ');')
                                relVal += '<div style="box-sizing:border-box;padding: 0 10px;width: 180px;display: flex;justify-content: space-between;margin: 10px 0 4px 0"><div><div style="float:left;margin:5px;width: 10px;height: 10px;border-radius: 50%;background: ' + color + '"></div>' + params[i].seriesName + ' </div><div> ' + params[i].value + "</div></div>";
                            }
                            return relVal;
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: this.userNumberList.date,
                        axisTick: {
                            alignWithLabel: true
                        },
                    },
                    yAxis: {
                        type: 'value',
                        name: '小时/天',
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        }
                    },
                    series: [{
                        name: '新增数',
                        type: 'line',
                        data: this.userNumberList.total_appusers,
                        itemStyle: {
                            normal: {
                                color: '#6AADF4',
                                lineStyle: {
                                    color: '#6AADF4'
                                }
                            }
                        },
                    }, {
                        name: '在线数',
                        type: 'line',
                        data: this.userNumberList.line_appusers,
                        itemStyle: {
                            normal: {
                                color: '#EB24B0',
                                lineStyle: {
                                    color: '#EB24B0'
                                }
                            }
                        },
                    }]
                };
                myChart.setOption(option);
            },
            appusersVersions() {
                this.$post(this.$api.appusersVersions, this.userNumberParameter)
                    .then((response) => {
                        if (response.code != '10200') {
                            this.msg = response.message
                            return
                        }
                        let android = response.data.Android
                        let iOS = response.data.iOS
                        this.appusersVersionsList = {
                            android, iOS
                        }
                    })
            },
        }
    }
</script>

<style scoped lang="less">
    @import "../common/common";


</style>
