import React, { Component } from 'react'
import CustomBreadcrumb from '@/components/CustomBreadcrumb'
import { Layout, Divider, Row, Col, Tag, Table, Button, Anchor, Alert, Modal } from 'antd'
import '@/style/view-style/table.scss'

import axios from '@/api'
import { HOST } from '@/api/config.js'

const { Column } = Table
const { Link } = Anchor


class Root extends Component {
    state = {
    }

    render() {
        return (
            <Layout className='animated fadeIn'>
                <div>
                    <CustomBreadcrumb arr={['消息记录', '未送达列表']}></CustomBreadcrumb>
                </div>

                <Row>
                    <Col>
                        <div className='base-style'>
                            <h3 id='basic'>未送达消息列表</h3>
                            <Divider />
                            <UndeliveredMessageTable updatePublicData={(data) => this.updatePublicData(data)} showMessageContentTable={(data) => this.showMessageContentTable(data)} />
                        </div>
                    </Col>
                </Row>

            </Layout>
        )
    }

}


class UndeliveredMessageTable extends Component {
    // 声明state
    state = {
        data: [],
        pagination: {},
        loading: false,
    }

    // 初始化异步数据
    componentDidMount() {
        this.getUndeliveredMessageList();
    }

    // 表格变更处理
    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.getUndeliveredMessageList({
            results: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        });
    };

    // 异步获取数据
    getUndeliveredMessageList = (params = {}) => {
        this.setState({ loading: true });
        let url = HOST + "/manage/getUndeliveredMessageList"

        axios.post(url, {})
            .then(res => {
                if (res.data.code === 200) {
                    const pagination = { ...this.state.pagination };
                    pagination.total = 200;
                    let data = res.data.data;
                    this.setState({
                        loading: false,
                        data: data,
                        pagination,
                    });
                } else {
                    // 这里处理一些错误信息
                    console.log('请求错误');
                }
            })
            .catch(err => { })
    }

    // 渲染数据
    render() {
        return (
            <Table rowKey={(r, i) => { return i.toString() }} columns={this.columns} dataSource={this.state.data.undeliveredMessageList} onChange={this.handleTableChange} />
        );
    }

    columns = [
        {
            title: '消息ID',
            dataIndex: 'messageId',
            key: 'messageId',
        },
        {
            title: '消息类型',
            dataIndex: 'messageType',
            key: 'messageType',
            render: (text) => {
                switch (text) {
                    case 1:
                        return '私聊消息';
                        break;
                    case 2:
                        return '群聊消息';
                        break;
                    case 3:
                        return '系统消息';
                        break;
                    default:
                        break;
                }

            }
        },
        {
            title: '消息内容',
            dataIndex: 'body',
            key: 'body',
            render: (text) => JSON.stringify(text),
        },
        {
            title: '发送时间',
            dataIndex: 'sendTime',
            key: 'sendTime',
        },
        {
            title: '接收者sessionId',
            dataIndex: 'recipientSessionId',
            key: 'recipientSessionId',
        },
        {
            title: '操作',
            render: (text, record, index) => {
                return (
                    <span><Button type='button' >查看消息内容</Button></span>
                )
            }
        }
    ];

}


const UndeliveredMessageView = () => (
    <Root />
)


export default UndeliveredMessageView
