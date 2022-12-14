import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Popconfirm, Select, Input, Form } from 'antd';
import moment from 'moment';
import {
    getProjectList, getAuthor,
    getAppMessage, removeAppMessage
} from '../actions/appMessage';
import AppMessageForm from '../components/appMessageForm';
import { PinyinHelper, Func } from '@peace/utils';
import { AuthorizationCode } from '$utils';

const { AddAppNotice, UpdateAppNotice, DeleteAppNotice } = AuthorizationCode

class AppNotice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appMessage: false,
            appMessageData: null,
            selectedProjectId: null,
            selectedState: 'all',
            keywords: '',
            sorter: {
                field: 'expiredTime',
                order: 'descend'
            },
        }
    }

    componentDidMount() {
        const { dispatch, user } = this.props
        dispatch(getProjectList(user.id))
        dispatch(getAuthor(user.orgId))
        dispatch(getAppMessage())
    }

    showAppMessageForm = (record) => {
        this.setState({ appMessage: true, appMessageData: record });
    }

    hiddenAppMessageForm = () => {
        this.setState({ appMessage: false, appMessageData: null });
    }

    getAppMessages = () => {
        const { selectedProjectId, selectedState, keywords } = this.state;
        let query = {};
        if (selectedProjectId != null) {
            query.projectId = selectedProjectId
        }
        if (selectedState != 'all') {
            query.state = Number(selectedState)
        }
        if (keywords != '') {
            query.keywords = keywords
        }
        this.props.dispatch(getAppMessage(query));
    }

    deleteAppMessage = (id) => {
        this.props.dispatch(removeAppMessage(id)).then(res => this.getAppMessages());
    }

    onTableChange = (pagination, filters, sorter) => {
        this.setState({
            sorter: {
                field: sorter.field,
                order: sorter.order
            }
        });
    }

    render() {
        const projects = (this.props.projects || []).reduce((p, n) => p.concat(n.projects), []);
        const projectOptions = (this.props.projects || []).filter(p => p.status == 4).reduce((p, n) => p.concat(n.projects), [])
        const canAdd = Func.judgeRights(AddAppNotice)
        const canEdit = Func.judgeRights(UpdateAppNotice)
        const canDelete = Func.judgeRights(DeleteAppNotice)

        const columns = [{
            title: "????????????",
            key: 'projectId',
            dataIndex: 'projectId',
            render: (text, record) => {
                const project = projects.find(p => p.id == record.projectId);
                return project ? project.name : ''
            }
        }, {
            title: "??????",
            key: 'title',
            dataIndex: 'title',
            width: '30%'
        }, {
            title: "????????????",
            key: 'postTime',
            dataIndex: 'postTime'
        }, {
            title: "?????????",
            key: 'userId',
            dataIndex: 'userId',
            render: (text, record) => {
                let user = null;
                this.props.users.forEach(d => {
                    d.posts.forEach(p => {
                        p.members.forEach(m => {
                            if (m.id == record.userId) {
                                user = m;
                            }
                        })
                    })
                });
                return user ? user.username : ''
            }
        }, {
            title: "??????????????????",
            key: 'expiredTime',
            dataIndex: 'expiredTime',
            sorter: (a, b) => moment(a.expiredTime) - moment(b.expiredTime),
            sortOrder: this.state.sorter.field == 'expiredTime' ? this.state.sorter.order : 'descend'

        }, {
            title: "??????",
            key: 'state',
            dataIndex: 'state',
        }, {
            title: "??????",
            key: "action",
            dataIndex: "action",
            render: (text, record) => {
                return (
                    <div>
                        {canEdit ? <a onClick={() => this.showAppMessageForm(record)}>??????</a> : null}
                        &nbsp;&nbsp;
                        {canDelete ? <Popconfirm title="?????????????????????????????????" onConfirm={() => this.deleteAppMessage(record.id)}><a>??????</a></Popconfirm> : null}
                    </div>
                );
            }
        }];

        let dataSource = [];
        this.props.appMessages ?
            this.props.appMessages.map(msg => {
                const project = this.props.projects.find(p => p.projects[0].id == msg.projectId);
                if (project) {
                    dataSource.push(Object.assign({}, msg, {
                        projectName: project ? project.name : '',
                        state: moment(msg.expiredTime) - moment() > 0 ? '?????????' : '?????????',
                        expiredTime: moment(msg.expiredTime).format('YYYY-MM-DD HH:mm:ss'),
                        postTime: moment(msg.postTime).format('YYYY-MM-DD HH:mm:ss')
                    }))
                }
            }) : null;

        return (
            <div>
                <div style={{ marginBottom: 16 }}>
                    <div style={{ float: 'left' }}>
                        <Button type="primary" disabled={!canAdd} onClick={() => this.showAppMessageForm()}>??????</Button>
                    </div>
                    <div style={{ float: 'right' }}>
                        <Form layout="inline">
                            <Form.Item>
                                <Select placeholder='????????????' style={{ width: 200 }}
                                    onChange={v => this.setState({ selectedProjectId: v })}
                                    showSearch allowClear
                                    optionFilterProp="children"
                                    filterOption={(input, option) => {
                                        const { children } = option.props;
                                        return (
                                            children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                                            PinyinHelper.isPinyinMatched(children, input)
                                        );
                                    }}>
                                    {
                                        projectOptions.map(p => (
                                            <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Select placeholder="??????" style={{ width: 200 }} defaultValue={'all'} onChange={v => this.setState({ selectedState: v })}>
                                    <Select.Option value="all">????????????</Select.Option>
                                    <Select.Option value="1">?????????</Select.Option>
                                    <Select.Option value="0">?????????</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Input onChange={e => this.setState({ keywords: e.target.value })} placeholder="?????????" />
                            </Form.Item>
                            <Button type="primary" onClick={() => this.getAppMessages()}>??????</Button>
                        </Form>
                    </div>
                    <div style={{ clear: 'both' }}></div>
                </div>
                <Table columns={columns} dataSource={dataSource} loading={this.props.isRequesting} onChange={this.onTableChange} />

                <AppMessageForm
                    projects={projectOptions}
                    visible={this.state.appMessage}
                    hiddenForm={() => this.hiddenAppMessageForm()}
                    editData={this.state.appMessageData}
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { appMessage, projectList, auth, author } = state;

    return {
        user: auth.user,
        appMessages: appMessage.data || [],
        isRequesting: appMessage.isRequesting || projectList.isRequesting || auth.isRequesting,
        projects: projectList.data || [],
        users: author.data
    }
}

export default connect(mapStateToProps)(AppNotice);