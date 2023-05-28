import React, { Component } from 'react'
import CustomBreadcrumb from '@/components/CustomBreadcrumb'
import { Layout, Divider, Row, Col, Tag, Table, Button, Anchor, Modal } from 'antd'
import '@/style/view-style/table.scss'
import axios from '@/api'
import { HOST } from '@/api/config.js'


const { Column } = Table
const { Link } = Anchor

class Root extends Component {
    state = {
        userCount: 0,
        sessionCount: 0,
        userId: 0,
        userSessionList: []
    }

    // 接收公共方法更新state
    updatePublicData(data) {
        this.setState({
            userCount: data.userCount,
            sessionCount: data.sessionCount,
        })
    }


    showUserSessionTable(data) {
        this.setState({
            userId: data.userId,
            userSessionList: data.userSessionList,
        })
        // 调用groupMemberTable的显示方法
        this.SessionTableModal.showModal(data.userSessionList);
    }


    render() {
        return (
            <Layout className='animated fadeIn'>
                <div>
                    <CustomBreadcrumb arr={['老师管理', '老师列表']}></CustomBreadcrumb>
                </div>
                <CountInfo userCount={this.state.userCount} sessionCount={this.state.sessionCount} />

                <div className='base-style'>
                    <h3>查找用户</h3>
                    <Divider />
                    <span><input id='userId'></input>&nbsp;&nbsp;&nbsp;&nbsp;<Button>查找</Button></span>
                </div>

                <Row>
                    <Col>
                        <div className='base-style'>
                            <h3 id='myTable'>老师列表</h3>
                            <Divider />
                            <OnlineUserTable updatePublicData={(data) => this.updatePublicData(data)} showUserSessionTable={(data) => this.showUserSessionTable(data)} />
                        </div>
                    </Col>
                </Row>

                <UserSessionTableModal ref={node => this.SessionTableModal = node} />

            </Layout>
        )
    }
}


class CountInfo extends Component {
    render() {
        return (
            <div className='base-style'>
                <h3>在线用户统计</h3>
                <Divider />
                <p>在线用户数：{this.props.userCount}</p>
                <p>在线用户连接数：{this.props.sessionCount}</p>
            </div>)
    }
}


class OnlineUserTable extends Component {
    // 声明state
    state = {
        data: [],
        pagination: {},
        loading: false,
    }

    // 初始化异步数据
    componentDidMount() {
        this.queryList();
    }

    // 表格变更处理
    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.queryList({
            results: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        });
    };

    // 异步获取数据
    queryList = () => {
        console.log('get')
        this.setState({ loading: true });
        // let url = HOST + "/teacher/queryList";
        let url = 'http://localhost:3000/api1/admin/teacher/queryList'
        axios.post(url, {})
            .then(res => {
                if (res.data.code === 200) {
                    const pagination = { ...this.state.pagination };
                    pagination.total = 200;
                    let data = res.data.data
                    this.setState({
                        loading: false,
                        data: data,
                        pagination,
                    });
                    // 更新统计数据到父组件
                    this.props.updatePublicData({
                        userCount: data.userCount,
                        sessionCount: data.sessionCount
                    })
                } else {
                    // 这里处理一些错误信息
                    console.log('请求错误')
                }
            })
            .catch(err => { })
    }

    // 渲染数据
    render() {
        return (
            <Table rowKey={(r, i) => { return i.toString() }} columns={this.columns} dataSource={this.state.data.userList} onChange={this.handleTableChange} />
        );
    }

    columns = [
        {
            title: '用户ID',
            dataIndex: 'userId',
            key: 'userId',
        },
        {
            title: '操作',
            render: (text, record, index) => {
                return (
                    <span><Button type='button' onClick={() => this.showUserSessionList(record)}>查看用户连接</Button></span>
                )
            }

        }
    ]

    // 弹出用户连接列表窗口
    showUserSessionList = (record) => {
        this.props.showUserSessionTable({ userId: record.userId, userSessionList: record.userSessionList });
    }

}


class UserSessionTableModal extends Component {
    state = {
        visible: false,
        userId: 0,
        userSessionList: []
    };

    showModal = (data) => {
        this.setState({
            visible: true,
            userId: this.props.userId,
            userSessionList: data,
        });
    };

    handleOk = () => {
        console.log('handleOk')
        this.setState({
            visible: false,
        })
    };

    handleCancel = () => {
        console.log('handleCancel')
        this.setState({
            visible: false,
        })
    };

    render() {
        return (
            <>
                <Modal title="用户连接列表" visible={this.state.visible} open={this.showModal} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <UserSessionTable userId={this.state.userId} userSessionList={this.state.userSessionList} />
                </Modal>
            </>
        )
    }
}


class UserSessionTable extends Component {
    // 声明state
    state = {
        pagination: {},
        loading: false,
        userId: 0,
        userSessionList: [],
    }

    // 初始化异步数据
    componentDidMount() {
        this.getConnectionList();
    }

    // 表格变更处理
    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.getConnectionList({
            results: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
            groupId: this.props.groupId,
        });
    };

    // 异步获取数据
    getConnectionList = () => {
        this.setState({
            userSessionList: this.props.userSessionList,
        })

    }

    // 渲染数据
    render() {
        return (
            <Table rowKey={(r, i) => { return i.toString() }} columns={this.columns} dataSource={this.state.userSessionList} onChange={this.handleTableChange} />
        );
    }

    columns = [
        {
            title: '会话id',
            dataIndex: 'sessionId',
            key: 'sessionId',
        },
        {
            title: '客户端类型',
            dataIndex: 'clientType',
            key: 'clientType',
        },
        {
            title: '群id',
            dataIndex: 'groupId',
            key: 'groupId',
        },
        {
            title: '连接时间',
            dataIndex: 'connectionTime',
            key: 'connectionTime',
        },
        {
            title: '操作',
            render: (text, record, index) => {
                return (
                    <span><Button type='button' >查看用户信息</Button></span>
                )
            }
        }
    ];

}



const OnlineUserView = () => {
    return (
        <Root />
    )
}

export default OnlineUserView
