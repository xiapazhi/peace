import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Spin, Button, Alert, Row, Col, Modal, Result, message, Cascader,
} from 'antd';
import { Func } from '$utils';
import { PinyinHelper } from '@peace/utils';
import moment from 'moment';
import ThreeSection from './three-section';
import ThreeHeatMap from './heat-map';
import ErrorBoundary from './error';
import styleBox from './style.css';

class ThreeRender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changedCameraInfo: '',
      isShow3D: 'none',
      containerHeight: Func.getContentHeight(props.clientHeight) - 46,
      containerWidth: window.innerWidth - 298,
      handleSectionChange: false,
      uploadVisible: false,
      showPreview: false,
      previewImgPath: '',
      selectedStation: null,
    };
  }

  _finishCameraChange = () => {
    this.setState({ handleSectionChange: false });
  };

  _onSectionClick = (section) => {
    this.setState({ handleSectionChange: true, changedCameraInfo: section.camera });
  };

  _onWindowResize = () => {
    const { clientHeight } = this.props;
    this.setState({
      containerHeight: Func.getContentHeight(clientHeight) - 46,
      containerWidth: window.innerWidth - 298,
    });
  };

  onCloseHtml = () => {
    this.setState({ selectedStation: null });
  };

  _renderHeatmap = () => {
    const { heatMap } = this.props;

    const {
      handleSectionChange, changedCameraInfo, containerHeight, containerWidth, selectedStation,
    } = this.state;
    if (!heatMap) return null;
    if (!heatMap.portrait) {
      return (
        <Row style={{ marginTop: '200px' }}>
          <Col span="8" />
          <Col span="8" style={{ textAlign: 'center' }}><h3>未配置三维热点图，不提供热点拓扑功能</h3></Col>
          <Col span="8" />
        </Row>
      );
    }

    return (
      <ThreeHeatMap
        selectedStation={selectedStation}
        heatMap={heatMap}
        width={containerWidth}
        height={containerHeight}
        changedCameraInfo={changedCameraInfo}
        handleSectionChange={handleSectionChange}
        endCameraChange={this._finishCameraChange}
        onCloseHtml={this.onCloseHtml}
      />
    );
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this._onWindowResize);
  }

  componentDidMount() {
    window.addEventListener('resize', this._onWindowResize);
  }

  onStationChange = (value, selectedOptions) => {
    const { heatMap, dispatch, actions } = this.props;
    const hotSpotMap = Array.isArray(heatMap.hotspots) ? heatMap.hotspots : [];
    const hotSpot = hotSpotMap.find((f) => f?.station?.id === selectedOptions[1].id);
    dispatch(actions.singleProjectOverview.getLastStationData(selectedOptions[1].id)).then((res) => {
      const stationData = res.payload.data;
      let lastData = [];
      if (stationData?.items) {
        lastData = Object.keys(stationData?.items).map((v) => ({
          ...stationData?.items[v],
          value: stationData?.stations[0]?.data[0] ? stationData?.stations[0]?.data[0][v] : '暂无',
          time: moment(stationData?.stations[0]?.data[0]?.time).format('YYYY-MM-DD HH:mm:ss'),
        }));
      }
      this.setState({ selectedStation: { ...selectedOptions[1], hotSpot, lastData } });
    });
  };

  getOptions = () => {
    const { threeStaionsList, heatMap } = this.props;
    const stationIds = Array.isArray(heatMap.hotspots) ? heatMap.hotspots.map((v) => v?.station?.id) : [];
    const options = [];
    if (stationIds.length > 0) {
      threeStaionsList.forEach((item) => {
        const groupStations = item?.groups?.reduce((p, c) => {
          p = p.concat(c.stations);
          return p;
        }, []);
        const filterStations = groupStations.filter((f) => stationIds.includes(f.id)).map((v) => ({
          ...v, value: v.id, label: v.name,
        }));
        if (filterStations.length > 0) {
          options.push({
            value: item.factorId,
            label: item.factorName,
            factorId: item.factorId,
            factorName: item.factorName,
            factorProto: item.factorProto,
            children: filterStations,
          });
        }
      });
    }
    return options;
  };

  errorRender = () => (
    <div style={{ marginTop: 16, height: 400 }}>
      <div style={{ marginTop: 16, height: '100%' }}>
        <Result
          status="warning"
          title="无法加载该模型"
        />
      </div>
    </div>
  );

  render() {
    const {
      heatMap, sectionItems, user,
    } = this.props;
    const {
      containerWidth, containerHeight,
    } = this.state;

    return (
      <div style={{ position: 'relative', height: containerHeight }}>
        <div className={styleBox.select_station_box}>
          <Cascader
            style={{ width: 200 }}
            options={this.getOptions()}
            onChange={this.onStationChange}
            placeholder="选择布点"
            showSearch={(inputValue, path) => path.some(
              (option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1 || PinyinHelper.isPinyinMatched(option.label, inputValue),
            )}
          />

        </div>

        {heatMap && heatMap.portrait
          ? (
            <div className={styleBox.section_box}>
              <ThreeSection
                threeSection={this.props.sectionItems}
                onSectionClick={this._onSectionClick}
              />
            </div>
          )
          : null}

        <ErrorBoundary errorRender={this.errorRender()}>
          {this._renderHeatmap()}
        </ErrorBoundary>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { global } = state;
  return {
    clientHeight: global.clientHeight,
    clientWidth: global.clientWidth,
    actions: global.actions,
  };
}

export default connect(mapStateToProps)(ThreeRender);
