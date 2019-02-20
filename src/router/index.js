import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index'
import login from '@/views/login'



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
            component: index
        }
    ]
})
