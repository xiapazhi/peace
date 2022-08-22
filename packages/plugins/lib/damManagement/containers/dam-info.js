import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import { LayoutContent } from '@peace/components';
import ProTable from '@ant-design/pro-table';
import { push } from 'react-router-redux';
import InfoModal from '../components/infoModal';
import { modifyBridgeInfo } from '../actions/info';
import moment from 'moment';
import { Func, AuthorizationCode } from '$utils';
import { PinyinHelper, Func as peaceFunc } from '@peace/utils';

const BridgeInfo = ({ ...props }) => {
    const { dispatch, actions, user, loading, bridgeList, constants, clientHeight } = props;
    const [params, setParams] = useState({});
    const [bridgeStructTypes, setBridgeStructTypes] = useState('');
    const pageStyle = Func.getPaginationStyle();
    useEffect(() => {
        dispatch(actions.bridge.getConstants());
        dispatch(actions.bridge.getStructTypes()).then(res => {
            if (res.success) {
                const data = res?.payload?.data || [];
                const parentBridge = data.find(v => v.name === '大坝');
                if (parentBridge) {
                    const chrldren = data.filter(f => f.parentTypeId == parentBridge.id).map(v => v.id);
                    const structureTypes = [].concat([parentBridge.id], chrldren).toString();
                    setBridgeStructTypes(structureTypes);
                    dispatch(actions.bridge.getBridgeList(user?.orgId, { structureTypes }));
                }

            }
        })

    }, []);


    const columns = [{
        title: '项目名称',
        dataIndex: 'name',
        ellipsis: true

    }, {
        title: '水库类型',
        dataIndex: 'reservoirType',
        ellipsis: true
    }, {
        title: '坝型',
        search: false,
        dataIndex: 'damType',
        ellipsis: true
    },
    {
        title: '水库编码',
        search: false,
        dataIndex: 'number',
        ellipsis: true
    },
    {
        title: '水库状态',
        search: false,
        dataIndex: 'reservoirState',
        ellipsis: true
    },
    {
        title: '操作',
        key: 'operation',
        valueType: 'option',
        width: '20%',
        render: (text, record) => {
            let actions = [];
            actions.push(<a
                onClick={() => { dispatch(push({ pathname: `/dam/info/${record.id}` })) }}
            >查看</a>);
            bridgeList.find(s => s.id == record?.id) && actions.push(<InfoModal
                title={`项目信息维护 - ${record.name}`}
                text='修改'
                editData={record}
                onRefresh={refresh}
                bridges={bridgeList}
                constants={constants}
                onFinish={onFinish}
                addStruct={bridgeList.find(s => s.id == record.id)}
            />);
            return actions;
        }
    }];

    const refresh = () => {
        dispatch(actions.bridge.getBridgeList(user?.orgId, { structureTypes: bridgeStructTypes }));

    }
    const onFinish = async (values, editData, next) => {

        return dispatch(modifyBridgeInfo(editData?.id, values))

    }


    const getDataSource = () => {
        const dataSource = bridgeList.map(v => {
            return {
                id: v.id,
                name: v.name,
                reservoirType: v?.extraInfo?.reservoirType || null,
                damType: v?.extraInfo?.damType || null,
                number: v?.extraInfo?.number || null,
                reservoirState: v?.extraInfo?.reservoirState || null,
                extraInfo: v.extraInfo
            }
        })
        const { name, type, } = params;
        let rslt = dataSource.filter(s => {
            return (name ? s.name ? (s.name.indexOf(name) != -1 || PinyinHelper.isPinyinMatched(s.name, name)) : false : true)
                && (type ? s.type ? (s.type.indexOf(type) != -1 || PinyinHelper.isPinyinMatched(s.type, type)) : false : true)
        });
        return rslt
    }

    return (
        <LayoutContent>
            <Spin spinning={loading}>

                <ProTable
                    columns={columns}
                    rowKey="id"
                    request={async (params) => {
                        setParams(params)
                        return {
                            data: [],
                            success: true,
                        };
                    }}
                    pagination={{ ...pageStyle }}
                    options={{
                        search: false,
                        reload: false
                    }}
                    scroll={{ y: Func.getContentHeight(clientHeight) - 299 }}
                    dateFormatter="string"
                    headerTitle={'项目列表'}
                    dataSource={getDataSource()}
                />
            </Spin>
        </LayoutContent>
    )
}

function mapStateToProps(state) {

    const { auth, global, bridgeList, constantList } = state;
    return {
        loading: bridgeList.isRequesting || constantList.isRequesting,
        user: auth.user,
        actions: global.actions,
        clientWidth: global.clientWidth,
        clientHeight: global.clientHeight,
        bridgeList: bridgeList.data || [],
        constants: constantList.data || []
    };
}

export default connect(mapStateToProps)(BridgeInfo);
