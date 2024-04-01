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
    { label: '🐍', value: 2 }
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
    { label: '是', value: 1 }
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
        search: {
            group: null,
            year: null,
            week: null,
            sortType: null
            // nickname: null,
            // username: null,
            // region: null,
            // priceGe: null,
            // priceLe: null,
            // ageGe: null,
            // ageLe: null,
            // heightGe: null,
            // heightLe: null,
            // teacherStatus: null,
            // accountStatus: null,
            // lastSeen: null,
            // sortType: null,
            // tag: null
        }
    }

    handleChange = (fieldName, value) => {
        const { search } = this.state
        search[fieldName] = value
        this.setState({ search })
    }

    // handleSearch = () => {
    //     const { search } = this.state
    //     // const { pagination } = this.TeacherTable.state
    //     // const { current, pageSize } = pagination
    //     console.log(search)
    //     this.TeacherTable.queryPage(1, this.TeacherTable.state.pagination.size, search)
    // }

    handleTabPageChange = group => {
        console.log('切换标签页')
        const { search } = this.state
        search['group'] = group
        this.setState({ search })
        this.ChannelEvolutionTable.queryPage(search)
    }

    refreshTable = () => {
        console.log('root触发刷新')
        const { search } = this.state
        this.ChannelEvolutionTable.queryPage(search)
    }

    changeStateSortBy = value => {
        console.log('root sort:' + value)
        const { search } = this.state
        search['sortType'] = value
        this.setState({ search })
    }

    handleYearChange = value => {
        console.log('year:' + value)
        const { search } = this.state
        search['year'] = value
        this.setState({ search })
        console.log('参数：' + JSON.stringify(search))
        if ((search.year != null && search.week != null) || (search.year == null && search.week == null)) {
            this.ChannelEvolutionTable.queryPage(search)
        }
    }

    handleWeekChange = value => {
        console.log('week:' + value)
        const { search } = this.state
        search['week'] = value
        this.setState({ search })
        console.log('参数：' + JSON.stringify(search))
        if ((search.year != null && search.week != null) || (search.year == null && search.week == null)) {
            this.ChannelEvolutionTable.queryPage(search)
        }
    }

    handleResetDate = () => {
        const { search } = this.state
        search['year'] = null
        search['week'] = null
        this.setState({ search })
        this.ChannelEvolutionTable.queryPage(search)
    }

    handleDownload = () => {
        const group = this.state.search.group;
        const year = this.state.search.year;
        const week = this.state.search.week;

        // 检查参数是否缺失
        if (group === null || year === null || week === null) {
            alert("参数缺失");
            return; // 终止函数执行
        }

        // 构建带参数的 URL
        let url = `${HOST}/channelEvolution/downloadExcel?group=${group}&year=${year}&week=${week}`;

        // 发送 GET 请求
        axios
            .get(url, {
                responseType: 'blob', // 声明响应类型为 Blob
                // 使用原始响应头
                headers: {
                    'Access-Control-Expose-Headers': 'Content-Disposition'
                }
            })
            .then(res => {
                if (res.data) {
                    // 获取文件名
                    let filename = 'download.xlsx';
                    const contentDisposition = res.headers["content-disposition"];
                    if (contentDisposition) {
                        const filenameStartIndex = contentDisposition.indexOf("filename=");
                        if (filenameStartIndex !== -1) {
                            filename = contentDisposition.substring(filenameStartIndex + 9).trim();
                        }
                    }

                    // 创建 Blob URL
                    const blobUrl = URL.createObjectURL(new Blob([res.data]));

                    // 创建隐藏的 <a> 元素并设置链接
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = filename; // 设置文件名
                    document.body.appendChild(a);

                    // 触发下载
                    a.click();

                    // 释放资源
                    window.URL.revokeObjectURL(blobUrl);
                    document.body.removeChild(a);
                } else {
                    console.log('未收到有效数据');
                }
            })
            .catch(err => {
                // 请求失败
                console.error('请求失败', err);
            });
    }

    render() {
        const years = [
            { value: null, label: ' ' },
            { value: 2024, label: '2024' }
        ] // 假设年份信息存在数组中
        const weeks = [{ value: null, label: ' ' }]
        for (let i = 1; i <= 52; i++) {
            weeks.push({ value: i, label: i.toString() })
        }

        return (
            <Layout className='animated fadeIn'>
                <div>
                    <CustomBreadcrumb arr={['用户管理', '频道访问量列表']}></CustomBreadcrumb>
                </div>
                <Row>
                    <Col>
                        <div className='base-style' style={{ width: '100%' }}>
                            {/* Add tab buttons here */}
                            <div style={{ marginBottom: '16px' }}>
                                <Button style={{ marginRight: '8px' }} onClick={() => this.handleTabPageChange(0)}>
                                    全部
                                </Button>
                                <Button style={{ marginRight: '8px' }} onClick={() => this.handleTabPageChange(1)}>
                                    800
                                </Button>
                                <Button style={{ marginRight: '8px' }} onClick={() => this.handleTabPageChange(2)}>
                                    1000
                                </Button>
                                <Button style={{ marginRight: '8px' }} onClick={() => this.handleTabPageChange(3)}>
                                    1200
                                </Button>
                                <Button style={{ marginRight: '8px' }} onClick={() => this.handleTabPageChange(4)}>
                                    1500
                                </Button>
                                <Button style={{ marginRight: '8px' }} onClick={() => this.handleTabPageChange(5)}>
                                    无上限
                                </Button>
                                <Select
                                    value={this.state.search.year}
                                    onChange={this.handleYearChange}
                                    placeholder='Select Year'
                                    style={{ width: '120px', marginRight: '8px' }} // 调整下拉框宽度
                                >
                                    {years.map(year => (
                                        <Select.Option key={year.value} value={year.value}>
                                            {year.label}
                                        </Select.Option>
                                    ))}
                                </Select>

                                <Select
                                    value={this.state.search.week}
                                    onChange={this.handleWeekChange}
                                    placeholder='Select Week'
                                    style={{ width: '120px', marginRight: '8px' }} // 调整下拉框宽度
                                >
                                    {weeks.map(week => (
                                        <Select.Option key={week.value} value={week.value}>
                                            {week.label}
                                        </Select.Option>
                                    ))}
                                </Select>

                                <Button style={{ marginRight: '8px' }} onClick={this.handleResetDate}>重置日期</Button>

                                <Button onClick={this.handleDownload}>下载</Button>

                            </div>

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

    queryPage = filters => {
        console.log('queryPage:' + JSON.stringify(filters))
        // 确保 filters 被定义
        let params = filters || { group: 0 }

        // 在修改 params 前检查 year 或 week 是否为 null
        if (params.year == null || params.week == null) {
            params.year = null
            params.week = null
        }

        console.log('queryPage params:' + JSON.stringify(params))

        this.setState({ loading: true })
        let url = HOST + '/channelEvolution/list'
        axios
            .post(url, params)
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
            .catch(err => {
                console.error('请求失败', err)
            })
    }

    // 渲染数据
    render() {
        const { data } = this.state

        const processedData = data.map((item, index) => ({
            ...item,
            index: index + 1 // 自动计算序号，从1开始递增
        }))

        return (
            <div style={{ position: 'relative' }}>
                <Table
                    rowKey={(r, i) => i.toString()}
                    columns={this.columns}
                    dataSource={processedData}
                    onChange={this.handleTableChange}
                    pagination={false}
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
            title: '地区',
            dataIndex: 'region',
            key: 'region',
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
            title: '价格',
            dataIndex: 'priceStr',
            key: 'priceStr',
            align: 'center',
            resizable: true, // 允许调节列宽
            sorter: true
        },
        {
            title: '访问量',
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
            title: '排名变化',
            dataIndex: 'rankChanged',
            key: 'rankChanged',
            align: 'center',
            resizable: true,
            sorter: true
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
            title: '开课时间',
            dataIndex: 'firstMessageTime',
            key: 'firstMessageTime',
            align: 'center',
            resizable: true,
            sorter: true,
            render: text => {
                const date = new Date(text)
                const formattedTime = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}` // 加1是因为getMonth()返回的月份是从0开始计数的
                return <span>{formattedTime}</span>
            }
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
            title: '标签',
            dataIndex: 'tag',
            key: 'tag',
            align: 'center',
            resizable: true // 允许调节列宽
        }
    ]
}

const TeacherView = () => {
    return <Root />
}

export default TeacherView
