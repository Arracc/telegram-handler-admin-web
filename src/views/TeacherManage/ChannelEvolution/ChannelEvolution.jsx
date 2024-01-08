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
    AutoComplete,
    Tooltip,
    message
} from 'antd'
import CustomBreadcrumb from '@/components/CustomBreadcrumb'
import '@/style/view-style/table.scss'
import '@/style/view-style/teacherForm.scss'
import axios from '@/api'
import { HOST, PYHOST } from '@/api/config.js'

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
    { label: '×', value: 0 },
    { label: 'kiss', value: 1 },
    { label: '舌吻', value: 2 }
]

const haveNotOption = [
    { label: '\u00A0', value: null },
    { label: '无', value: 0 },
    { label: '有', value: 1 }
]

const ifNotOption = [
    { label: '\u00A0', value: null },
    { label: '否', value: 0 },
    { label: '是', value: 1 }
]

const commonShowOption = [
    { label: '\u00A0', value: null },
    { label: '×', value: 0 },
    { label: '√', value: 1 }
]

const commonShowOption2 = [
    { label: '\u00A0', value: null },
    { label: '\u00A0', value: 0 },
    { label: '√', value: 1 }
]

const teacherStatusOption = [
    { label: '\u00A0', value: null },
    { label: '正常', value: 1 },
    { label: '暂离', value: 2 },
    { label: '上岸', value: 3 },
    { label: '失联', value: 4 }
]

const accountStatusOption = [
    { label: '\u00A0', value: null },
    { label: '正常', value: 1 },
    { label: '转移', value: 2 },
    { label: '失效', value: 3 }
]

const lastSeenOption = [
    { label: '\u00A0', value: null },
    { label: '最近', value: 1 },
    { label: '一周内', value: 2 },
    { label: '一个月内', value: 3 },
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
            teacherStatus: null,
            accountStatus: null,
            lastSeen: null,
            sortType: null,
            tag: null
        }
    }

    // showInfoCard(id) {
    //     if (id != null && id != 0) {
    //         this.setState({
    //             id: id
    //         })
    //     }
    //     调用InfoCardModal的显示方法
    //     this.InfoCardModal.showModal(id)
    // }

    handleChange = (fieldName, value) => {
        const { search } = this.state
        search[fieldName] = value
        this.setState({ search })
    }

    handleSearch = () => {
        const { search } = this.state
        // const { pagination } = this.TeacherTable.state
        // const { current, pageSize } = pagination
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

    changeStateSortBy = value => {
        console.log('root sort:' + value)
        const { search } = this.state
        search['sortType'] = value
        this.setState({ search })
    }

    render() {
        return (
            <Layout className='animated fadeIn'>
                <div>
                    <CustomBreadcrumb arr={['用户管理', '频道访问量列表']}></CustomBreadcrumb>
                </div>
                <Row>
                    <Col>
                        <div className='base-style' style={{ width: '100%' }}>
                            {/* <SearchBar /> */}
                            {/* <div className='base-style' style={{ display: 'inline-block' }}>
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
                                        {haveNotOption.map(option => (
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
                                        {haveNotOption.map(option => (
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
                                        {haveNotOption.map(option => (
                                            <Select.Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </span>

                                <span style={{ display: 'inline-block', margin: '0 10px' }}>
                                    自聊：
                                    <Select
                                        style={{ width: '50px' }}
                                        onChange={value => this.handleChange('isIndividual', value)}>
                                        {ifNotOption.map(option => (
                                            <Select.Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </span>

                                <span style={{ display: 'inline-block', margin: '0 10px' }}>
                                    订阅：
                                    <Select
                                        style={{ width: '50px' }}
                                        onChange={value => this.handleChange('isSubscribed', value)}>
                                        {ifNotOption.map(option => (
                                            <Select.Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </span>

                                <span style={{ display: 'inline-block', margin: '0 10px' }}>
                                    老师状态：
                                    <Select
                                        style={{ width: '160px' }}
                                        mode='multiple' // 设置为多选模式
                                        onChange={values => this.handleChange('teacherStatus', values)} // 注意这里的values是一个数组
                                    >
                                        <Select.Option key='empty' value=''>
                                        </Select.Option>
                                        {teacherStatusOption.map(option => (
                                            <Select.Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </span>

                                <span style={{ display: 'inline-block', margin: '0 10px' }}>
                                    账号状态：
                                    <Select
                                        style={{ width: '160px' }}
                                        mode='multiple' // 设置为多选模式
                                        onChange={values => this.handleChange('accountStatus', values)} // 注意这里的values是一个数组
                                    >
                                        <Select.Option key='empty' value=''>
                                        </Select.Option>
                                        {accountStatusOption.map(option => (
                                            <Select.Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </span>

                                <span style={{ display: 'inline-block', margin: '0 10px' }}>
                                    最后在线：
                                    <Select
                                        style={{ width: '160px' }}
                                        mode='multiple' // 设置为多选模式
                                        onChange={values => this.handleChange('lastSeen', values)} // 注意这里的values是一个数组
                                    >
                                        <Select.Option key='empty' value=''>
                                        </Select.Option>
                                        {lastSeenOption.map(option => (
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
                            </div> */}

                            {/* <Divider /> */}

                            <div>
                                <ChannelEvolutionTable
                                    filters={this.state.search}
                                    ref={node => (this.ChannelEvolutionTable = node)}
                                    // showInfoCard={data => this.showInfoCard(data)}
                                    refreshTable={() => this.refreshTable()}
                                    changeStateSortBy={value => this.changeStateSortBy(value)}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* <InfoCardModal ref={node => (this.InfoCardModal = node)} refreshTable={() => this.refreshTable()} /> */}
            </Layout>
        )
    }
}

