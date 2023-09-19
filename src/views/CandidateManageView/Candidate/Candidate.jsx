import React, { Component } from 'react'
import CustomBreadcrumb from '@/components/CustomBreadcrumb'
import { Layout, Divider, Row, Col, Tag, Table, Button, Anchor, Modal, Form, Input, notification, Select } from 'antd'

import '@/style/view-style/table.scss'
import axios from '@/api'
import { HOST } from '@/api/config.js'

const choiceOptions = [
    { label: '', value: null },
    { label: '是', value: 1 },
    { label: '否', value: 0 }
]

// 可选项数组
const regionOptions = [
    { label: '南山', value: '南山' },
    { label: '福田', value: '福田' },
    { label: '罗湖', value: '罗湖' },
    { label: '宝安', value: '宝安' },
    { label: '龙华', value: '龙华' },
    { label: '龙岗', value: '龙岗' },
    { label: '光明', value: '光明' },
    { label: '盐田', value: '盐田' },
    { label: '大鹏', value: '大鹏' }
]

const ageOptions = []
for (let age = 18; age <= 30; age++) {
    ageOptions.push({ label: age.toString(), value: age.toString() })
}

class Root extends Component {
    state = {
        id: 0,
        search: {
            nickname: null,
            username: null,
            bio: null,
            timeStart: null,
            timeEnd: null,
            isProcessed: null
        }
    }

    showInfoCard(id) {
        if (id != null && id != 0) {
            this.setState({
                id: id
            })
        }
        // 调用InfoCardModal的显示方法
        this.InfoCardModal.showModal(id)
    }

    handleChange = (fieldName, value) => {
        const { search } = this.state
        search[fieldName] = value
        this.setState({ search })
    }

    handleSearch = () => {
        const { search } = this.state
        const { pagination } = this.TeacherTable.state
        const { current, pageSize } = pagination
        console.log(search)
        this.TeacherTable.queryPage(1, this.TeacherTable.state.pagination.size, search)
    }

    refreshTable = () => {
        console.log('root触发刷新')
        const { search } = this.state
        this.TeacherTable.queryPage(
            this.TeacherTable.state.pagination.current,
            this.TeacherTable.state.pagination.size,
            search
        )
    }

