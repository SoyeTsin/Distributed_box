<template>
    <el-container class="list">
        <el-header height="48px" class="header-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>数据统计</el-breadcrumb-item>
                <el-breadcrumb-item><a href="/">盒子节点统计</a></el-breadcrumb-item>
            </el-breadcrumb>
        </el-header>
        <div class="list-content">
            <div class="list-content-top">
                <div class="title">盒子节点统计</div>
            </div>
            <div class="details-content-top">
                <div class="details-title text-center">
                    <div class="chart-content-title">盒子节点数</div>
                </div>
            </div>
            <div class="chart-title blue-title">
                <div>新增数：今日 {{devicesList.total_new[devicesList.total_new.length-1]}} 昨日
                    {{devicesList.total_new[devicesList.total_new.length-2]}}
                </div>
                <div>在线数：今日 {{devicesList.total_live[devicesList.total_live.length-1]}} 昨日
                    {{devicesList.total_live[devicesList.total_live.length-2]}}
                </div>
                <div>累计数：新增 {{devicesCount.total_new}} 在线 {{devicesCount.total_live}}</div>
            </div>
            <div class="chart-title">
                <div>
                    <el-button :class="item.state?'chart-button active':'chart-button'"
                               v-for="item in devicesButton" v-bind:key="item.id"
                               @click="selectCycle(item,'devicesButton')">{{item.name}}
                    </el-button>
                </div>
                <div class="legend">
                    <div>新增数</div>
                    <div>在线数</div>
                </div>
            </div>
            <div class="chart-content" id="devices"></div>
            <div class="details-content-top">
                <div class="details-title text-center">
                    <div class="chart-content-title">盒子节点空间</div>
                </div>
            </div>
            <div class="chart-title blue-title">
                <div>共享空间：今日 {{boxSpaceList.storage_shared[boxSpaceList.storage_shared.length-1]}}GB 昨日
                    {{boxSpaceList.storage_shared[boxSpaceList.storage_shared.length-2]}}GB
                </div>
                <div>已用空间：今日 {{boxSpaceList.storage_free[boxSpaceList.storage_free.length-1]}}GB 昨日
                    {{boxSpaceList.storage_free[boxSpaceList.storage_free.length-2]}}GB
                </div>
                <div>累计数：共享空间 {{boxSpaceCount.storage_shared|numFil}}TB 已用空间 {{boxSpaceCount.storage_free|numFil}}TB
                </div>
            </div>
            <div class="chart-title">
                <div>
                    <el-button :class="item.state?'chart-button active':'chart-button'"
                               v-for="item in boxSpaceButton" v-bind:key="item.id"
                               @click="selectCycle(item,'boxSpaceButton')">{{item.name}}
                    </el-button>
                </div>
                <div class="legend">
                    <div>共享空间</div>
                    <div>已用空间</div>
                </div>
            </div>
            <div class="chart-content" id="boxSpace"></div>
            <div class="details-content-top">
                <div class="details-title text-center">
                    <div class="chart-content-title">盒子在线时间</div>
                </div>
            </div>
            <div class="chart-title">
                <div>
                    <el-button :class="item.state?'chart-button active':'chart-button'"
                               v-for="item in boxOnlineButton" v-bind:key="item.id"
                               @click="selectCycle(item,'boxOnlineButton')">{{item.name}}
                    </el-button>
                </div>
                <div>
                    平均在线时长：18.33小时／天
                </div>
            </div>
            <div class="chart-content" id="boxLiveTime"></div>
            <div class="chart-title">
                <div>
                    七日平均在线时长占比
                </div>
                <div>
                    平均在线时长：{{weekly.daily_average}}小时／天
                </div>
            </div>
            <div class="so-bar">
                <div class="bar-item" v-for="(item,key) in weekly.list" v-bind:key="key">
                    <div class="bar">
                        <div class="active" :style="'width: '+item.val+'%'"></div>
                    </div>
                    <div class="title">{{item.name}}</div>
                    <div class="title">{{item.val}}%</div>
                </div>
            </div>
            <div class="details-content-top">
                <div class="details-title text-center">
                    <div class="chart-content-title">盒子版本</div>
                </div>
            </div>
            <div class="scroll-content">
                <div>
                    <div class="scroll-content-item" id="box-software"></div>
                    <div>盒子不同软件版本占比饼图</div>
                </div>
                <div>
                    <div class="scroll-content-item" id="box-sdk"></div>
                    <div>盒子不同SDK版本占比饼图</div>
                </div>
            </div>

        </div>
    </el-container>
