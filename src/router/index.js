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


Vue.use(Router)

export default new Router({
    routes: [
        {
            des: '登录页面',
            path: '/login',
            name: 'login',
            component: login
        },
        {
            des: '首页',
            path: '/',
            name: 'index',
            component: index,
            children: [
                {
                    des: '机构管理',
                    path: '/boxList',
                    name: 'boxList',
                    component: boxList
                }, {
                    des: '用户列表',
                    path: '/userList',
                    name: 'userList',
                    component: userList
                }, {
                    des: '积分对账',
                    path: '/integralList',
                    name: 'integralList',
                    component: integralList
                }, {
                    des: '用户统计',
                    path: '/userStatistics',
                    name: 'userStatistics',
                    component: userStatistics
                }, {
                    des: '盒子统计',
                    path: '/boxStatistics',
                    name: 'boxStatistics',
                    component: boxStatistics
                }, {
                    des: '用户详情',
                    path: '/userDetails',
                    name: 'userDetails',
                    component: userDetails
                }, {
                    des: '盒子详情',
                    path: '/boxDetails',
                    name: 'boxDetails',
                    component: boxDetails
                }
            ], redirect: '/login'//默认显示此子路由
        }
    ]
})
