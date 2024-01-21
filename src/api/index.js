import axios from 'axios'

import { message } from 'antd'

import { createHashHistory } from 'history'

const history = createHashHistory()

const instance = axios.create({
    timeout: 5000
})

// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 添加请求拦截器
instance.interceptors.request.use(
    config => {
        // // 从本地获取 Authorization
        const authorization = localStorage.getItem('authorization')
        // console.log('axios请求前取出authorization:' + authorization)

        // // 在请求头中添加 Authorization
        authorization && (config.headers.Authorization = authorization)
        // if (authorization) {
        //     instance.defaults.headers.common['Authorization'] = authorization;
        //     config.headers.Authorization = token
        // }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 添加响应拦截器
instance.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(response)
        }
    },
    error => {
        // 相应错误处理
        // 比如： token 过期， 无权限访问， 路径不存在， 服务器问题等
        switch (error.response.status) {
            case 401:
                // 未登录处理
                proceedNotLogined()
                return Promise.reject(error.response)
            case 403:
                break
            case 404:
                break
            case 500:
                break
            default:
                console.log('其他错误信息')
        }
        return Promise.reject(error)
    }
)

// 未登录处理
const proceedNotLogined = () => {
    message.warning('登录已过期，请重新登录！', 3)
    setTimeout(history.push('/login'), 3)
}

export default instance
