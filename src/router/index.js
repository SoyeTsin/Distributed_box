import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index'
import login from '@/views/login'

const boxList = () => import('@/views/boxList')
const userList = () => import('@/views/userList')
const integralList = () => import('@/views/integralList')
const userStatistics = () => import('@/views/userStatistics')
const boxStatistics = () => import('@/views/boxStatistics')
const userDetails = () => import('@/views/userDetails')
const boxDetails = () => import('@/views/boxDetails')
const appRegister = () => import('@/views/appRegister')
const appHistory = () => import('@/views/appHistory')
const appReport = () => import('@/views/appReport')


Vue.use(Router)

export default new Router({
    routes: [
        {
            meta: {des: '登录页面'},
            path: '/login',
            name: 'login',
            component: login
        },
        {
            meta: {des: '首页'},
            path: '/',
            name: 'index',
            component: index,
            children: [
                {
                    meta: {des: '机构管理'},
                    path: '/boxList',
                    name: 'boxList',
                    component: boxList
                }, {
                    meta: {des: '用户列表'},
                    path: '/userList',
                    name: 'userList',
                    component: userList
                }, {
                    meta: {des: '积分对账'},
                    path: '/integralList',
                    name: 'integralList',
                    component: integralList
                }, {
                    meta: {des: '用户统计'},
                    path: '/userStatistics',
                    name: 'userStatistics',
                    component: userStatistics
                }, {
                    meta: {des: '盒子统计'},
                    path: '/boxStatistics',
                    name: 'boxStatistics',
                    component: boxStatistics
                }, {
                    meta: {des: '用户详情'},
                    path: '/userDetails',
                    name: 'userDetails',
                    component: userDetails
                }, {
                    meta: {des: '盒子详情'},
                    path: '/boxDetails',
                    name: 'boxDetails',
                    component: boxDetails
                }, {
                    meta: {des: '程序注册'},
                    path: '/appRegister',
                    name: 'appRegister',
                    component: appRegister
                }, {
                    meta: {des: '历史注册'},
                    path: '/appHistory',
                    name: 'appHistory',
                    component: appHistory
                }, {
                    meta: {des: '上报状态'},
                    path: '/appReport',
                    name: 'appReport',
                    component: appReport
                }
            ], redirect: '/login'//默认显示此子路由
        }
    ]
})
