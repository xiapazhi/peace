import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
    Spin, Popconfirm,
} from 'antd';
import ProTable from '@ant-design/pro-table';
import { LayoutContent } from '@peace/components';
import { Func } from '$utils';
import { PinyinHelper } from '@peace/utils';
import CheckItemsModal from '../components/check-item-modal';
import moment from 'moment';
function EventHanle(props) {
    const {
        dispatch,
        actions,
        loading,
        checkitems,
        clientHeight,
        user
    } = props;

    const [params, setParams] = useState({});
    const pageStyle = Func.getPaginationStyle();
    const handleDelete = (id) => {
        dispatch(actions.damCheck.deleteCheckItem(id)).then(() => {
            dispatch(actions.damCheck.getCheckItems());
        });
    };
    useEffect(() => {
        dispatch(actions.damCheck.getCheckItems());
    }, []);

    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            ellipsis: true,
            search: false,
        },
        {
            title: '检查项',
            // onFilter: true,
            dataIndex: 'name',
            ellipsis: true,
            search: false,
        },
        {
            title: '检查位置',
            onFilter: true,
            dataIndex: 'location',
            ellipsis: true,
        },
        {
            title: '时间',
            ellipsis: true,
            dataIndex: 'time',
            search: false,
            render: (text, record) => {
                return moment(record.time).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        {
            title: '操作人',
            ellipsis: true,
            dataIndex: 'operator',
            search: false,
        },
        {
            title: '操作',
            width: 160,
            key: 'option',
            valueType: 'option',
            render: (text, record) => {
                const options = [];

                options.push(
                    <CheckItemsModal
                        key="edit"
                        title="编辑"
                        triggerRender={<a>编辑</a>}
                        onFinish={onFinish}
                        editData={record}
                        checkitems={checkitems}
                    />,
                );

                options.push(
                    <CheckItemsModal
                        key="edit"
                        title="查看"
                        triggerRender={<a>查看</a>}
                        onFinish={onFinish}
                        editData={record}
                        checkitems={checkitems}
                        readOnly={true}
                    />,
                );

                options.push(
                    <Popconfirm
                        key="del"
                        placement="top"
                        title="是否确认删除该检查项？"
                        onConfirm={() => handleDelete(record.id)}
                        okText="是"
                        cancelText="否"
                    >
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a>删除</a>
                    </Popconfirm>,
                );
                return options;
            },
        },
    ];

    const onFinish = async (values, editData) => {
        const dataToSave = {
            ...values,
            operator: user?.displayName || '',
            time: moment()
        };
        if (editData) {
            return dispatch(
                actions.damCheck.modifyCheckItem(editData.id, dataToSave),
            ).then(() => {
                dispatch(actions.damCheck.getCheckItems());
            });
        }
        return dispatch(actions.damCheck.addCheckItem(dataToSave)).then(() => {
            dispatch(actions.damCheck.getCheckItems());
        });
    };

    const getDataSource = () => {
        const dataSource = checkitems;
        const { keyword } = params;
        const rslt = keyword
            ? dataSource.filter(
                (s) => s.name.indexOf(keyword) !== -1
                    || PinyinHelper.isPinyinMatched(s.name, keyword),
            )
            : dataSource;
        return rslt.sort((a, b) => b.id - a.id).map((s, index) => {
            s.index = index + 1
            return s
        });
    };

    const filterData = getDataSource();

    return (
        <LayoutContent perfectScroll={false}>
            <Spin spinning={loading}>
                <ProTable
                    columns={columns}
                    rowKey="id"
                    request={async (param) => {
                        setParams(param);
                        return {
                            data: [],
                            success: true,
                        };
                    }}
                    headerTitle={null}
                    dateFormatter="string"
                    search={false}
                    options={{
                        search: { placeholder: '输入检查项名称' },
                        reload: false,
                    }}
                    pagination={{ ...pageStyle, pageSizeOptions: [10, 20, 30] }}
                    scroll={{ y: Func.getContentHeight(clientHeight) - 199 }}
                    dataSource={filterData}
                    // eslint-disable-next-line react/no-unstable-nested-components
                    toolBarRender={() => (
                        <CheckItemsModal
                            allowAsProps
                            title="新增检查项"
                            onFinish={onFinish}
                            checkitems={checkitems}
                        />

                    )}
                />
            </Spin>
        </LayoutContent>
    );
}

function mapStateToProps(state) {
    const {
        auth, global, checkitems,
    } = state;
    return {
        loading: checkitems.isRequesting,
        user: auth.user,
        actions: global.actions,
        clientWidth: global.clientWidth,
        clientHeight: global.clientHeight,
        checkitems: checkitems.data || [],

    };
}

export default connect(mapStateToProps)(EventHanle);
