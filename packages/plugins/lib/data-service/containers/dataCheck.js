import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Spin, Select, Tree } from 'antd';
import { LayoutContent } from '@peace/components';
import ProCard from '@ant-design/pro-card'
import HistoryDataContainer from './data-check/index'
import PerfectScrollbar from 'perfect-scrollbar';
import { Func } from '@peace/utils';
let scrollbar;
const FactorMonitor = ({ ...props }) => {
    const { dispatch, actions, user, loading, myStructList, clientHeight, myStationList, location } = props;
    let structId = location.state?.structId ? location.state?.structId : null
    const [selectStructure, setSelectStructure] = useState(structId)
    const [factorId, setFactorId] = useState(null)
    const [factorProto, setFactorProto] = useState(null)
    const contentHeight = clientHeight - 56 - 48;

    useEffect(() => {
        dispatch(actions.dataMonitor.getMyStructList(user?.orgId));
        scrollbar = new PerfectScrollbar('#monitor-content', { suppressScrollX: true });
        new PerfectScrollbar('#monitor-side', { suppressScrollX: true });
    }, []);

    useEffect(() => {
        const dom = document.getElementById('monitor-content');
        if (dom && scrollbar) {
            scrollbar.update();
            dom.scrollTop = 0;
        }
    }, [factorId])


    useEffect(() => {
        if (myStationList?.length > 0) {
            setFactorId(myStationList[0].factorId)
            setFactorProto(myStationList[0].factorProto)
        }
    }, [myStationList])


    const sturctureChange = (value) => {
        setSelectStructure(value)
        dispatch(actions.dataMonitor.getStations(value));
    }

    useEffect(() => {
        if (myStructList?.length > 0) {
            if (!selectStructure) {
                setSelectStructure(myStructList[0]?.id)
            }
        }

    }, [myStructList])

    useEffect(() => {
        if (selectStructure) dispatch(actions.dataMonitor.getStations(selectStructure));
    }, [selectStructure])

    const getTreeData = () => {
        let children = []
        myStationList ? myStationList.length > 0 ? myStationList.map((s, index) => {
            children.push({
                title: s.factorName,
                key: `${s.factorId}`,
                isLeaf: true,
            })
        }) : '' : ''
        let treeData = children;
        return treeData
    }

    const onSelect = (value) => {
        if (value.length > 0) {
            setFactorId(value)
            let proto = myStationList.find(s => s.factorId == value)?.factorProto
            setFactorProto(proto)
        }
    }

    return (
        <LayoutContent perfectScroll={false}>
            <Spin spinning={loading}>
                <ProCard split="vertical">
                    <ProCard colSpan="20%">
                        <div id='monitor-side' style={{ height: contentHeight - 48, position: 'relative' }}>
                            <Select
                                placeholder="选择结构物"
                                style={{ width: '95%', marginBottom: 24 }}
                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                value={selectStructure}
                                onChange={sturctureChange}
                                optionFilterProp="children"
                                showSearch
                                filterOption={Func.selectFilterOption}
                            >
                                {myStructList.map(v => <Select.Option key={v.id} value={v.id}>{v.name}</Select.Option>)}
                            </Select>
                            {
                                myStructList.length > 0 ?
                                    <Tree
                                        defaultExpandAll
                                        selectedKeys={[`${factorId}`]}
                                        treeData={getTreeData()}
                                        onSelect={onSelect}
                                    /> : ''
                            }
                        </div>
                    </ProCard>
                    <div id='monitor-content' style={{ height: contentHeight, position: 'relative', width: '80%' }}>
                        <ProCard colSpan="80%">
                            <HistoryDataContainer
                                myStationList={myStationList}
                                factorId={factorId}
                                factorProto={factorProto}
                                structId={selectStructure}
                            />
                        </ProCard>
                    </div>
                </ProCard>
            </Spin>
        </LayoutContent>
    )
}

function mapStateToProps(state) {

    const { auth, global, myStructList, deviceMeta, deviceList, myStationList, facotrList } = state;
    return {
        loading: myStructList.isRequesting || myStationList.isRequesting,
        user: auth.user,
        actions: global.actions,
        clientWidth: global.clientWidth,
        clientHeight: global.clientHeight,
        myStructList: myStructList.data || [],
        myStationList: myStationList.data || []
    };
}


export default connect(mapStateToProps)(FactorMonitor);
