import React, { Component } from 'react'
import {
    Layout,
    Divider,
    Row,
    Col,
    Tag,
    Table,
    Button,
    Anchor,
    Modal,
    Form,
    Input,
    notification,
    Radio,
    Select,
    List,
    AutoComplete
} from 'antd'
import CustomBreadcrumb from '@/components/CustomBreadcrumb'
import '@/style/view-style/table.scss'
import '@/style/view-style/teacherForm.scss'
import axios from '@/api'
import { HOST } from '@/api/config.js'

const { Option } = Select

// 组件的其余代码...

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

const kissTypeOption = [
    { label: '\u00A0', value: null },
    { label: '无', value: 0 },
    { label: 'kiss', value: 1 },
    { label: '舌吻', value: 2 }
]

const commonOption = [
    { label: '\u00A0', value: null },
    { label: '无', value: 0 },
    { label: '有', value: 1 }
]

const commonShowOption = [
    { label: '\u00A0', value: null },
    { label: '×', value: 0 },
    { label: '√', value: 1 }
]

const statusOption = [
    { label: '\u00A0', value: null },
    { label: '正常', value: 1 },
    { label: '暂离', value: 2 },
    { label: '失联', value: 3 },
    { label: '上岸', value: 4 },
    { label: '失效', value: 5 }
]

