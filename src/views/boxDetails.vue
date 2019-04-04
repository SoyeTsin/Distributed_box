<template>
    <el-container class="details">
        <el-header height="48px" class="header-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>盒子端管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/boxList' }"><a>盒子列表</a></el-breadcrumb-item>
                <el-breadcrumb-item><a>盒子{{device_id}}</a></el-breadcrumb-item>
            </el-breadcrumb>
        </el-header>
        <div class="details-content">
            <div class="details-content-top">
                <div class="details-title">
                    <div>盒子Device ID：{{device_id}}</div>
                </div>
            </div>
            <el-table class="box-table"
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
                        prop="node_id"
                        label="Node ID"
                >
                </el-table-column>
                <el-table-column
                        prop="device_type"
                        label="机型"
                >
                </el-table-column>
                <el-table-column
                        prop="activate_time"
                        label="激活时间"
                        width="160">
                </el-table-column>
                <el-table-column
                        prop="user_id"
                        label="绑定用户 ID"
                >
                </el-table-column>
                <el-table-column
                        prop="sharding_count"
                        label="分片数"
                >
                </el-table-column>
                <el-table-column
                        prop="device_rating"
                        label="评分"
                >
                </el-table-column>
                <el-table-column
                        prop="os_info"
                        label="系统信息"
                >
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        label="容量／（总量／共享／已用）">
                    <template slot-scope="scope">
                        {{scope.row.storage_total}}／{{scope.row.storage_shared}}／{{scope.row.storage_used}}
                    </template>
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        label="版本（固件／软件）">
                    <template slot-scope="scope">
                        {{scope.row.firmware_version}}／{{scope.row.software_version}}
                    </template>
                </el-table-column>

            </el-table>
            <div class="details-content-top">
                <div class="details-title text-center">
                    <div>盒子在线时间</div>
                </div>
            </div>
            <div class="chart-title">
                <div>
                    <el-button :class="item.state?'chart-button active':'chart-button'"
                               v-for="item in boxLiveTimeButton" v-bind:key="item.id"
                               @click="selectCycle(item,'boxLiveTimeButton')">{{item.name}}
                    </el-button>
                </div>
                <div class="right">平均时间：{{pingjun}}小时／天</div>
            </div>
            <div class="chart-content" id="boxListTime"></div>
            <div class="details-content-top">
                <div class="details-title text-center">
                    <div>盒子网络宽带</div>
                </div>
            </div>
            <div class="chart-title">
                <div>
                    <el-button :class="item.state?'chart-button active':'chart-button'"
                               v-for="item in boxBandwidthButton" v-bind:key="item.id"
                               @click="selectCycle(item,'boxBandwidthButton')">{{item.name}}
                    </el-button>
                </div>
                <div class="legend">
                    <div>上行</div>
                    <div>下行</div>
                </div>
                <div class="right">
                    平均上行宽带：{{averageBandwidth.up_stream}}M/S 平均下行宽带{{averageBandwidth.down_stream}}M/S
                </div>
            </div>
            <div class="chart-content" id="boxBandwidth"></div>
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
                pingjun: 0,
                boxLiveTimeButton: [
                    {name: '一周', state: true, cycle: 6},
                    {name: '一月', state: false, cycle: 29},
                    {name: '三月', state: false, cycle: 89},
                    {name: '半年', state: false, cycle: 182}
                ],
                boxBandwidthButton: [
                    {name: '一周', state: true, cycle: 6},
                    {name: '一月', state: false, cycle: 29},
                    {name: '三月', state: false, cycle: 89},
                    {name: '半年', state: false, cycle: 182}
                ],
                averageBandwidth: {
                    up_stream: 0,
                    down_stream: 0,
                },
                device_id: '',
                boxList: [],
                storeList: [],
                boxLiveTimeList: [],
                boxBandwidthList: [],
                boxParameter: {
                    page_index: 1,
                    page_size: 10,
                },
                boxLiveParameter: {
                    start_time: '',
                    end_time: '',
                },
                boxBandwidthParameter: {
                    start_time: '',
                    end_time: '',
                },
            }
        }, mounted() {
            this.device_id = this.$route.query.device_id
            this.getBoxDetails()
            this.boxLiveParameter = common.getDataDay(6)
            this.boxLiveTime()
            this.boxBandwidthParameter = common.getDataDay(6)
            this.boxBandwidth()
        }, methods: {
            selectCycle(item, name) {
                let list = []
                if (name == 'boxLiveTimeButton') {
                    list = this.boxLiveTimeButton
                    this.boxLiveParameter = common.getDataDay(item.cycle)
                    this.boxLiveTime()
                } else {
                    list = this.boxBandwidthButton
                    this.boxBandwidthParameter = common.getDataDay(item.cycle)
                    this.boxBandwidth()
                }
                for (let i in list) {
                    list[i].state = false
                }
                item.state = true
            },
            getBoxDetails() {
                this.$post(this.$api.boxDetails + this.device_id, this.boxParameter)
                    .then((response) => {
                        if (response.code != '10200') {
                            this.msg = response.message
                            return
                        }
                        this.boxList.push(response.data)
                    })
            },
            boxLiveTime() {
                this.$post(this.$api.boxLiveTime + this.device_id, this.boxLiveParameter)
                    .then((response) => {
                        if (response.code != '10200') {
                            this.msg = response.message
                            return
                        }
                        this.boxLiveTimeList = {
                            date: [],
                            livetime: [],
                        }
                        let pingjun = 0
                        for (let i in response.data) {
                            this.boxLiveTimeList.date.push(response.data[i].date)
                            this.boxLiveTimeList.livetime.push((response.data[i].livetime / 3600).toFixed(2))
                            pingjun += response.data[i].livetime * 1
                        }
                        this.pingjun = ((pingjun / this.boxLiveTimeList.date.length) / 3600).toFixed(2)
                        this.setliveTimeEchart()
                    })
            },
            boxBandwidth() {
                this.$post(this.$api.boxBandwidth + this.device_id, this.boxBandwidthParameter)
                    .then((response) => {
                        if (response.code != '10200') {
                            this.msg = response.message
                            return
                        }
                        this.boxBandwidthList = {
                            date: [],
                            up_stream: [],
                            down_stream: [],
                        }
                        let averageBandwidth = {
                            up_stream: 0,
                            down_stream: 0,
                        }
                        let countBandwidth = {
                            up_stream: 0,
                            down_stream: 0,
                        }
                        for (let i in response.data) {
                            this.boxBandwidthList.date.push(response.data[i].date)
                            this.boxBandwidthList.up_stream.push((response.data[i].up_stream / 1000000).toFixed(2))
                            this.boxBandwidthList.down_stream.push((response.data[i].down_stream / 1000000).toFixed(2))
                            countBandwidth.up_stream += response.data[i].up_stream
                            countBandwidth.down_stream += response.data[i].down_stream
                        }
                        averageBandwidth.up_stream = (countBandwidth.up_stream / response.data.length / 1000000).toFixed(2)
                        averageBandwidth.down_stream = (countBandwidth.down_stream / response.data.length / 1000000).toFixed(2)
                        this.averageBandwidth = averageBandwidth
                        this.setBoxBandwidthEchart()
                    })
            },
            handleCurrentChange(val) {
                this.boxParameter.page_index = val
                this.getData()
            },
            handleClick(e) {
                this.$router.push({
                    path: '/userDetails',
                    query: e
                })
            },
            setliveTimeEchart() {
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('boxListTime'));
                // 指定图表的配置项和数据
                var option = {
                    tooltip: {
                        trigger: 'axis',
                        formatter(params) {
                            let relVal = params[0].axisValue
                            for (let i = 0, l = params.length; i < l; i++) {
                                let color = (typeof (params[i].color) == 'string') ? params[i].color : ('linear-gradient(180deg, ' + params[i].color.colorStops[0].color + ', ' + params[i].color.colorStops[1].color + ');')
                                relVal += '<div style="box-sizing:border-box;padding: 0 10px;width: 180px;display: flex;justify-content: space-between;margin: 10px 0 4px 0"><div><div style="float:left;margin:5px;width: 10px;height: 10px;border-radius: 50%;background: ' + color + '"></div>' + params[i].seriesName + ' </div><div> ' + params[i].value + " 小时</div></div>";
                            }
                            return relVal;
                        }
                    },
                    legend: {
                        data: ['在线时长']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        data: this.boxLiveTimeList.date
                    },
                    yAxis: {
                        type: 'value',
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        }
                    },
                    series: [{
                        name: '在线时长',
                        type: 'line',
                        data: this.boxLiveTimeList.livetime,
                        itemStyle: {
                            normal: {
                                color: '#6AADF4',
                                lineStyle: {
                                    color: '#6AADF4'
                                }
                            }
                        },
                    }]
                };
                myChart.setOption(option);
            },
            setBoxBandwidthEchart() {
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('boxBandwidth'));
                // 指定图表的配置项和数据
                var option = {
                    tooltip: {
                        trigger: 'axis',
                        formatter(params) {
                            let relVal = params[0].axisValue
                            for (let i = 0, l = params.length; i < l; i++) {
                                let color = (typeof (params[i].color) == 'string') ? params[i].color : ('linear-gradient(180deg, ' + params[i].color.colorStops[0].color + ', ' + params[i].color.colorStops[1].color + ');')
                                relVal += '<div style="box-sizing:border-box;padding: 0 10px;width: 180px;display: flex;justify-content: space-between;margin: 10px 0 4px 0"><div><div style="float:left;margin:5px;width: 10px;height: 10px;border-radius: 50%;background: ' + color + '"></div>' + params[i].seriesName + ' </div><div> ' + params[i].value + " M/S</div></div>";
                            }
                            return relVal;
                        }
                    },
                    legend: {
                        data: ['上行宽带', '下行宽带']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: this.boxBandwidthList.date,
                        axisTick: {
                            alignWithLabel: true
                        },
                    },
                    yAxis: {
                        type: 'value',
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        }
                    },
                    series: [{
                        name: '上行宽带',
                        type: 'line',
                        data: this.boxBandwidthList.up_stream,
                        itemStyle: {
                            normal: {
                                color: '#6AADF4',
                                lineStyle: {
                                    color: '#6AADF4'
                                }
                            }
                        },
                    }, {
                        name: '下行宽带',
                        type: 'line',
                        data: this.boxBandwidthList.down_stream,
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
        }
    }
</script>

<style scoped lang="less">
    @import "../common/common";

</style>
