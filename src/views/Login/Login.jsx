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
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let formData = new FormData()
                formData.append('username', values.username)
                formData.append('password', values.password)

                axios
                    .post(`${HOST}/manage/login`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(res => {
                        console.log('登录请求结果: ' + JSON.stringify(res))

                        if (res.data !== undefined) {
                            let authorization = res.headers.authorization
                            console.log('登录成功 authorization:' + authorization)
                            localStorage.setItem('authorization', authorization)

                            // 将重定向和消息成功的部分移到 Axios 回调内
                            // 添加调试语句
                            console.log('准备跳转')
                            this.props.history.push('/')
                            console.log('已跳转')
                            message.success('登录成功!')
                        } else {
                            console.log('登录失败 失败原因:' + JSON.stringify(res.data.message))
                            let errorMsg = JSON.stringify(res.data.message)
                            // 处理错误并显示消息错误
                            message.error(errorMsg + '请重试!')
                        }
                    })
                    .catch(err => {
                        // 处理请求错误
                        console.error('登录请求失败:', err)
                    })
                    .finally(() => {
                        // 将加载和计时器逻辑移到 Axios 回调之外
                        this.stopLoading()
                    })

                // 将权限检查移到 Axios 回调之外
                switch (values.username) {
                    case 'admin':
                        values.auth = 0
                        break
                    default:
                        values.auth = 1
                }

                console.log('1  ')

                // 将加载逻辑移到这里
                this.enterLoading()

                // 移除计时器，因为它可能导致问题
                // 使用 Axios 回调处理成功和错误情况
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
