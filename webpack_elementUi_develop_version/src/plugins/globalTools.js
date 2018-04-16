// import Vue from 'vue'
import config from '../config/config'
import axios from 'axios'
import querystring from 'querystring'

let tools = {
    install: null
};

// Promise 添加finally方法
Promise.prototype.finally = function (callback) {
    return this.then(
        () => Promise.resolve(callback()),
        () => Promise.reject(callback())
    )
};

// Date 添加format方法
Date.prototype.format = function (type) {
    let month = (this.getMonth() >= 9) ? this.getMonth() : `0${this.getMonth() + 1}`;
    let date = (this.getDate() >= 10) ? this.getDate() : `0${this.getDate()}`;
    let hour = (this.getHours() >= 10) ? this.getHours() : `0${this.getHours()}`;
    let minute = (this.getMinutes() >= 10) ? this.getHourMinute() : `0${this.getMinutes()}`;
    let second = (this.getSeconds() >= 10) ? this.getSeconds() : `0${this.getSeconds()}`;
    if (type === 'date') {
        return `${this.getFullYear()}-${month}-${date}`
    } else {
        return `${this.getFullYear()}-${month}-${date} ${hour}:${minute}:${second}`
    }
};

// 数组包含判断
function isSubArray(parent, child) {
    for (let item of child) {
        if (!parent.includes(item.trim())) {
            return false
        }
    }
    return true
}

// js对象和数组深拷贝
function deepCopy(obj) {
    if (Array.isArray(obj)) {
        let result = [];
        for (let item of obj) {
            result.push(deepCopy(item))
        }
        return result
    } else if (typeof obj === 'object' && obj !== null) {
        let result = {};
        for (let [key, value] of Object.entries(obj)) {
            result[key] = deepCopy(value)
        }
        return result
    } else {
        return obj
    }
}


// response处理
function handleResponse(response, router) {
    if (response.status === 401) {
        router.push({name: 'login'});
        response['result'] = '验证失败，请重新登录';
        return Promise.reject(response)
    } else if (response.data.hasOwnProperty('data') && response.data.hasOwnProperty('message')) {
        if (response.data.message) {
            response['result'] = response.data.message
        } else {
            response['result'] = response.data.data;
            return Promise.resolve(response)
        }
    } else {
        response['result'] = '无效的数据格式'
    }
    return Promise.reject(response)
}

tools.install = function (Vue, router) {
    // 请求拦截器
    axios.interceptors.request.use(request => {
        if (request.url.startsWith('/api/')) {
            request.headers['X-Token'] = localStorage.getItem('token');
            // request.url = config.apiServer + request.url.replace('/api', '')
            // request.url = config.apiServer + request.url
        }
        request.timeout = 120000;
        return request
    });
    // 返回拦截器
    axios.interceptors.response.use(response => {
        return handleResponse(response, router);
    }, error => {
        if (error.response) {
            return handleResponse(error.response, router)
        }
        return Promise.reject({result: '请求异常： ' + error.message})
    });
    Vue.prototype.$http = axios;
    Vue.prototype.$querystring = querystring;
    Vue.prototype.$layer_message = function (message, type, duration) {
        if (duration === undefined) {
            duration = 5000
        }
        this.$message({
            showClose: true,
            duration: duration,
            message: message,
            type: type || 'error'
        })
    };
    // js对象和数组深拷贝
    Vue.prototype.$deepCopy = deepCopy;
    // 权限判断
    // Vue.prototype.has_permission = function (str_code) {
    //     if (localStorage.getItem('is_supper') === 'true') {
    //         return true
    //     }
    //     let permissions = localStorage.getItem('permissions');
    //     if (!str_code || !permissions) return false;
    //     permissions =  permissions.split(',');
    //     for (let or_item of str_code.split('|')) {
    //         if (isSubArray(permissions, or_item.split('&'))) {
    //             return true
    //         }
    //     }
    //     return false
    // };
    //路由导航钩子
    // router.beforeEach((to, from, next) => {
    //     if (['/', '/login', '/deny'].includes(to.path)) {
    //         next()
    //     } else if (to.meta.hasOwnProperty('permission') && Vue.prototype.has_permission(to.meta.permission)) {
    //         next()
    //     } else {
    //         next({path: '/deny'})
    //     }
    // })
};

export default tools;