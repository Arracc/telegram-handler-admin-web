import React, { Component } from 'react';
import CustomBreadcrumb from '@/components/CustomBreadcrumb'
import { Layout, Divider, Row, Col, Tag, Table, Button, Anchor, Alert, Modal, Descriptions } from 'antd'
import '@/style/view-style/table.scss'



import axios from '@/api'
import { HOST } from '@/api/config.js'

const { Column } = Table
const { Link } = Anchor


class Root extends Component {
    state = {
        groupCount: 0,
        groupId: null,
        messageList: [],
    }

    // 接收公共方法更新state
    updatePublicData(data) {
        this.setState({
            groupCount: data.groupCount,
        })
    }

    // 调用群信息模块显示方法
    showGroupInfoModal(data) {
        let groupId = data.groupId;
        this.setState({
            groupId: groupId,
        })
        // 调用groupInfoTable的显示方法
        this.GroupInfoModal.showModal(groupId);
    }

    // 调用群用户模块显示方法
    showGroupMemberTable(data) {
        let groupId = data.groupId;
        this.setState({
            groupId: groupId,
        })
        // 调用groupMemberTable的显示方法
        this.GroupMemberTableModal.showModal(groupId);
    }

    // 调用群消息模块显示方法
    showGroupMessageTable(data) {
        let groupId = data.groupId;
        this.setState({
            groupId: groupId,
        })
        // 调用groupMemberTable的显示方法
        this.GroupMessageTableModal.showModal(groupId);
    }

    render() {
        return (
            <Layout className='animated fadeIn'>
                <div>
                    <CustomBreadcrumb arr={['老师管理', '老师列表']}></CustomBreadcrumb>
                </div>
                <CountInfo groupCount={this.state.groupCount} />

                <Row>
                    <Col>
                        <div className='base-style'>
                            <h3 id='basic'>老师列表</h3>
                            <Divider />
                            <GroupTable updatePublicData={(data) => this.updatePublicData(data)} showGroupInfoModal={(data) => this.showGroupInfoModal(data)}
                                showGroupMemberTable={(data) => this.showGroupMemberTable(data)} showGroupMessageTable={(data) => this.showGroupMessageTable(data)} />
                        </div>
                    </Col>
                </Row>

                <GroupInfoModal groupId={this.state.groupId} ref={node => this.GroupInfoModal = node} />

                <GroupMemberTableModal groupId={this.state.groupId} ref={node => this.GroupMemberTableModal = node} />

                <GroupMessageTableModal groupId={this.state.groupId} ref={node => this.GroupMessageTableModal = node} />

            </Layout>
        )
    }

}


class CountInfo extends Component {
    render() {
        return (
            <div className='base-style'>
                <h3>群数量统计</h3>
                <Divider />
                <p>{this.props.groupCount} 个</p>
            </div>)
    }
}


class GroupTable extends Component {
    // 声明state
    state = {
        data: [],
        pagination: {},
        loading: false,
    }


    // 初始化异步数据
    componentDidMount() {
        this.getUserList();
    }

    // 表格变更处理
    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.getUserList({
            results: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        });
    };

    // 异步获取数据
    getUserList = (params = {}) => {
        this.setState({ loading: true });
        let url = HOST + "//teacher/queryList"

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
                    // 更新数据到父组件
                    this.props.updatePublicData({
                        groupCount: data.groupCount,
                    })

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
            <Table rowKey={(r, i) => { return i.toString() }} columns={this.columns} dataSource={this.state.data.groupList} onChange={this.handleTableChange} />
        );
    }

    columns = [
        {
            title: '群ID',
            dataIndex: 'groupId',
            key: 'groupId',
        },
        {
            title: '群名称',
            dataIndex: 'groupName',
            key: 'groupName',
        },
        {
            title: '群状态',
            dataIndex: 'groupStatus',
            key: 'groupStatus',
        },
        {
            title: '操作',
            render: (text, record, index) => {
                return (
                    <span>
                        <Button type='button' onClick={() => this.showGroupInfo(record.groupId)}>查看群信息</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type='button' onClick={() => this.showGroupMemberList(record.groupId)}>查看群成员</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type='button' onClick={() => this.showGroupMessageList(record.groupId)}>查看群消息</Button>
                    </span>
                )
            }
        }
    ];

    // 弹出群信息窗口
    showGroupInfo = (groupId) => {
        this.props.showGroupInfoModal({ groupId: groupId });
    }

    // 弹出群成员列表窗口
    showGroupMemberList = (groupId) => {
        this.props.showGroupMemberTable({ groupId: groupId });
    }

    // 弹出群消息列表窗口
    showGroupMessageList = (groupId) => {
        this.props.showGroupMessageTable({ groupId: groupId });
    }

}


// 群信息模块
class GroupInfoModal extends Component {
    state = {
        visible: false,
        groupId: 0,
        groupInfo: {
            groupName: null,
            groupStatus: null,
            creator: null,
            createTime: null,
            closeTime: null,
        },
    };