    render() {
        return (
            <Layout className='animated fadeIn'>
                <div>
                    <CustomBreadcrumb arr={['用户管理', '用户列表']}></CustomBreadcrumb>
                </div>
                <Row>
                    <Col>
                        <div className='base-style' style={{ width: '100%' }}>
                            {/* <h3 id='myTable'>用户列表</h3> */}
                            {/* <SearchBar /> */}
                            <div className='base-style' style={{ display: 'inline-block' }}>
                                <span style={{ display: 'inline-block', margin: '0 10px' }}>
                                    名字：
                                    <Input
                                        style={{ width: '150px' }}
                                        onChange={e => this.handleChange('nickname', e.target.value)}
                                    />
                                </span>

                                <span style={{ display: 'inline-block', margin: '0 10px' }}>
                                    用户名：
                                    <Input
                                        style={{ width: '150px' }}
                                        onChange={e => this.handleChange('username', e.target.value)}
                                    />
                                </span>

                                <span style={{ display: 'inline-block', margin: '0 10px' }}>
                                    简介：
                                    <Input
                                        style={{ width: '150px' }}
                                        onChange={e => this.handleChange('bio', e.target.value)}
                                    />
                                </span>

                                <span style={{ display: 'inline-block', margin: '0 10px' }}>
                                    收录时间：
                                    <Input
                                        style={{ width: '70px' }}
                                        onChange={e => this.handleChange('timeStart', e.target.value)}
                                    />
                                    &nbsp;-&nbsp;
                                    <Input
                                        style={{ width: '70px' }}
                                        onChange={e => this.handleChange('timeEnd', e.target.value)}
                                    />
                                </span>

                                <span style={{ display: 'inline-block', margin: '0 10px' }}>
                                    是否已处理：
                                    <Select
                                        style={{ width: '100px' }}
                                        onChange={value => this.handleChange('isProcessed', value)}>
                                        {choiceOptions.map(option => (
                                            <Select.Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </span>

                                <span style={{ display: 'inline-block' }}>
                                    <Button onClick={this.handleSearch}>查找</Button>
                                </span>
                            </div>

                            <div>
                                <Button type='button' onClick={() => this.showInfoCard(0)}>
                                    新增
                                </Button>
                            </div>

                            <Divider />

                            <div>
                                <TeacherTable
                                    filters={this.state.search}
                                    ref={node => (this.TeacherTable = node)}
                                    showInfoCard={data => this.showInfoCard(data)}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>

                <InfoCardModal ref={node => (this.InfoCardModal = node)} refreshTable={() => this.refreshTable()} />
            </Layout>
        )
    }
}

class TeacherTable extends Component {
    // 声明state
    state = {
        data: [],
        pagination: {},
        loading: false
    }

    // 初始化异步数据
    componentDidMount() {
        this.queryPage()
    }

    // 数据变化处理
    handleTableChange = (pagination, filters, sorter) => {
        this.setState(
            {
                pagination
            },
            () => {
                filters = this.props.filters
                console.log('触发分页数据变化: ' + JSON.stringify(filters))
                this.queryPage(pagination.current, pagination.size, filters)
            }
        )
    }

    // 异步获取数据
    queryPage = (pageIndex, pageSize, filters) => {
        this.setState({ loading: true })
        let url = HOST + '/candidate/page'
        let param = {
            ...(pageIndex !== null ? { current: pageIndex } : {}),
            ...(pageSize !== null ? { size: pageSize } : {}),
            ...(filters !== null ? filters : {})
        }
        axios
            .post(url, param)
            .then(res => {
                if (res.data.code === 200) {
                    const pagination = { ...this.state.pagination }
                    pagination.total = res.data.data.total
                    pagination.current = res.data.data.current
                    pagination.size = res.data.data.size
                    this.setState({
                        loading: false,
                        data: res.data.data.records,
                        pagination
                    })
                } else {
                    // 这里处理一些错误信息
                    console.log('请求错误')
                }
            })
            .catch(err => {})
    }

    // 渲染数据
    render() {
        const { data, pagination } = this.state

        const processedData = data.map((item, index) => ({
            ...item,
            index: (pagination.current - 1) * pagination.size + index + 1
        }))

        return (
            <Table
                rowKey={(r, i) => i.toString()}
                columns={this.columns}
                dataSource={processedData}
                onChange={this.handleTableChange}
                pagination={this.state.pagination}
            />
        )
    }

    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index'
        },
        {
            title: '名字',
            dataIndex: 'nickname',
            key: 'nickname'
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username'
        },
        {
            title: '简介',
            dataIndex: 'bio',
            key: 'bio'
        },
        {
            title: '收录时间',
            dataIndex: 'discoveryTime',
            key: 'discoveryTime'
        },
        {
            title: '是否已处理',
            dataIndex: 'isProcessed',
            key: 'isProcessed'
        },
        {
            title: '操作',
            render: (text, record, index) => {
                return (
                    <span>
                        <Button type='button' onClick={() => this.edit(record)}>
                            编辑
                        </Button>
                    </span>
                )
            }
        }
    ]

    // 弹出用户连接列表窗口
    edit = record => {
        this.props.showInfoCard(record.id)
    }
}

class InfoCardModal extends Component {
    state = {
        loading: false,
        visible: false,
        id: 0,
        data: {}
    }

