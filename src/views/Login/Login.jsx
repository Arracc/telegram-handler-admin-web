import React, { Component } from 'react'
import { Layout, Input, Icon, Form, Button, Divider, message, notification } from 'antd'
import { withRouter } from 'react-router-dom'
import axios from '@/api'
import { HOST } from '@/api/config'
import '@/style/view-style/login.scss'

class Login extends Component {
    state = {
        loading: false
    }

    enterLoading = () => {
        this.setState({
            loading: true
        })
    }

    stopLoading = () => {
        this.setState({
            loading: false
        })
    }

    handleSubmit = e => {
        let loginResult
        let errorMsg
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // let { username, password } = values
                let formData = new FormData()
                formData.append('username', values.username)
                formData.append('password', values.password)
                axios
                    .post(`${HOST}/manage/login`, formData)
                    .then(res => {
                        console.log('登录请求结果: ' + JSON.stringify(res))
                        // if (res.status === 200) {
                        if (res.data != undefined) {
                            let authorization = res.headers.authorization
                            console.log('登录成功 authorization:' + authorization)
                            // let index = authorization.indexOf('Bearer')
                            // let token = authorization.substring(index + 'Bearer'.length).trim()
                            // console.log('登录成功 截取后的token:'+ token)
                            localStorage.setItem('authorization', authorization)
                            this.props.history.push('/')
                            message.success('登录成功!')
                            loginResult = true
                        } else {
                            // 这里处理一些错误信息
                            console.log('登录失败 失败原因:' + JSON.stringify(res.data.message))
                            loginResult = false
                            errorMsg = JSON.stringify(res.data.message)
                        }
                    })
                    .catch(err => {})

                // 这里可以做权限校验 模拟接口返回用户权限标识
                switch (values.username) {
                    case 'admin':
                        values.auth = 0
                        break
                    default:
                        values.auth = 1
                }

                localStorage.setItem('user', JSON.stringify(values))
                this.enterLoading()
                this.timer = setTimeout(() => {
                    if (loginResult) {
                        message.success('登录成功!')
                        this.props.history.push('/')
                    } else {
                        if (errorMsg !== undefined) {
                            let reg = new RegExp('"', 'g')
                            errorMsg = errorMsg.replace(reg, '')
                            errorMsg += ','
                        }
                        message.error(errorMsg + '请重试!')
                        this.stopLoading()
                        this.props.history.push('/login')
                    }
                }, 2000)
            }
        })
    }

    componentDidMount() {
        notification.open({
            message: '欢迎使用后台管理平台',
            duration: null,
            description: '账号 admin(管理员)'
        })
    }

    componentWillUnmount() {
        notification.destroy()
        this.timer && clearTimeout(this.timer)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Layout className='login animated fadeIn'>
                <div className='model'>
                    <div className='login-form'>
                        <h3>telegram后台管理系统</h3>
                        <Divider />
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Item>
                                {getFieldDecorator('username', {
                                    rules: [{ required: true, message: '请输入用户名!' }]
                                })(
                                    <Input
                                        prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder='用户名'
                                    />
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: '请输入密码' }]
                                })(
                                    <Input
                                        prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type='password'
                                        placeholder='密码'
                                    />
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='login-form-button'
                                    loading={this.state.loading}>
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default withRouter(Form.create()(Login))
