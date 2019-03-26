import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import {post, fetch, patch, put} from './utils/http'
import {api} from './utils/api'
import {sync} from 'vuex-router-sync'
import store from './store'

import 'es6-promise/auto'
//定义全局变量
Vue.prototype.$post = post;
Vue.prototype.$fetch = fetch;
Vue.prototype.$patch = patch;
Vue.prototype.$put = put;
Vue.prototype.$api = api;


Vue.use(ElementUI)
sync(store, router)

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app')