    showModal = id => {
        if (id == 0) {
            // 新增
            this.setState({
                visible: true,
                id: id,
                data: {}
            })
        } else if (id !== this.state.id) {
            // 查看详情 调用InfoCard的queryById方法
            console.log('showModal id不一致，将重新查询id:' + id)
            this.setState({
                loading: true,
                visible: true,
                id: id
            })
            this.queryById(id)
        } else {
            // 查看详情
            this.setState({
                visible: true
            })
        }
    }

    handleChange = (fieldName, value) => {
        const { data } = this.state
        data[fieldName] = value
        this.setState({ data })
    }

    handleOk = () => {
        console.log('handleOk')
        // 提交表单
        // 发送异步请求保存编辑后的数据
        let url = HOST + '/candidate/update'
        console.log('update:' + JSON.stringify(this.state.data))
        let param = {
            id: this.state.data.id,
            nickname: this.state.data.nickname || '',
            username: this.state.data.username || '',
            channelUsername: this.state.data.channelUsername || '',
            priceComplete: this.state.data.priceComplete || '',
            region: this.state.data.region || '',
            tag: this.state.data.tag || ''
        }
        if (this.state.data.priceP) {
            param.priceP = this.state.data.priceP
        }

        if (this.state.data.pricePp) {
            param.pricePp = this.state.data.pricePp
        }

        if (this.state.data.age) {
            param.age = this.state.data.age
        }
        axios
            .post(url, param)
            .then(res => {
                if (res.data.code === 200 && res.data.data) {
                    notification.success({ message: '保存成功' })
                    // 关闭窗口
                    this.setState({
                        visible: false
                    })
                    // 重新查询当前页
                    this.props.refreshTable()
                } else {
                    notification.success({ message: '保存失败' })
                }
            })
            .catch(err => {
                notification.success({ message: '保存失败' })
            })
    }

    handleCancel = () => {
        console.log('handleCancel')
        this.setState({
            visible: false
        })
    }

    queryById = id => {
        this.setState({ loading: true })
        let url = HOST + '/candidate/info'
        let param = {
            id: id
        }
        axios
            .post(url, param)
            .then(res => {
                if (res.data.code === 200) {
                    console.log('查询到的id:' + res.data.data.id)
                    this.setState({
                        loading: false,
                        data: res.data.data,
                        id: res.data.data.id
                    })
                } else {
                    // 这里处理一些错误信息
                    console.log('请求错误')
                }
            })
            .catch(err => {})
    }

    render() {
        const layout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
        }

        return (
            <>
                <Modal
                    title='用户详情'
                    visible={this.state.visible}
                    open={this.showModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                    okText='保存'
                    cancelText='取消'>
                    <Form {...layout} ref={this.formRef}>
                        <Form.Item label='ID' name='id'>
                            <Input value={this.state.data.id} disabled />
                        </Form.Item>
                        <Form.Item label='名字' name='nickname'>
                            <Input
                                value={this.state.data.nickname}
                                onChange={e => this.handleChange('nickname', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label='用户名' name='username'>
                            <Input
                                value={this.state.data.username}
                                onChange={e => this.handleChange('username', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label='频道地址' name='channelUsername'>
                            <Input
                                value={this.state.data.channelUsername}
                                onChange={e => this.handleChange('channelUsername', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label='p价格' name='priceP'>
                            <Input
                                value={this.state.data.priceP}
                                onChange={e => this.handleChange('priceP', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label='pp价格' name='pricePp'>
                            <Input
                                value={this.state.data.pricePp}
                                onChange={e => this.handleChange('pricePp', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label='地区' name='region'>
                            <Select
                                value={this.state.data.region}
                                onChange={value => this.handleChange('region', value)}>
                                {regionOptions.map(option => (
                                    <Select.Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label='年龄' name='age'>
                            <Input
                                value={this.state.data.age}
                                onChange={e => this.handleChange('age', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label='标签' name='tag'>
                            <Input
                                value={this.state.data.tag}
                                onChange={e => this.handleChange('tag', e.target.value)}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        )
    }
}

const CandidateView = () => {
    return <Root />
}

export default CandidateView
