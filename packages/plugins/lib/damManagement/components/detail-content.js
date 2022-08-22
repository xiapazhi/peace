import React from 'react';
import { connect } from 'react-redux';
import { Spin, Row, Col, } from 'antd';
import { downloadFile } from '../../data-service/actions/dataFiles';

const ProductIntroduction = (props) => {
    const { loading, structureInfo, tab, tabs } = props

    const basicInfoList = {
        "1": [
            {
                name: '水库名称',
                value: structureInfo.name
            },
            {
                name: '主要功能',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.function : ''
            },
            {
                name: '水库类型',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.damType : ''
            },
            {
                name: '经度',
                value: structureInfo.longitude ? structureInfo.longitude : ''
            },
            {
                name: '纬度',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.latitude : ''
            },
            {
                name: '所在溪水',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.stream : ''
            },
            {
                name: '所在水系',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.riverSystem : ''
            },
            {
                name: '所在江河',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.rivers : ''
            },
            {
                name: '管理单位',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.unit : ''
            },
            {
                name: '水库地址',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.address : ''
            },
            {
                name: '开工时间',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.workStart : ''
            },
            {
                name: '完工时间',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.workEnd : ''
            },
            {
                name: '水库简介',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.description : ''
            },
        ],
        "2": [
            {
                name: '死水位',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.ssw : ''
            },
            {
                name: '防洪限制水位',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.fhxzsw : ''
            },
            {
                name: '设计洪水位',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.designFloodLevel : ''
            },
            {
                name: '校核洪水位',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.jhhsw : ''
            },
            {
                name: '死库容',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.slr : ''
            },
            {
                name: '正常蓄水位库容',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.zcxsw : ''
            },
            {
                name: '库容系数',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.krxs : ''
            },
            {
                name: '所在江河',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.rivers : ''
            },
            {
                name: '汛期开始',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.xqStart : ''
            },
            {
                name: '汛期结束',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.xqEnd : ''
            },
        ],
        "3": [
            {
                name: '坝型',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.damType : ''
            },
            {
                name: '坝长',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.reservoirLength : ''
            },
            {
                name: '坝高',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.damHeight : ''
            },
            {
                name: '坝宽',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.damWidth : ''
            },
            {
                name: '坝底最大宽度',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.damMaxWidth : ''
            },
            {
                name: '坝顶高程',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.damAltitude : ''
            },
        ],
        "4": [
            {
                name: '溢洪道类型',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.spillwayType : ''
            },
            {
                name: '溢流方式',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.OverflowMode : ''
            },
            {
                name: '溢洪道总长',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.spillwayLength : ''
            },
            {
                name: '堰顶高程',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.WeirCrestElevation : ''
            },
            {
                name: '渠底高程',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.qdgc : ''
            }
        ],
        "5": [
            {
                name: '年均农业灌溉量(万m³)',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.njnyggl : ''
            },
            {
                name: '农村人口饮供水量(万m³)',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.countrysideWater : ''
            },
            {
                name: '灌溉农田面积',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.ggntArea : ''
            },
            {
                name: '年平均总供水量',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.yearAvgWater : ''
            },
            {
                name: '下泄生态流量',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.xxstll : ''
            }
        ],
        "6": [
            {
                name: '所属机构',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.mechanism : ''
            },
            {
                name: '姓名',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.dutyName : ''
            },
            {
                name: '职务',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.dutyPost : ''
            },
            {
                name: '电话',
                value: structureInfo.extraInfo ? structureInfo.extraInfo?.dutyPhone : ''
            }
        ],

    }
    const renderTitle = () => {
        return <div className='title'>{tabs[parseInt(tab) - 1]}</div>
    }

    const renderDownload = (link, name) => {
        return <a onClick={() => {
            window.open(downloadFile(encodeURIComponent(link), encodeURIComponent(name)))
        }} >下载</a>
    }
    const renderTab7 = () => {
        const yjya = [
            { name: '预案名称', value: structureInfo.extraInfo?.aqglya && structureInfo.extraInfo?.aqglya[0] ? structureInfo.extraInfo?.aqglya[0].name : '无' },
            {
                name: '操作', value: structureInfo.extraInfo?.aqglya && structureInfo.extraInfo?.aqglya[0] ?
                    renderDownload(structureInfo.extraInfo?.aqglya[0].storageUrl, structureInfo.extraInfo?.aqglya[0].name) : ''
            }]

        const ddfa = [
            { name: '调度方案', value: structureInfo.extraInfo?.ddyyfa && structureInfo.extraInfo?.ddyyfa[0] ? structureInfo.extraInfo?.ddyyfa[0].name : '无' },
            {
                name: '操作', value: structureInfo.extraInfo?.ddyyfa && structureInfo.extraInfo?.ddyyfa[0] ?
                    renderDownload(structureInfo.extraInfo?.ddyyfa[0].storageUrl, structureInfo.extraInfo?.ddyyfa[0].name) : ''
            }]
        return <>
            <div className='title'>应急预案</div>
            {yjya.map(v => <Col className="cell" span={24}> <Row>
                <Col className="cellName" span={8}><div>{v.name}：</div></Col>
                <Col className="cellValue" span={16}><div className="text---">
                    {v.value}
                </div></Col>
            </Row></Col>)}

            <div className='title'>调度方案</div>
            {ddfa.map(v => <Col className="cell" span={24}> <Row>
                <Col className="cellName" span={8}><div>{v.name}：</div></Col>
                <Col className="cellValue" span={16}><div className="text---">
                    {v.value}
                </div></Col>
            </Row> </Col>)}
        </>
    }

    return (
        <div className="content">
            <Spin spinning={loading}>
                <div className="contentBody">
                    <Row>
                        <Col span={24} style={{ paddingLeft: 30 }}>
                            <Row className="infoDesc">
                                {tab != '1' && tab != '7' ? renderTitle() : null}
                                {basicInfoList[tab]?.map((v, index) => {
                                    return (
                                        <Col className="cell" key={index} span={24}>
                                            <Row>
                                                <Col className="cellName" span={8}><div>{v.name}：</div></Col>
                                                <Col className="cellValue" span={16}><div className="text---">
                                                    {v.value}
                                                </div></Col>
                                            </Row>
                                        </Col>
                                    )
                                })}
                                {tab == '7' ? renderTab7() : ''}
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Spin>

        </div>
    )
}

function mapStateToProps(state) {
    const { global, auth, structure, structuresList } = state;

    return {
        loading: structure.isRequesting || structuresList.isRequesting,
        user: auth.user,
        actions: global.actions,
        structureInfo: structure.data || {},
        clientWidth: global.clientWidth,
    };
}

export default connect(mapStateToProps)(ProductIntroduction);
