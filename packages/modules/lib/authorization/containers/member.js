'use strict'

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Tree, Row, Col, Button, Input, Table, Popconfirm, Spin, Divider } from 'antd';
import style from '../style.css';
import { getAuthorList, } from '../actions/author';
import { deleteDepartment, deletePost, deleteMember, } from '../actions/member';
import DepartmentModal from '../components/member/departmentModal'
import PostModal from '../components/member/postModal'
import MemberModal from '../components/member/memberModal'
import BatchDelModal from '../components/member/batchDelModal'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { AuthorizationCode } from '$utils';
import { PinyinHelper, Func } from '@peace/utils'
import PerfectScrollbar from 'perfect-scrollbar';

const { AddDepartment, AddPosition, ModifyDepartmentName, DeleteDepartment, ModifyPositionName, DeletePosition,
    AddMember, ModifyMember, DeleteMember, } = AuthorizationCode

const Member = (props) => {
    const { dispatch, isRequesting, user, clientHeight, authorData } = props
    const [showDeleteAll, setShowDeleteAll] = useState(false)
    const [searchKey, setSearchKey] = useState('')
    const [currentDepartment, setCurrentDepartment] = useState('')
    const [currentPost, setCurrentPost] = useState('')
    const [departmentModal, setDepartmentModal] = useState(null)
    const [postModal, setPostModal] = useState(null)
    const [memberModal, setMemberModal] = useState(null)
    const [selectedRowKeys, setSelectedRowKeys] = useState([])

    const getAuthData = () => {
        dispatch(getAuthorList(user.orgId));
    }

    const done = (res) => {
        if (res.success) {
            getAuthData()
            setDepartmentModal()
            setPostModal()
            setMemberModal()
        }
    }

    useEffect(() => {
        getAuthData()
        new PerfectScrollbar('#departmentFlow', { suppressScrollX: true });
    }, [])

    const renderTreeGroupTitle = (s) => {
        let isDefault = s.departmentName == '??????';
        return (
            <div onClick={() => {
                setCurrentPost('')
                setCurrentDepartment(s.departmentId)
                setShowDeleteAll(s.departmentId !== '??????')
                setSearchKey('')
            }} className={style.icon} >
                {s.departmentName}
                {
                    isDefault ? '' :
                        <span className={style.tip}>
                            {
                                Func.judgeRights(ModifyDepartmentName,
                                    <EditOutlined
                                        onClick={() => { handlePart(s.departmentId) }}
                                        style={{ marginRight: 8 }}
                                    />)
                            }{
                                Func.judgeRights(DeleteDepartment,
                                    <Popconfirm
                                        placement="top" title={'????????????????????????????(???????????????????????????????????????)'}
                                        onConfirm={() => {
                                            dispatch(deleteDepartment(s.departmentId)).then(res => { done(res) })
                                        }}
                                    >
                                        <DeleteOutlined />
                                    </Popconfirm>)
                            }
                        </span>
                }
            </div >
        )
    };

    const renderTreeTitle = (k, departmentId) => {
        let isOwner = k.name == '?????????';
        return (
            <div onClick={() => {
                setCurrentPost(k.id)
                setCurrentDepartment(departmentId)
                setShowDeleteAll(k.name !== '?????????')
                setSearchKey('')
            }} className={style.icon}>
                {k.name}{k.type ? '(????????????)' : ''}
                {
                    isOwner ? '' :
                        <span className={style.tip}>
                            {
                                Func.judgeRights(ModifyPositionName,
                                    <EditOutlined
                                        onClick={() => { handlePost(k) }}
                                        style={{ marginRight: 8 }}
                                    />)
                            }{
                                Func.judgeRights(DeletePosition,
                                    <Popconfirm placement="top" title={'????????????????????????????(??????????????????????????????)'}
                                        onConfirm={() => dispatch(deletePost(k.id)).then(res => done(res))}
                                    >
                                        <DeleteOutlined />
                                    </Popconfirm>)
                            }
                        </span>
                }
            </div>
        )
    };

    const tableColumns = () => {
        return [
            {
                title: '??????',
                dataIndex: 'showname',
                key: 'showname'
            },
            {
                title: '?????????',
                dataIndex: 'username',
                key: 'username'
            }, {
                title: '??????',
                dataIndex: 'post',
            }, {
                title: '?????????',
                dataIndex: 'phone',
            }, {
                title: '??????',
                dataIndex: 'email',
            }, {
                title: '??????',
                dataIndex: 'enabledValue',
            }, {
                title: '??????',
                dataIndex: 'operation',
                render: (text, record) => {
                    if (record.portal == 'A') {
                        return Func.judgeRights(ModifyMember, <a onClick={() => handleMember(record)}>??????</a>)
                    } else {
                        return (
                            <div>
                                {Func.judgeRights(ModifyMember,
                                    <a onClick={() => handleMember(record)}>??????</a>)
                                }{Func.judgeRights(ModifyMember) && Func.judgeRights(DeleteMember) ?
                                    <Divider type="vertical" /> : ''
                                }{Func.judgeRights(DeleteMember,
                                    <Popconfirm placement="top" title={'????????????????????????'}
                                        onConfirm={() => dispatch(deleteMember(record.id)).then(res => done(res))} okText="???" cancelText="???">
                                        <a>??????</a>
                                    </Popconfirm>
                                )}
                            </div >
                        )
                    }
                }
            }];
    }

    const renderDataSource = () => {
        let dataSource = [];
        for (let i = 0; i < authorData.length; i++) {
            let s = authorData[i];
            if (s.departmentId == currentDepartment || (!currentDepartment && !i)) {
                s.posts.map(k => {
                    !currentPost || currentPost == k.id ?
                        k.members.map(x => {
                            if ([x.name, x.username].some(s => PinyinHelper.isSearchMatched(s, searchKey))) {
                                dataSource.push({
                                    "id": x.id,
                                    "showname": x.name,
                                    "username": x.username,
                                    "post": k.name,
                                    "phone": x.phone,
                                    "email": x.email,
                                    "enabled": x.enabled,
                                    "enabledValue": x.enabled == true ? '??????' : '??????',
                                    "departmentId": s.departmentId,
                                    "postId": k.id,
                                    "portal": k.portal,
                                })
                            }
                        }) : ''
                })
            }
        }
        return dataSource
    }

    const handlePart = (departmentId) => {
        setDepartmentModal(
            <DepartmentModal
                closeModal={() => {
                    setDepartmentModal(null)
                }}
                done={done}
                departmentId={departmentId}
            />
        )
    };

    const handlePost = (post, departmentId) => {
        setPostModal(
            <PostModal
                closeModal={() => {
                    setPostModal(null)
                }}
                done={done}
                post={post}
            />
        )
    }

    const handleMember = (member) => {
        setMemberModal(
            <MemberModal
                closeModal={() => {
                    setMemberModal(null)
                }}
                done={done}
                member={member}
            />
        )
    }

    return (
        <Spin spinning={isRequesting}>
            <Row gutter={16}>
                <Col span={5}>
                    <Row type="flex" style={{
                        margin: '0px 0px 16px'
                    }}>
                        {Func.judgeRights(AddDepartment,
                            <Button onClick={() => handlePart(null)} style={{ marginRight: 16 }}>????????????</Button>)}
                        {departmentModal}
                        {Func.judgeRights(AddPosition,
                            <Button onClick={() => handlePost(null)}>????????????</Button>)}
                        {postModal}
                    </Row>
                    <div style={{ overflow: 'auto', position: 'relative', height: clientHeight - 53 - 16 - 24 - 32 - 16 }} id="departmentFlow">
                        {
                            authorData.length ?
                                <Tree
                                    defaultExpandedKeys={[authorData[0].departmentId]}
                                    defaultSelectedKeys={[authorData[0].departmentId]}
                                    // showLine
                                    treeData={authorData.map(s => ({
                                        title: renderTreeGroupTitle(s),
                                        key: s.departmentId,
                                        children: s.posts.map(k => ({
                                            title: renderTreeTitle(k, s.departmentId),
                                            key: k.id + "-post",
                                        }))
                                    }))}
                                /> : ''
                        }
                    </div>
                </Col>
                <Col span={19}>
                    <div style={{
                        marginBottom: 8
                    }}>
                        <span>
                            {Func.judgeRights(AddMember,
                                <Button type='primary' style={{ marginRight: 16 }} onClick={() => handleMember(null)}>????????????</Button>)}
                            {memberModal}
                            {showDeleteAll ? <Button onClick={() => BatchDelModal({
                                selectedRowKeys, dispatch, authorData, user, done
                            })}>????????????</Button> : ''}
                        </span>
                        <span style={{ float: 'right' }}>
                            <Input.Search
                                placeholder="??????????????????"
                                style={{ width: 210 }}
                                value={searchKey}
                                onChange={e => { setSearchKey(e.target.value) }}
                                onSearch={value => { setSearchKey(value) }}
                            />
                        </span>
                    </div>
                    <Table
                        rowKey="id"
                        rowSelection={{
                            selectedRowKeys,
                            onChange: (selectedRowKeys) => {
                                setSelectedRowKeys(selectedRowKeys);
                            },
                            getCheckboxProps: (record) => ({
                                disabled: record.portal === 'A',
                            })
                        }}
                        columns={tableColumns()}
                        dataSource={renderDataSource()}
                    />
                </Col>
            </Row>
        </Spin>
    )
}

function mapStateToProps(state) {
    const { global, authorData, auth } = state;
    return {
        user: auth.user,
        clientHeight: global.clientHeight,
        isRequesting: authorData.isRequesting,
        authorData: authorData.data || [],
    };
}
export default connect(mapStateToProps)(Member)