    showModal = (groupId) => {
        console.log('showModal:' + groupId);
        // 如果群id变更，清空原表格中的数据
        // if (groupId != this.state.groupId) {
        //     console.log('清空表格数据');
        //     this.getGroupMessageList({ groupId: groupId });
        // }
        this.getGroupInfo({ groupId: groupId })
        this.setState({
            visible: true,
            groupId: groupId,
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

    // 异步获取数据
    getGroupInfo = (params) => {
        let url = HOST + "/manage/getGroupInfo";
        axios.post(url, { groupId: params.groupId })
            .then(res => {
                if (res.data.code === 200) {
                    const pagination = { ...this.state.pagination };
                    pagination.total = 200;
                    this.setState({
                        loading: false,
                        groupInfo: res.data.data,
                        pagination,
                    });
                } else {
                    // 这里处理一些错误信息
                    console.log('请求错误');
                }
            })
            .catch(err => { })
    }

    render() {
        return (
            <>
                <Modal title="群信息" visible={this.state.visible} open={this.showModal} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Descriptions title="群信息" layout="vertical">
                        <Descriptions.Item label="群名称">{this.state.groupInfo.groupName}</Descriptions.Item>
                        <Descriptions.Item label="群状态">{this.state.groupInfo.groupStatus}</Descriptions.Item>
                        <Descriptions.Item label="创建者">{this.state.groupInfo.creator}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">{this.state.groupInfo.createTime}</Descriptions.Item>
                        <Descriptions.Item label="关闭时间">{this.state.groupInfo.closeTime}</Descriptions.Item>
                    </Descriptions>
                </Modal>


            </>
        )
    }
}


// 群成员模块
class GroupMemberTableModal extends Component {
    state = {
        visible: false,
        groupId: 0,
    };

    showModal = (groupId) => {
        console.log('showModal:' + groupId);
        this.setState({
            visible: true,
            groupId: groupId,
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
                <Modal title="群成员列表" visible={this.state.visible} open={this.showModal} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <GroupMemberTable groupId={this.props.groupId} />
                </Modal>
            </>
        )
    }
}


class GroupMemberTable extends Component {
    // 声明state
    state = {
        pagination: {},
        loading: false,
        groupId: 0,
        memberList: [],
    }

    // 初始化异步数据
    componentDidMount() {
        this.getGroupMemberList({ groupId: this.props.groupId });
    }

    // 表格变更处理
    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.getGroupMemberList({
            results: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
            groupId: this.props.groupId,
        });
    };

    // 异步获取数据
    getGroupMemberList = (params) => {
        let url = HOST + "/manage/getGroupMemberList";
        axios.post(url, { groupId: params.groupId })
            .then(res => {
                if (res.data.code === 200) {
                    const pagination = { ...this.state.pagination };
                    pagination.total = 200;
                    this.setState({
                        loading: false,
                        memberList: res.data.data.memberList,
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
            <Table rowKey={(r, i) => { return i.toString() }} columns={this.columns} dataSource={this.state.memberList} onChange={this.handleTableChange} />
        );
    }

    columns = [
        {
            title: '昵称',
            dataIndex: 'nickname',
            key: 'nickname',
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


// 群消息模块
class GroupMessageTableModal extends Component {
    state = {
        visible: false,
        groupId: 0,
        messageList: []
    };

    showModal = (groupId) => {
        console.log('showModal:' + groupId);
        // 如果群id变更，清空原表格中的数据
        if (groupId != this.state.groupId) {
            console.log('清空表格数据');
            this.getGroupMessageList({ groupId: groupId });
        }
        this.setState({
            visible: true,
            groupId: groupId,
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

    // 异步获取数据
    getGroupMessageList = (params) => {
        let url = HOST + "/manage/getGroupMessageList";
        axios.post(url, { groupId: params.groupId })
            .then(res => {
                if (res.data.code === 200) {
                    const pagination = { ...this.state.pagination };
                    pagination.total = 200;
                    this.setState({
                        loading: false,
                        messageList: res.data.data,
                        pagination,
                    });
                } else {
                    // 这里处理一些错误信息
                    console.log('请求错误');
                }
            })
            .catch(err => { })
    }

    render() {
        return (
            <>
                <Modal title="群消息列表" visible={this.state.visible} open={this.showModal} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <GroupMessageTable groupId={this.state.groupId} messageList={this.state.messageList} />
                </Modal>
            </>
        )
    }
}


class GroupMessageTable extends Component {
    // 声明state
    state = {
        pagination: {},
        loading: false,
    }

    // 初始化异步数据
    componentDidMount() {
        console.log('初始化异步数据:' + this.props.groupId + ':' + this.props.messageList)
    }


    // 表格变更处理
    handleTableChange = (pagination, filters, sorter) => {
        console.log('表格变更')
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
            messageList: this.props.memberList,
        });
    };

    // 渲染数据
    render() {
        return (
            <Table rowKey={(r, i) => { return i.toString() }} columns={this.columns} dataSource={this.props.messageList} onChange={this.handleTableChange} />
        );
    }

    columns = [
        {
            title: '群消息id',
            dataIndex: 'groupMessageId',
            key: 'groupMessageId',
        },
        {
            title: '消息类型',
            dataIndex: 'messageType',
            key: 'messageType',
            render: (text) => {
                switch (text) {
                    case 1:
                        return '聊天消息';
                    case 2:
                        return '通知消息';
                    default:
                        break;
                }
            }
        },
        {
            title: '消息内容',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: '发送者id',
            dataIndex: 'senderUserId',
            key: 'senderUserId',
        },
        {
            title: '发送时间',
            dataIndex: 'sendTime',
            key: 'sendTime',
        },
    ];

}


const GroupView = () => (
    <Root />
)


export default GroupView