class ChannelEvolutionTable extends Component {
    // 声明state
    state = {
        data: [],
        // pagination: {},
        loading: false
    }

    constructor(props) {
        super(props)
        this.state = {
            data: [] // 你的数据数组
            // pagination: {
            //     current: 1, // 将默认当前页设置为1
            //     pageSize: 10 // 将默认页面大小设置为10
            //     // 其他分页属性（例如total，showSizeChanger等）
            // }
        }
    }

    // 初始化异步数据
    componentDidMount() {
        this.queryPage()
    }

    // 数据变化处理
    handleTableChange = (pagination, filters, sorter) => {
        // 如果sorter不为空，则处理排序逻辑
        if (sorter != null) {
            // 根据sortOrder的值来决定传递给后端的参数
            let sortParam
            if (sorter.columnKey == 'priceP') {
                if (sorter.order === 'ascend') {
                    sortParam = 1 // 升序
                } else if (sorter.order === 'descend') {
                    sortParam = 2 // 降序
                } else {
                    sortParam = null // 不排序
                }
            } else if (sorter.columnKey == 'height') {
                if (sorter.order === 'ascend') {
                    sortParam = 3 // 升序
                } else if (sorter.order === 'descend') {
                    sortParam = 4 // 降序
                } else {
                    sortParam = null // 不排序
                }
            } else if (sorter.columnKey == 'weight') {
                if (sorter.order === 'ascend') {
                    sortParam = 5 // 升序
                } else if (sorter.order === 'descend') {
                    sortParam = 6 // 降序
                } else {
                    sortParam = null // 不排序
                }
            } else if (sorter.columnKey == 'channel1dViews') {
                if (sorter.order === 'ascend') {
                    sortParam = 7 // 升序
                } else if (sorter.order === 'descend') {
                    sortParam = 8 // 降序
                } else {
                    sortParam = null // 不排序
                }
            } else if (sorter.columnKey == 'channelMembers') {
                if (sorter.order === 'ascend') {
                    sortParam = 9 // 升序
                } else if (sorter.order === 'descend') {
                    sortParam = 10 // 降序
                } else {
                    sortParam = null // 不排序
                }
            }
            console.log('sort:' + sortParam)
            this.props.changeStateSortBy(sortParam)
        }

        // 更新state中的pagination
        // this.setState({ pagination }, () => {
        //     // 请求接口
        //     this.queryPage(pagination.current, pagination.size, this.props.filters)
        // })
    }

    handlePageSizeChange = value => {
        // const { pagination } = this.state
        // pagination.pageSize = value
        this.setState(
            // {
            //     pagination
            // },
            () => {
                this.queryPage(this.props.filters)
            }
        )
    }

