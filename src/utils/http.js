import axios from 'axios';
import router from '../router'

axios.defaults.timeout = 5000;
// axios.defaults.baseURL = 'https://119.147.216.189';https://p2p-plt.yingxiang.pingan.com:8012
axios.defaults.baseURL = 'https://p2p-plt.yingxiang.pingan.com:8012';
// axios.defaults.baseURL = 'https://p2p-ply';


//http request 拦截器
axios.interceptors.request.use(
    config => {
        let token = localStorage.getItem('token');
        let refresToken = localStorage.getItem('refresToken');
        config.data = JSON.stringify(config.data);
        config.headers = {
            'Content-Type': 'application/json; charset=UTF-8 '
        }
        if (token) {
            config.headers['X-PA-ACCESSTOKEN'] = token
            config.headers['X-PA-REFRESHTOKEN'] = refresToken
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

//http response 拦截器
axios.interceptors.response.use(
    response => {
        localStorage.setItem('refresh', '1')//0 停止 1进行 ,定时获取token流程，10分钟无操作停止，每次发送请求时会更新这个状态为1,每次更新成功会改成0
        if (response.data.errCode == '10411') {
            router.push({
                path: "/login",
                querry: {redirect: router.currentRoute.fullPath}//从哪个页面跳转
            })
        }
        return response;
    },
    error => {
        if (!error.response) {
            return Promise.reject(error)
        }
        if (error.response.status == '401') {
            router.push({
                path: "/login",
                querry: {redirect: router.currentRoute.fullPath}//从哪个页面跳转
            })
        }
        return Promise.reject(error)
    }
)


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error)
            })
    })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.patch(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}