const lastSeenOption = [
    { label: '\u00A0', value: null },
    { label: '最近', value: 1 },
    { label: '一周前', value: 2 },
    { label: '一个月前', value: 3 },
    { label: '很久之前', value: 4 }
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
            region: null,
            priceGe: null,
            priceLe: null,
            ageGe: null,
            ageLe: null,
            heightGe: null,
            heightLe: null,
            tag: null
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
                                    标签：
                                    <Input
                                        style={{ width: '150px' }}
                                        onChange={e => this.handleChange('tag', e.target.value)}
                                    />
                                </span>
                                <span style={{ display: 'inline-block', margin: '0 10px' }}>
                                    价格：
                                    <Input
                                        style={{ width: '50px' }}
                                        onChange={e => this.handleChange('priceGe', e.target.value)}
                                    />
                                    &nbsp;-&nbsp;
                                    <Input
                                        style={{ width: '50px' }}
                                        onChange={e => this.handleChange('priceLe', e.target.value)}
                                    />
                                </span>

                                <span style={{ display: 'inline-block', margin: '0 10px' }}>
                                    年龄：
                                    <Input
                                        style={{ width: '50px' }}
                                        onChange={e => this.handleChange('ageGe', e.target.value)}
                                    />
                                    &nbsp;-&nbsp;
                                    <Input
                                        style={{ width: '50px' }}
                                        onChange={e => this.handleChange('ageLe', e.target.value)}
                                    />
                                </span>

                                <span style={{ display: 'inline-block', margin: '0 10px' }}>
                                    身高：
                                    <Input
                                        style={{ width: '50px' }}
                                        onChange={e => this.handleChange('heightGe', e.target.value)}
                                    />
                                    &nbsp;-&nbsp;
                                    <Input
                                        style={{ width: '50px' }}
                                        onChange={e => this.handleChange('heightLe', e.target.value)}
                                    />
                                </span>

                                <span style={{ display: 'inline-block', margin: '0 10px' }}>
                                    体重：
                                    <Input
                                        style={{ width: '50px' }}
                                        onChange={e => this.handleChange('weightGe', e.target.value)}
                                    />
                                    &nbsp;-&nbsp;
                                    <Input
                                        style={{ width: '50px' }}
                                        onChange={e => this.handleChange('weightLe', e.target.value)}
                                    />
                                </span>

                                <span style={{ display: 'inline-block', margin: '0 10px' }}>
                                    地区：
                                    <Select
                                        style={{ width: '80px' }}
                                        onChange={value => this.handleChange('region', value)}>
                                        {regionOptions.map(option => (
                                            <Select.Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </span>

                                <span style={{ display: 'inline-block', margin: '0 10px' }}>
                                    kiss：
                                    <Select
                                        style={{ width: '150px' }}
                                        mode='multiple' // 设置为多选模式
                                        onChange={values => this.handleChange('kissType', values)} // 注意这里的values是一个数组
                                    >
                                        <Select.Option key='empty' value=''>
                                            {/* 空白选项 */}
                                        </Select.Option>
                                        {kissTypeOption.map(option => (
                                            <Select.Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </span>

                                <span style={{ display: 'inline-block', margin: '0 10px' }}>
                                    69：
                                    <Select
                                        style={{ width: '50px' }}
                                        onChange={value => this.handleChange('isSn', value)}>
                                        {commonOption.map(option => (
                                            <Select.Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </span>

                                <span style={{ display: 'inline-block', margin: '0 10px' }}>
                                    JK：
                                    <Select
                                        style={{ width: '50px' }}
                                        onChange={value => this.handleChange('isJk', value)}>
                                        {commonOption.map(option => (
                                            <Select.Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </span>

                                <span style={{ display: 'inline-block', margin: '0 10px' }}>
                                    Lolita：
                                    <Select
                                        style={{ width: '50px' }}
                                        onChange={value => this.handleChange('isLolita', value)}>
                                        {commonOption.map(option => (
                                            <Select.Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </span>

                                <span style={{ display: 'inline-block', margin: '0 10px' }}>
                                    状态
                                    <Select
                                        style={{ width: '160px' }}
                                        mode='multiple' // 设置为多选模式
                                        onChange={values => this.handleChange('status', values)} // 注意这里的values是一个数组
                                    >
                                        <Select.Option key='empty' value=''>
                                            {/* 空白选项 */}
                                        </Select.Option>
                                        {statusOption.map(option => (
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

    constructor(props) {
        super(props)
        this.state = {
            data: [], // 你的数据数组
            pagination: {
                current: 1, // 将默认当前页设置为1
                pageSize: 10 // 将默认页面大小设置为10
                // 其他分页属性（例如total，showSizeChanger等）
            }
        }
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

    handlePageSizeChange = value => {
        const { pagination } = this.state
        pagination.pageSize = value
        this.setState(
            {
                pagination
            },
            () => {
                this.queryPage(1, value, this.props.filters)
            }
        )
    }

    // 异步获取数据
    queryPage = (pageIndex, pageSize, filters) => {
        this.setState({ loading: true })
        let url = HOST + '/teacher/page'
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
            index: (pagination.current - 1) * pagination.pageSize + index + 1
        }))

        const renderPagination = (page, type, originalElement) => {
            if (type === 'prev') {
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        共<span>{this.state.pagination.total}</span>
                        条， 每页显示记录数：
                        <Select
                            defaultValue={pagination.pageSize}
                            onChange={this.handlePageSizeChange}
                            style={{ width: '80px', marginRight: '8px' }}>
                            <Option value='10'>10</Option>
                            <Option value='20'>20</Option>
                            <Option value='50'>50</Option>
                            <Option value='100'>100</Option>
                        </Select>
                        <div style={{ width: '30px' }}>{originalElement}</div>
                    </div>
                )
            }
            return originalElement
        }

        return (
            <div style={{ position: 'relative' }}>
                <Table
                    rowKey={(r, i) => i.toString()}
                    columns={this.columns}
                    dataSource={processedData}
                    onChange={this.handleTableChange}
                    pagination={{
                        ...pagination,
                        itemRender: renderPagination
                    }}
                />
            </div>
        )
    }

    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            align: 'center',
            resizable: true // 允许调节列宽
        },
        {
            title: '名字',
            dataIndex: 'nickname',
            key: 'nickname',
            align: 'center',
            resizable: true // 允许调节列宽
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            align: 'center',
            resizable: true // 允许调节列宽
        },
        {
            title: '频道地址',
            dataIndex: 'channelUsername',
            key: 'channelUsername',
            align: 'center',
            resizable: true // 允许调节列宽
        },
        {
            title: 'p价格',
            dataIndex: 'priceP',
            key: 'priceP',
            align: 'center',
            resizable: true // 允许调节列宽
        },
        {
            title: 'pp价格',
            dataIndex: 'pricePp',
            key: 'pricePp',
            align: 'center',
            resizable: true // 允许调节列宽
        },
        {
            title: '地区',
            dataIndex: 'region',
            key: 'region',
            align: 'center',
            resizable: true // 允许调节列宽
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
            align: 'center',
            resizable: true // 允许调节列宽
        },
        {
            title: '身高',
            dataIndex: 'height',
            key: 'height',
            align: 'center',
            resizable: true // 允许调节列宽
        },
        {
            title: '体重',
            dataIndex: 'weight',
            key: 'weight',
            align: 'center',
            resizable: true // 允许调节列宽
        },
        {
            title: 'kiss',
            dataIndex: 'kissType',
            key: 'kissType',
            render: val => {
                const selectedOption = kissTypeOption.find(option => option.value === val)
                return selectedOption ? selectedOption.label : ''
            },
            align: 'center',
            resizable: true // 允许调节列宽
        },
        {
            title: '69',
            dataIndex: 'isSn',
            key: 'isSn',
            render: val => {
                const selectedOption = commonShowOption.find(option => option.value === val)
                return selectedOption ? selectedOption.label : ''
            },
            align: 'center',
            resizable: true // 允许调节列宽
        },
        {
            title: 'JK',
            dataIndex: 'isJk',
            key: 'isJk',
            render: val => {
                const selectedOption = commonShowOption.find(option => option.value === val)
                return selectedOption ? selectedOption.label : ''
            },
            align: 'center',
            resizable: true // 允许调节列宽
        },
        {
            title: 'Lolita',
            dataIndex: 'isLolita',
            key: 'isLolita',
            render: val => {
                const selectedOption = commonShowOption.find(option => option.value === val)
                return selectedOption ? selectedOption.label : ''
            },
            align: 'center',
            resizable: true // 允许调节列宽
        },
        {
            title: '标签',
            dataIndex: 'tag',
            key: 'tag',
            align: 'center',
            resizable: true // 允许调节列宽
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            align: 'center',
            resizable: true // 允许调节列宽
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: val => {
                const selectedOption = statusOption.find(option => option.value === val)
                return selectedOption ? selectedOption.label : ''
            },
            align: 'center',
            resizable: true // 允许调节列宽
        },
        {
            title: '最近上线',
            dataIndex: 'lastSeen',
            key: 'lastSeen',
            render: val => {
                const selectedOption = lastSeenOption.find(option => option.value === val)
                return selectedOption ? selectedOption.label : ''
            },
            align: 'center',
            resizable: true // 允许调节列宽
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
            },
            align: 'center',
            resizable: true // 允许调节列宽
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
        data: {},
        // tagOptions: [
        //     { label: 'kiss', value: '#kiss' },
        //     { label: '舌吻', value: '#舌吻' },
        //     { label: '69', value: '#69' },
        //     { label: '大车', value: '#大车' },
        //     { label: 'JK', value: '#JK' },
        //     { label: 'Lolita', value: '#Lolita' }
        // ],
        candidateList: [],
        showCandidateList: false,
        userId: null
    }

    constructor(props) {
        super(props)
        this.formRef = React.createRef()
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

    handleChange = async (field, value) => {
        console.log(field + value)
        this.setState(prevState => ({
            data: {
                ...prevState.data,
                [field]: value
            }
        }))

        if (field === 'nickname') {
            if (value.trim() === '') {
                this.setState({
                    showCandidateList: false,
                    candidateList: []
                })
            } else {
                try {
                    const response = await axios.get(HOST + '/candidate/queryByName', {
                        params: {
                            name: value
                        }
                    })

                    const candidateList = response.data.data // 假设服务器返回一个候选人名称的数组

                    this.setState({
                        candidateList,
                        showCandidateList: candidateList.length > 0 // 如果 candidateList 不为空，则设置 showCandidateList 为 true，否则为 false
                    })
                } catch (error) {
                    // 处理请求错误
                }
            }
        }
    }

    handleNicknameSelection = candidate => {
        this.setState(prevState => ({
            data: {
                ...prevState.data,
                nickname: candidate.nickname,
                username: candidate.username,
                channelUsername: candidate.bio,
                userId: candidate.userId,
                region: candidate.region
            }
        }))
    }

    handleOk = () => {
        console.log('handleOk')
        // 提交表单
        // 发送异步请求保存编辑后的数据
        let url = HOST + '/teacher/save'
        console.log('save:' + JSON.stringify(this.state.data))
        let param = {
            id: this.state.data.id,
            nickname: this.state.data.nickname || '',
            username: this.state.data.username || '',
            channelUsername: this.state.data.channelUsername || '',
            priceComplete: this.state.data.priceComplete || '',
            region: this.state.data.region || '',
            tag: this.state.data.tag || '',
            remark: this.state.data.remark || ''
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
        if (this.state.data.userId) {
            param.userId = this.state.data.userId
        }

        if (this.state.data.height) {
            param.height = this.state.data.height
        }

        if (this.state.data.weight) {
            param.weight = this.state.data.weight
        }

        if (this.state.data.kissType) {
            param.kissType = this.state.data.kissType
        }

        if (this.state.data.isSn) {
            param.isSn = this.state.data.isSn
        }

        if (this.state.data.isJk) {
            param.isJk = this.state.data.isJk
        }

        if (this.state.data.isLolita) {
            param.isLolita = this.state.data.isLolita
        }

        if (this.state.data.status != undefined) {
            param.status = this.state.data.status
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

    handleTagClick = tagValue => {
        const { data } = this.state
        const { tag } = data
        if (tag) {
            data.tag = `${tag} ${tagValue}`
        } else {
            data.tag = tagValue
        }
        this.setState({ data })
    }

    queryById = id => {
        this.setState({ loading: true })
        let url = HOST + '/teacher/queryById'
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

        const { data } = this.state

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
                        <Form.Item label='ID' name='id' className='form-item'>
                            <Input value={this.state.data.id} disabled />
                        </Form.Item>
                        <Form.Item label='名字' name='nickname' className='form-item'>
                            <AutoComplete
                                value={this.state.data.nickname}
                                onChange={value => this.handleChange('nickname', value)}
                                // dataSource={this.state.candidateList
                                //     .map(candidate => ({
                                //         value: candidate.id + ':' + candidate.nickname,
                                //         key: candidate.id // 使用候选人的唯一标识作为 key
                                //     }))
                                // }
                            >
                                {this.state.candidateList.map(candidate => (
                                    <AutoComplete.Option
                                        key={candidate.id}
                                        value={candidate.id + ':' + candidate.nickname}
                                        label={candidate.nickname}
                                        onClick={() => this.handleNicknameSelection(candidate)}>
                                        {candidate.nickname}
                                    </AutoComplete.Option>
                                ))}
                            </AutoComplete>
                        </Form.Item>
                        <Form.Item label='用户名' name='username' className='form-item'>
                            <Input
                                value={this.state.data.username}
                                onChange={e => this.handleChange('username', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label='频道地址' name='channelUsername' className='form-item'>
                            <Input
                                value={this.state.data.channelUsername}
                                onChange={e => this.handleChange('channelUsername', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label='p价格' name='priceP' className='form-item'>
                            <Input
                                value={this.state.data.priceP}
                                onChange={e => this.handleChange('priceP', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label='pp价格' name='pricePp' className='form-item'>
                            <Input
                                value={this.state.data.pricePp}
                                onChange={e => this.handleChange('pricePp', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label='地区' name='region' className='form-item'>
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
                        <Form.Item label='年龄' name='age' className='form-item'>
                            <Input
                                value={this.state.data.age}
                                onChange={e => this.handleChange('age', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label='身高' name='height' className='form-item'>
                            <Input
                                value={this.state.data.height}
                                onChange={e => this.handleChange('height', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label='体重' name='weight' className='form-item'>
                            <Input
                                value={this.state.data.weight}
                                onChange={e => this.handleChange('weight', e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item label='是否kiss' name='kissType' className='form-item'>
                            <Radio.Group
                                value={this.state.data.kissType}
                                onChange={e => this.handleChange('kissType', e.target.value)}>
                                {kissTypeOption.map(option => (
                                    <Radio key={option.value} value={option.value}>
                                        {option.label}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label='是否69' name='isSn' className='form-item'>
                            <Radio.Group
                                value={this.state.data.isSn}
                                onChange={e => this.handleChange('isSn', e.target.value)}>
                                {commonOption.map(option => (
                                    <Radio key={option.value} value={option.value}>
                                        {option.label}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label='是否JK' name='isJk' className='form-item'>
                            <Radio.Group
                                value={this.state.data.isJk}
                                onChange={e => this.handleChange('isJk', e.target.value)}>
                                {commonOption.map(option => (
                                    <Radio key={option.value} value={option.value}>
                                        {option.label}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label='是否Lolita' name='isLolita' className='form-item'>
                            <Radio.Group
                                value={this.state.data.isLolita}
                                onChange={e => this.handleChange('isLolita', e.target.value)}>
                                {commonOption.map(option => (
                                    <Radio key={option.value} value={option.value}>
                                        {option.label}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label='标签' name='tag' className='form-item'>
                            <div>
                                <Input
                                    value={data.tag}
                                    onChange={e => this.handleChange('tag', e.target.value)}
                                    placeholder='输入标签'
                                />
                                {/* <div style={{ marginTop: '8px' }}>
                                    {tagOptions.map(option => (
                                        <Tag
                                            key={option.value}
                                            onClick={() => this.handleTagClick(option.value)}
                                            style={{ cursor: 'pointer' }}>
                                            {option.label}
                                        </Tag>
                                    ))}
                                </div> */}
                            </div>
                        </Form.Item>
                        <Form.Item label='备注' name='remark' className='form-item'>
                            <Input
                                value={this.state.data.remark}
                                onChange={e => this.handleChange('remark', e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item label='状态' name='status' className='form-item'>
                            <Radio.Group
                                value={this.state.data.status}
                                onChange={e => this.handleChange('status', e.target.value)}>
                                {statusOption.map(option => (
                                    <Radio key={option.value} value={option.value}>
                                        {option.label}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        )
    }
}

const TeacherView = () => {
    return <Root />
}

export default TeacherView