</template>

<script>
    import common from '../utils/common'

    let echarts = require('echarts/lib/echarts')
    require('echarts/lib/chart/line')
    require('echarts/lib/chart/pie')
    // 引入提示框和title组件
    require('echarts/lib/component/tooltip')
    require('echarts/lib/component/title')


    export default {
        name: "boxList",
        data() {
            return {
                weekly: {
                    daily_average: 0,
                    list: [
                        {name: '20小时以上', val: 0},
                        {name: '12-20小时', val: 0},
                        {name: '5-11小时', val: 0},
                        {name: '5小时以下', val: 0}
                    ]
                },
                devicesButton: [
                    {name: '一周', state: true, cycle: 7},
                    {name: '一月', state: false, cycle: 30},
                    {name: '三月', state: false, cycle: 90},
                    {name: '半年', state: false, cycle: 183}
                ],
                boxSpaceButton: [
                    {name: '一周', state: true, cycle: 7},
                    {name: '一月', state: false, cycle: 30},
                    {name: '三月', state: false, cycle: 90},
                    {name: '半年', state: false, cycle: 183}
                ],
                boxOnlineButton: [
                    {name: '一周', state: true, cycle: 7},
                    {name: '一月', state: false, cycle: 30},
                    {name: '三月', state: false, cycle: 90},
                    {name: '半年', state: false, cycle: 183}
                ],
                boxSpaceParameter: {
                    start_time: '',
                    end_time: '',
                },
                boxOnlineParameter: {
                    start_time: '',
                    end_time: '',
                },
                devicesLiveParameter: {
                    start_time: '',
                    end_time: '',
                },
                devicesParameter: {
                    start_time: '',
                    end_time: '',
                },
                devicesLiveList: {},
                devicesList: {
                    total_live: [0, 0],
                    total_new: [0, 0]
                },
                versionsList: {},
                boxSpaceList: {
                    storage_free: [0, 0],
                    storage_shared: [0, 0]
                },
                boxSpaceCount: {
                    storage_shared: 0,
                    storage_free: 0
                },
                devicesCount: {
                    total_live: 0,
                    total_new: 0
                }
            }
        },
        filters: {
            numFil(num) {
                num = (num / (1000 * 1000 * 1000 * 1000)).toFixed(2)
                return num
            }
        },
        mounted() {
            this.devicesLiveParameter = common.getDataDay(7)
            this.boxOnlineParameter = common.getDataDay(7)
            this.boxSpaceParameter = common.getDataDay(7)
            this.devicesParameter = common.getDataDay(7)
            this.devicesLive()
            this.boxSpace()
            this.devices()
            this.versions()
            this.weeklyFun()
        },
        methods: {
            selectCycle(item, name) {
                let list = []
                if (name == 'devicesLiveButton') {
                    list = this.devicesLiveButton
                    this.devicesLiveParameter = common.getDataDay(item.cycle)
                    this.devicesLive()
                } else if (name == 'boxSpaceButton') {
                    list = this.boxSpaceButton
                    this.boxSpaceParameter = common.getDataDay(item.cycle)
                    this.boxSpace()
                } else if (name == 'boxOnlineButton') {
                    list = this.boxOnlineButton
                    this.boxOnlineParameter = common.getDataDay(item.cycle)
                    this.boxBandwidth()
                } else if (name == 'devicesButton') {
                    list = this.devicesButton
                    this.devicesParameter = common.getDataDay(item.cycle)
                    this.devices()
                }
                for (let i in list) {
                    list[i].state = false
                }
                item.state = true
            },
            weeklyFun() {
                this.weekly = {
                    daily_average: 0,
                    list: []
                }
                this.$post(this.$api.weekly)
                    .then((response) => {
                        if (response.code != '10200') {
                            this.msg = response.message
                            return
                        }
                        this.weekly.daily_average = (response.data.daily_average/60/60).toFixed(2) || 0
                        let count = response.data.total_20plus * 1 + response.data.total_12to20 * 1 + response.data.total_5to12 * 1 + response.data.total_5minus * 1
                        this.weekly.list.push({
                            name: '20小时以上',
                            val: (response.data.total_20plus / count * 100).toFixed(2) || 0
                        })
                        this.weekly.list.push({
                            name: '12-20小时',
                            val: (response.data.total_12to20 / count * 100).toFixed(2) || 0
                        })
                        this.weekly.list.push({
                            name: '5-11小时',
                            val: (response.data.total_5to12 / count * 100).toFixed(2) || 0
                        })
                        this.weekly.list.push({
                            name: '5小时以下',
                            val: (response.data.total_5minus / count * 100).toFixed(2) || 0
                        })
                    })
            },
            devicesLive() {
                this.$post(this.$api.devicesLive, this.devicesLiveParameter)
                    .then((response) => {
                        if (response.code != '10200') {
                            this.msg = response.message
                            return
                        }
                        this.devicesLiveList = {
                            date: [],
                            total_live: [],
                        }
                        for (let i in response.data) {
                            this.devicesLiveList.date.push(response.data[i].date)
                            this.devicesLiveList.total_live.push(response.data[i].total_live)
                        }
                        this.devicesLiveEchart()
                    })
            },
            boxSpace() {
                this.$post(this.$api.storage, this.boxSpaceParameter)
                    .then((response) => {
                        if (response.code != '10200') {
                            this.msg = response.message
                            return
                        }
                        this.boxSpaceList = {
                            date: [],
                            storage_free: [],
                            storage_shared: [],
                        }
                        this.boxSpaceCount = {
                            storage_shared: 0,
                            storage_free: 0
                        }
                        for (let i in response.data) {
                            this.boxSpaceList.date.push(response.data[i].date)
                            let storage_free = ((response.data[i].storage_shared - response.data[i].storage_free) / (1000 * 1000 * 1000)).toFixed(2)
                            let storage_shared = (response.data[i].storage_shared / (1000 * 1000 * 1000)).toFixed(2)
                            this.boxSpaceList.storage_free.push(storage_free)
                            this.boxSpaceList.storage_shared.push(storage_shared)
                            this.boxSpaceCount.storage_free += (response.data[i].storage_shared - response.data[i].storage_free) * 1
                            this.boxSpaceCount.storage_shared += response.data[i].storage_shared * 1
                        }

                        this.boxSpaceEchart()
                    })
            },
            boxSpaceEchart() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('boxSpace'));
                // 指定图表的配置项和数据
                let option = {
                    tooltip: {
                        trigger: 'axis',
                        formatter(params) {
                            let relVal = params[0].axisValue
                            for (let i = 0, l = params.length; i < l; i++) {
                                let color = (typeof (params[i].color) == 'string') ? params[i].color : ('linear-gradient(180deg, ' + params[i].color.colorStops[0].color + ', ' + params[i].color.colorStops[1].color + ');')
                                relVal += '<div style="box-sizing:border-box;padding: 0 10px;width: 180px;display: flex;justify-content: space-between;margin: 10px 0 4px 0"><div><div style="float:left;margin:5px;width: 10px;height: 10px;border-radius: 50%;background: ' + color + '"></div>' + params[i].seriesName + ' </div><div> ' + params[i].value + " GB</div></div>";
                            }
                            return relVal;
                        }
                    },
                    legend: {
                        data: ['共享空间', '已用空间']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: this.boxSpaceList.date,
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
                        name: '共享空间',
                        type: 'line',
                        data: this.boxSpaceList.storage_shared,
                        itemStyle: {
                            normal: {
                                color: '#6AADF4',
                                lineStyle: {
                                    color: '#6AADF4'
                                }
                            }
                        },
                    }, {
                        name: '已用空间',
                        type: 'line',
                        data: this.boxSpaceList.storage_free,
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
            devicesLiveEchart() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('boxLiveTime'));
                // 指定图表的配置项和数据
                let option = {
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
                    legend: {
                        data: ['在线数']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: this.devicesLiveList.date,
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
                        name: '在线数',
                        type: 'line',
                        data: this.devicesLiveList.total_live,
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
            devices() {
                const that = this
                that.$post(that.$api.devicesLive, that.devicesParameter)
                    .then((onlineRes) => {
                        if (onlineRes.code != '10200') {
                            that.msg = onlineRes.message
                            return
                        }
                        that.$post(that.$api.devicesNew, that.devicesParameter)
                            .then((response) => {
                                if (response.code != '10200') {
                                    that.msg = response.message
                                    return
                                }
                                that.devicesList = {
                                    date: [],
                                    total_live: [],
                                    total_new: [],
                                }
                                that.devicesCount = {
                                    total_live: 0,
                                    total_new: 0
                                }
                                for (let i in response.data) {
                                    that.devicesList.date.push(response.data[i].date)
                                    that.devicesList.total_live.push(onlineRes.data[i].total_live)
                                    that.devicesList.total_new.push(response.data[i].total_new)
                                    that.devicesCount.total_live += onlineRes.data[i].total_live * 1
                                    that.devicesCount.total_new += response.data[i].total_new * 1
                                }
                                that.devicesEchart()
                            })
                    })
            },
            devicesEchart() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('devices'));
                // 指定图表的配置项和数据
                let option = {
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
                    legend: {
                        data: ['新增数', '在线数']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: this.devicesList.date,
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
                        name: '新增数',
                        type: 'line',
                        data: this.devicesList.total_new,
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
                        data: this.devicesList.total_live,
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
            versions() {
                const that = this
                that.$post(that.$api.devicesVersions, that.devicesParameter)
                    .then((response) => {
                        if (response.code != '10200') {
                            that.msg = response.message
                            return
                        }
                        that.versionsList = {
                            soft_versionDate: [],
                            SDK_versionDate: [],
                            soft_version: [],
                            SDK_version: [],
                        }
                        for (let i in response.data.soft_version) {
                            that.versionsList.soft_versionDate.push('' + i)
                            that.versionsList.soft_version.push({
                                name: '' + i,
                                value: response.data.soft_version[i]
                            })
                        }
                        for (let i in response.data.SDK_version) {
                            that.versionsList.SDK_versionDate.push('' + i)
                            that.versionsList.SDK_version.push({
                                name: '' + i,
                                value: response.data.SDK_version[i]
                            })
                        }
                        that.boxSoftwareEchart()
                        that.boxSDKEchart()
                    })
            },
            boxSoftwareEchart() {
                const that = this
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('box-software'));
                // 指定图表的配置项和数据
                let option = {
                    title: {
                        subtext: '盒子软件',
                        subtextStyle: {
                            fontSize: 16,
                            color: "#7A8198",
                        },
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} %"
                    },
                    legend: {
                        data: that.versionsList.soft_versionDate
                    },
                    series: [
                        {
                            name: '盒子软件',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            color: function (params) {
                                // build a color map as your need.
                                var colorList = [
                                    '#0F5AEA', '#F5A623', '#2b2df5', '#0E4578', '#0E5A78',
                                    '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                ];
                                return colorList[params.dataIndex]
                            },
                            data: that.versionsList.soft_version,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                myChart.setOption(option);
            },
            boxSDKEchart() {
                const that = this
                let date = JSON.parse(JSON.stringify(that.versionsList.SDK_versionDate))
                let data = JSON.parse(JSON.stringify(that.versionsList.SDK_version))
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('box-sdk'));
                // 指定图表的配置项和数据
                // 指定图表的配置项和数据
                let option = {
                    title: {
                        subtext: '盒子SDK',
                        subtextStyle: {
                            fontSize: 16,
                            color: "#7A8198",
                        },
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} %"
                    },
                    legend: {
                        data: date
                    },
                    series: [
                        {
                            name: '盒子SDK',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: data,
                            color: function (params) {
                                // build a color map as your need.
                                var colorList = [
                                    '#0F5AEA', '#F5A623', '#4345F5', '#0E4578', '#0E5A78',
                                    '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                ];
                                return colorList[params.dataIndex]
                            },
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                myChart.setOption(option);
            },
        }
    }
</script>

<style scoped lang="less">
    @import "../common/common";


</style>