    // 异步获取数据
    // queryPage = (pageIndex, pageSize, filters) => {
    //     this.setState({ loading: true })
    //     let url = HOST + '/teacher/web/page'
    //     let param = {
    //         ...(pageIndex !== null ? { current: pageIndex } : {}),
    //         ...(pageSize !== null ? { size: pageSize } : {}),
    //         ...(filters !== null ? filters : {})
    //     }
    //     axios
    //         .post(url, param)
    //         .then(res => {
    //             if (res.data.code === 200) {
    //                 const pagination = { ...this.state.pagination }
    //                 pagination.total = res.data.data.total
    //                 pagination.current = res.data.data.current
    //                 pagination.size = res.data.data.size
    //                 this.setState({
    //                     loading: false,
    //                     data: res.data.data.records,
    //                     pagination
    //                 })
    //             } else {
    //                 // 这里处理一些错误信息
    //                 console.log('请求错误')
    //             }
    //         })
    //         .catch(err => {})
    // }
    queryPage = filters => {
        this.setState({ loading: true })
        let url = HOST + '/channelEvolution/list'
        let param = {}
        axios
            .post(url, param)
            .then(res => {
                if (res.data.code === 200) {
                    // const pagination = { ...this.state.pagination }
                    // pagination.total = res.data.data.total
                    // pagination.current = res.data.data.current
                    // pagination.size = res.data.data.size
                    this.setState({
                        loading: false,
                        data: res.data.data
                        // pagination
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
        // const { data, pagination } = this.state
        const { data } = this.state

        const processedData = data.map((item, index) => ({
            ...item,
            index: index + 1 // 自动计算序号，从1开始递增
        }))

        // const renderPagination = (page, type, originalElement) => {
        //     if (type === 'prev') {
        //         return (
        //             <div style={{ display: 'flex', alignItems: 'center' }}>
        //                 共<span>{this.state.pagination.total}</span>
        //                 条， 每页显示记录数：
        //                 <Select
        //                     defaultValue={pagination.pageSize}
        //                     onChange={this.handlePageSizeChange}
        //                     style={{ width: '80px', marginRight: '8px' }}>
        //                     <Option value='10'>10</Option>
        //                     <Option value='20'>20</Option>
        //                     <Option value='50'>50</Option>
        //                     <Option value='100'>100</Option>
        //                 </Select>
        //                 <div style={{ width: '30px' }}>{originalElement}</div>
        //             </div>
        //         )
        //     }
        //     return originalElement
        // }

        return (
            <div style={{ position: 'relative' }}>
                <Table
                    rowKey={(r, i) => i.toString()}
                    columns={this.columns}
                    dataSource={processedData}
                    onChange={this.handleTableChange}
                    pagination={false}
                    // pagination={{
                    //     ...pagination,
                    //     itemRender: renderPagination
                    // }}
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
            title: 'p',
            dataIndex: 'priceP',
            key: 'priceP',
            align: 'center',
            resizable: true, // 允许调节列宽
            sorter: true
        },
        {
            title: '首日访问量',
            dataIndex: 'channel1dViews',
            key: 'channel1dViews',
            align: 'center',
            resizable: true,
            sorter: true
        },
        {
            title: '订阅数',
            dataIndex: 'channelMembers',
            key: 'channelMembers',
            align: 'center',
            resizable: true,
            sorter: true
        },
        {
            title: '更新时间',
            dataIndex: 'monitorCompletedTime',
            key: 'monitorCompletedTime',
            align: 'center',
            resizable: true,

            sorter: true,
            render: text => {
                const formattedTime = new Date(text).toLocaleString() // 使用toLocaleString()进行格式化
                return <span>{formattedTime}</span>
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            align: 'center',
            resizable: true, // 允许调节列宽
            render: text => (
                <Tooltip title={text}>
                    <div
                        onClick={async () => {
                            const formattedText = `https://t.me/${text.replace('@', '')}`
                            try {
                                await navigator.clipboard.writeText(formattedText)
                                message.success('链接已复制到剪贴板')
                            } catch (err) {
                                message.error('链接复制失败')
                            }
                        }}>
                        {text}
                    </div>
                </Tooltip>
            )
        },
        {
            title: '频道地址',
            dataIndex: 'channelUsername',
            key: 'channelUsername',
            align: 'center',
            resizable: true, // 允许调节列宽
            render: text => (
                <Tooltip title={text}>
                    <div
                        onClick={async () => {
                            const formattedText = `https://t.me/${text.replace('@', '')}`
                            try {
                                await navigator.clipboard.writeText(formattedText)
                                message.success('链接已复制到剪贴板')
                            } catch (err) {
                                message.error('链接复制失败')
                            }
                        }}>
                        {text}
                    </div>
                </Tooltip>
            )
        },
        {
            title: 'pp',
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
            resizable: true,
            sorter: true
        },
        {
            title: '体重',
            dataIndex: 'weight',
            key: 'weight',
            align: 'center',
            resizable: true,
            sorter: true
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
            title: '自聊',
            dataIndex: 'isIndividual',
            key: 'isIndividual',
            render: val => {
                const selectedOption = commonShowOption2.find(option => option.value === val)
                return selectedOption ? selectedOption.label : ''
            },
            align: 'center',
            resizable: true // 允许调节列宽
        },
        // {
        //     title: '订阅',
        //     dataIndex: 'isSubscribed',
        //     key: 'isSubscribed',
        //     render: val => {
        //         const selectedOption = commonShowOption2.find(option => option.value === val)
        //         return selectedOption ? selectedOption.label : ''
        //     },
        //     align: 'center',
        //     resizable: true // 允许调节列宽
        // },
        {
            title: '标签',
            dataIndex: 'tag',
            key: 'tag',
            align: 'center',
            resizable: true // 允许调节列宽
        }
        // {
        //     title: '备注',
        //     dataIndex: 'remark',
        //     key: 'remark',
        //     align: 'center',
        //     resizable: true // 允许调节列宽
        // },
        // {
        //     title: '老师状态',
        //     dataIndex: 'teacherStatus',
        //     key: 'teacherStatus',
        //     render: val => {
        //         const selectedOption = teacherStatusOption.find(option => option.value === val)
        //         return selectedOption ? selectedOption.label : ''
        //     },
        //     align: 'center',
        //     resizable: true // 允许调节列宽
        // },
        // {
        //     title: '账号状态',
        //     dataIndex: 'accountStatus',
        //     key: 'accountStatus',
        //     render: val => {
        //         const selectedOption = accountStatusOption.find(option => option.value === val)
        //         return selectedOption ? selectedOption.label : ''
        //     },
        //     align: 'center',
        //     resizable: true // 允许调节列宽
        // },
        // {
        //     title: '最近上线',
        //     dataIndex: 'lastSeen',
        //     key: 'lastSeen',
        //     render: val => {
        //         const selectedOption = lastSeenOption.find(option => option.value === val)
        //         return selectedOption ? selectedOption.label : ''
        //     },
        //     align: 'center',
        //     resizable: true // 允许调节列宽
        // },
        // {
        //     title: '操作',
        //     render: (text, record, index) => {
        //         return (
        //             <div>
        //                 <span>
        //                     <Button type='button' onClick={() => this.edit(record)}>
        //                         编辑
        //                     </Button>
        //                 </span>
        //                 <span style={{ marginLeft: '10px' }}></span> {/* 这里设置了10px的左边距作为按钮间隔 */}
        //                 <span>
        //                     <Button
        //                         className='subscribeButton'
        //                         type='button'
        //                         onClick={() =>
        //                             this.subscribe(record.id, record.isSubscribed === 0 ? 1 : 0, record.channelUsername)
        //                         }>
        //                         {record.isSubscribed === 0 ? '订阅' : '取消订阅'}
        //                     </Button>
        //                 </span>
        //             </div>
        //         )
        //     },
        //     align: 'center',
        //     resizable: true // 允许调节列宽
        // }
    ]

    // 弹出用户连接列表窗口
    // edit = record => {
    //     this.props.showInfoCard(record.id)
    // }

    // 订阅
    // subscribe = (id, type, username) => {
    //     username = username.replace('https://t.me/', '')
    //     username = username.replace('@', '')
    //     let param = {
    //         type: type,
    //         username: username
    //     }
    //     // 提交
    //     axios
    //         .post(PYHOST + '/subscribeChannel', param)
    //         .then(res => {
    //             if (res.data.code === 200 && res.data.data) {
    //                 notification.success({ message: '修改订阅成功' })
    //                 // 修改成功后，修改资料
    //                 this.updateInfo(id, type)
    //             } else {
    //                 notification.success({ message: '修改订阅失败' })
    //             }
    //         })
    //         .catch(err => {
    //             notification.success({ message: '修改订阅失败' })
    //         })
    // }

    // updateInfo = (id, isSubscriebd) => {
    //     let param = {
    //         id: id,
    //         isSubscribed: isSubscriebd
    //     }
    //     let teacherSaveUrl = HOST + '/teacher/web/save'
    //     axios
    //         .post(teacherSaveUrl, param)
    //         .then(res => {
    //             if (res.data.code === 200 && res.data.data) {
    //                 notification.success({ message: '保存成功' })
    //                 // 重新查询当前页
    //                 this.props.refreshTable()
    //             } else {
    //                 notification.success({ message: '保存失败' })
    //             }
    //         })
    //         .catch(err => {
    //             notification.success({ message: '保存失败' })
    //         })
    // }
}

// class InfoCardModal extends Component {
//     state = {
//         loading: false,
//         visible: false,
//         id: 0,
//         data: {},
//         // tagOptions: [
//         //     { label: 'kiss', value: '#kiss' },
//         //     { label: '舌吻', value: '#舌吻' },
//         //     { label: '69', value: '#69' },
//         //     { label: '大车', value: '#大车' },
//         //     { label: 'JK', value: '#JK' },
//         //     { label: 'Lolita', value: '#Lolita' }
//         // ],
//         candidateList: [],
//         showCandidateList: false,
//         userId: null,
//         originalIsSubscribed: null
//     }

//     constructor(props) {
//         super(props)
//         this.formRef = React.createRef()
//     }
//     showModal = id => {
//         if (id == 0) {
//             // 新增
//             this.setState({
//                 visible: true,
//                 id: id,
//                 originalIsSubscribed: null,
//                 data: {}
//             })
//         } else if (id !== this.state.id) {
//             // 查看详情 调用InfoCard的queryById方法
//             console.log('showModal id不一致，将重新查询id:' + id)
//             this.setState({
//                 loading: true,
//                 visible: true,
//                 id: id,
//                 originalIsSubscribed: null
//             })
//             this.queryById(id)
//         } else {
//             // 查看详情
//             this.setState({
//                 visible: true
//             })
//         }
//     }

//     handleChange = async (field, value) => {
//         console.log(field + ': ' + value)

//         this.setState(prevState => ({
//             data: {
//                 ...prevState.data,
//                 [field]: value
//             }
//         }))

//         console.log('state' + JSON.stringify(this.state.data))

//         // 昵称
//         if (field === 'nickname') {
//             if (value.trim() === '') {
//                 this.setState({
//                     showCandidateList: false,
//                     candidateList: []
//                 })
//             } else {
//                 try {
//                     const response = await axios.get(HOST + '/candidate/queryByName', {
//                         params: {
//                             name: value
//                         }
//                     })

//                     const candidateList = response.data.data // 假设服务器返回一个候选人名称的数组

//                     this.setState({
//                         candidateList,
//                         showCandidateList: candidateList.length > 0 // 如果 candidateList 不为空，则设置 showCandidateList 为 true，否则为 false
//                     })
//                 } catch (error) {
//                     // 处理请求错误
//                 }
//             }
//         }
//     }

//     handleNicknameSelection = candidate => {
//         this.setState(prevState => ({
//             data: {
//                 ...prevState.data,
//                 nickname: candidate.nickname,
//                 username: candidate.username,
//                 channelUsername: candidate.bio,
//                 userId: candidate.userId,
//                 region: candidate.region
//             }
//         }))
//     }

//     handleOk = () => {
//         console.log('handleOk')
//         // 提交表单
//         // 发送异步请求保存编辑后的数据
//         let teacherSaveUrl = HOST + '/teacher/web/save'
//         console.log('save:' + JSON.stringify(this.state.data))
//         let param = {
//             id: this.state.data.id,
//             nickname: this.state.data.nickname || '',
//             username: this.state.data.username || '',
//             channelUsername: this.state.data.channelUsername || '',
//             priceComplete: this.state.data.priceComplete || '',
//             region: this.state.data.region || '',
//             isIndividual: this.state.data.isIndividual || 0,
//             isMultiCity: this.state.data.isMultiCity || 0,
//             isSubscribed: this.state.data.isSubscribed || 0,
//             tag: this.state.data.tag || '',
//             remark: this.state.data.remark || ''
//         }
//         if (this.state.data.priceP !== undefined && this.state.data.priceP !== null) {
//             param.priceP = this.state.data.priceP
//         }

//         if (this.state.data.pricePp !== undefined && this.state.data.pricePp !== null) {
//             param.pricePp = this.state.data.pricePp
//         }

//         if (this.state.data.age !== undefined && this.state.data.age !== null) {
//             param.age = this.state.data.age
//         }

//         if (this.state.data.userId !== undefined && this.state.data.userId !== null) {
//             param.userId = this.state.data.userId
//         }

//         if (this.state.data.height !== undefined && this.state.data.height !== null) {
//             param.height = this.state.data.height
//         }

//         if (this.state.data.weight !== undefined && this.state.data.weight !== null) {
//             param.weight = this.state.data.weight
//         }

//         if (this.state.data.kissType !== undefined && this.state.data.kissType !== null) {
//             param.kissType = this.state.data.kissType
//         }

//         if (this.state.data.isSn !== undefined && this.state.data.isSn !== null) {
//             param.isSn = this.state.data.isSn
//         }

//         if (this.state.data.isJk !== undefined && this.state.data.isJk !== null) {
//             param.isJk = this.state.data.isJk
//         }

//         if (this.state.data.isLolita !== undefined && this.state.data.isLolita !== null) {
//             param.isLolita = this.state.data.isLolita
//         }

//         if (this.state.data.isIndividual != undefined) {
//             param.isIndividual = this.state.data.isIndividual
//         }

//         if (this.state.data.isMultiCity != undefined) {
//             param.isMultiCity = this.state.data.isMultiCity
//         }

//         if (this.state.data.isSubscribed != undefined) {
//             param.isSubscribed = this.state.data.isSubscribed
//         }

//         if (this.state.data.teacherStatus != undefined) {
//             param.teacherStatus = this.state.data.teacherStatus
//         }

//         if (this.state.data.accountStatus != undefined) {
//             param.accountStatus = this.state.data.accountStatus
//         }

//         // 修改资料
//         axios
//             .post(teacherSaveUrl, param)
//             .then(res => {
//                 if (res.data.code === 200 && res.data.data) {
//                     notification.success({ message: '保存成功' })
//                     // 关闭窗口
//                     this.setState({
//                         visible: false
//                     })
//                     // 重新查询当前页
//                     this.props.refreshTable()
//                 } else {
//                     notification.success({ message: '保存失败' })
//                 }
//             })
//             .catch(err => {
//                 notification.success({ message: '保存失败' })
//             })

//         // 触发订阅/取消订阅
//         console.log(
//             '提交修改 isSubscribed 原始值' + this.state.originalIsSubscribed + ', 提交值：' + param.isSubscribed
//         )
//         if (
//             (this.state.originalIsSubscribed == null && param.isSubscribed == 1) ||
//             (this.state.originalIsSubscribed != null && this.state.originalIsSubscribed != param.isSubscribed)
//         ) {
//             let type = param.isSubscribed == 1 ? 1 : 2
//             let username = param.channelUsername
//             username = username.replace('https://t.me/', '')
//             username = username.replace('@', '')
//             let subscribeParam = {
//                 type: type,
//                 username: username
//             }

//             // 提交
//             axios
//                 .post(PYHOST + '/subscribeChannel', subscribeParam)
//                 .then(res => {
//                     if (res.data.code === 200 && res.data.data) {
//                         notification.success({ message: '修改订阅成功' })
//                         // 清空originalIsSubscribed
//                         // console.log("清空originalIsSubscribed")
//                         // this.state.originalIsSubscribed = null
//                         // 关闭窗口
//                         // this.setState({
//                         //     visible: false
//                         // })
//                         // 重新查询当前页
//                         // this.props.refreshTable()
//                     } else {
//                         notification.success({ message: '修改订阅失败' })
//                     }
//                 })
//                 .catch(err => {
//                     notification.success({ message: '修改订阅失败' })
//                 })
//         }
//     }

//     handleCancel = () => {
//         console.log('handleCancel')
//         this.setState({
//             visible: false
//         })
//     }

//     handleTagClick = tagValue => {
//         const { data } = this.state
//         const { tag } = data
//         if (tag) {
//             data.tag = `${tag} ${tagValue}`
//         } else {
//             data.tag = tagValue
//         }
//         this.setState({ data })
//     }

//     queryById = id => {
//         this.setState({ loading: true })
//         let url = HOST + '/teacher/web/info'
//         let param = {
//             id: id
//         }
//         axios
//             .post(url, param)
//             .then(res => {
//                 if (res.data.code === 200) {
//                     console.log('查询到的id:' + res.data.data.id)
//                     this.setState({
//                         loading: false,
//                         data: res.data.data,
//                         id: res.data.data.id,
//                         originalIsSubscribed: res.data.data.isSubscribed
//                     })
//                 } else {
//                     // 这里处理一些错误信息
//                     console.log('请求错误')
//                 }
//             })
//             .catch(err => {})
//     }

//     render() {
//         const layout = {
//             labelCol: { span: 6 },
//             wrapperCol: { span: 12 }
//         }

//         const { data } = this.state

//         return (
//             <>
//                 <Modal
//                     title='用户详情'
//                     visible={this.state.visible}
//                     open={this.showModal}
//                     onOk={this.handleOk}
//                     onCancel={this.handleCancel}
//                     destroyOnClose={true}
//                     okText='保存'
//                     cancelText='取消'
//                     style={{ top: 10, left: 20, right: 20, bottom: 10 }}>
//                     <Form {...layout} ref={this.formRef}>
//                         <Form.Item label='ID' name='id' className='form-item'>
//                             <Input value={this.state.data.id} disabled />
//                         </Form.Item>
//                         <Form.Item label='名字' name='nickname' className='form-item'>
//                             <AutoComplete
//                                 value={this.state.data.nickname}
//                                 onChange={value => this.handleChange('nickname', value)}>
//                                 {this.state.candidateList.map(candidate => (
//                                     <AutoComplete.Option
//                                         key={candidate.id}
//                                         value={candidate.id + ':' + candidate.nickname}
//                                         label={candidate.nickname}
//                                         onClick={() => this.handleNicknameSelection(candidate)}>
//                                         {candidate.nickname}
//                                     </AutoComplete.Option>
//                                 ))}
//                             </AutoComplete>
//                         </Form.Item>
//                         <Form.Item label='用户名' name='username' className='form-item'>
//                             <Input
//                                 value={this.state.data.username}
//                                 onChange={e => this.handleChange('username', e.target.value)}
//                             />
//                         </Form.Item>
//                         <Form.Item label='频道地址' name='channelUsername' className='form-item'>
//                             <Input
//                                 value={this.state.data.channelUsername}
//                                 onChange={e => this.handleChange('channelUsername', e.target.value)}
//                             />
//                         </Form.Item>
//                         <Form.Item label='p价格' name='priceP' className='form-item'>
//                             <Input
//                                 value={this.state.data.priceP}
//                                 onChange={e => this.handleChange('priceP', e.target.value)}
//                             />
//                         </Form.Item>
//                         <Form.Item label='pp价格' name='pricePp' className='form-item'>
//                             <Input
//                                 value={this.state.data.pricePp}
//                                 onChange={e => this.handleChange('pricePp', e.target.value)}
//                             />
//                         </Form.Item>
//                         <Form.Item label='地区' name='region' className='form-item'>
//                             <Select
//                                 value={this.state.data.region}
//                                 onChange={value => this.handleChange('region', value)}>
//                                 {regionOptions.map(option => (
//                                     <Select.Option key={option.value} value={option.value}>
//                                         {option.label}
//                                     </Select.Option>
//                                 ))}
//                             </Select>
//                         </Form.Item>
//                         <Form.Item label='年龄' name='age' className='form-item'>
//                             <Input
//                                 value={this.state.data.age}
//                                 onChange={e => this.handleChange('age', e.target.value)}
//                             />
//                         </Form.Item>
//                         <Form.Item label='身高' name='height' className='form-item'>
//                             <Input
//                                 value={this.state.data.height}
//                                 onChange={e => this.handleChange('height', e.target.value)}
//                             />
//                         </Form.Item>
//                         <Form.Item label='体重' name='weight' className='form-item'>
//                             <Input
//                                 value={this.state.data.weight}
//                                 onChange={e => this.handleChange('weight', e.target.value)}
//                             />
//                         </Form.Item>
//                         <Form.Item label='有无kiss' name='kissType' className='form-item'>
//                             <Radio.Group
//                                 value={this.state.data.kissType}
//                                 onChange={e => this.handleChange('kissType', e.target.value)}>
//                                 {kissTypeOption.map(option => (
//                                     <Radio key={option.value} value={option.value}>
//                                         {option.label}
//                                     </Radio>
//                                 ))}
//                             </Radio.Group>
//                         </Form.Item>
//                         <Form.Item label='有无69' name='isSn' className='form-item'>
//                             <Radio.Group
//                                 value={this.state.data.isSn}
//                                 onChange={e => this.handleChange('isSn', e.target.value)}>
//                                 {haveNotOption.map(option => (
//                                     <Radio key={option.value} value={option.value}>
//                                         {option.label}
//                                     </Radio>
//                                 ))}
//                             </Radio.Group>
//                         </Form.Item>
//                         <Form.Item label='有无JK' name='isJk' className='form-item'>
//                             <Radio.Group
//                                 value={this.state.data.isJk}
//                                 onChange={e => this.handleChange('isJk', e.target.value)}>
//                                 {haveNotOption.map(option => (
//                                     <Radio key={option.value} value={option.value}>
//                                         {option.label}
//                                     </Radio>
//                                 ))}
//                             </Radio.Group>
//                         </Form.Item>
//                         <Form.Item label='有无Lolita' name='isLolita' className='form-item'>
//                             <Radio.Group
//                                 value={this.state.data.isLolita}
//                                 onChange={e => this.handleChange('isLolita', e.target.value)}>
//                                 {haveNotOption.map(option => (
//                                     <Radio key={option.value} value={option.value}>
//                                         {option.label}
//                                     </Radio>
//                                 ))}
//                             </Radio.Group>
//                         </Form.Item>
//                         <Form.Item label='是否自聊' name='isIndividual' className='form-item'>
//                             <Radio.Group
//                                 value={this.state.data.isIndividual}
//                                 onChange={e => this.handleChange('isIndividual', e.target.value)}>
//                                 {ifNotOption.map(option => (
//                                     <Radio key={option.value} value={option.value}>
//                                         {option.label}
//                                     </Radio>
//                                 ))}
//                             </Radio.Group>
//                         </Form.Item>
//                         <Form.Item label='是否多地' name='isMultiCity' className='form-item'>
//                             <Radio.Group
//                                 value={this.state.data.isMultiCity}
//                                 onChange={e => this.handleChange('isMultiCity', e.target.value)}>
//                                 {ifNotOption.map(option => (
//                                     <Radio key={option.value} value={option.value}>
//                                         {option.label}
//                                     </Radio>
//                                 ))}
//                             </Radio.Group>
//                         </Form.Item>
//                         <Form.Item label='是否订阅' name='isSubscribed' className='form-item'>
//                             <Radio.Group
//                                 value={this.state.data.isSubscribed}
//                                 onChange={e => this.handleChange('isSubscribed', e.target.value)}>
//                                 {ifNotOption.map(option => (
//                                     <Radio key={option.value} value={option.value}>
//                                         {option.label}
//                                     </Radio>
//                                 ))}
//                             </Radio.Group>
//                         </Form.Item>
//                         <Form.Item label='标签' name='tag' className='form-item'>
//                             <div>
//                                 <Input
//                                     value={data.tag}
//                                     onChange={e => this.handleChange('tag', e.target.value)}
//                                     placeholder='输入标签'
//                                 />
//                                 {/* <div style={{ marginTop: '8px' }}>
//                                     {tagOptions.map(option => (
//                                         <Tag
//                                             key={option.value}
//                                             onClick={() => this.handleTagClick(option.value)}
//                                             style={{ cursor: 'pointer' }}>
//                                             {option.label}
//                                         </Tag>
//                                     ))}
//                                 </div> */}
//                             </div>
//                         </Form.Item>
//                         <Form.Item label='备注' name='remark' className='form-item'>
//                             <Input
//                                 value={this.state.data.remark}
//                                 onChange={e => this.handleChange('remark', e.target.value)}
//                             />
//                         </Form.Item>

//                         <Form.Item label='老师状态' name='teacherStatus' className='form-item'>
//                             <Radio.Group
//                                 value={this.state.data.teacherStatus}
//                                 onChange={e => this.handleChange('teacherStatus', e.target.value)}>
//                                 {teacherStatusOption.map(option => (
//                                     <Radio key={option.value} value={option.value}>
//                                         {option.label}
//                                     </Radio>
//                                 ))}
//                             </Radio.Group>
//                         </Form.Item>

//                         <Form.Item label='状态' name='accountStatus' className='form-item'>
//                             <Radio.Group
//                                 value={this.state.data.accountStatus}
//                                 onChange={e => this.handleChange('accountStatus', e.target.value)}>
//                                 {accountStatusOption.map(option => (
//                                     <Radio key={option.value} value={option.value}>
//                                         {option.label}
//                                     </Radio>
//                                 ))}
//                             </Radio.Group>
//                         </Form.Item>
//                     </Form>
//                 </Modal>
//             </>
//         )
//     }
// }

const TeacherView = () => {
    return <Root />
}

export default TeacherView
