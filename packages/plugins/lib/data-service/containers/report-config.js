import React, { Component } from 'react';
import { connect } from 'react-redux';
import { message, Spin } from 'antd';
import { LayoutContent } from '@peace/components';
import {
  getReportFactors, getReportConfig, getReportTemplate, reportGenerate, postReportConfig, putReportConfig, delReportConfig,
} from '../actions/reportConfig';
import { getStructures } from '../actions/common';
import ReportConfigCard from '../components/reportConfig/report';

class ReportConfig extends Component {
  constructor(props) {
    super(props);
    this.state = { filterType: 'all' };
  }

  componentDidMount() {
    const { dispatch, user } = this.props;
    dispatch(getStructures(user.orgId)).then((action) => {
      if (action.payload.data.length > 0) {
        const { id } = action.payload.data[0];
        const { type } = action.payload.data[0];
        this.setState({ structId: id });
        dispatch(getReportFactors(id))
          .then(() => this.getReportConfig(id));
        dispatch(getReportTemplate(type));
      } else {
        return Promise.resolve();
      }
    });
  }

  getReportConfig(structNum) {
    const { dispatch } = this.props;
    dispatch(getReportConfig(structNum || this.state.structId));
  }

  handleSave = (isEdit, dataToSave, id) => {
    const { dispatch } = this.props;
    const { structId } = this.state;
    if (isEdit) {
      return dispatch(putReportConfig(id, dataToSave, structId)).then((action) => {
        const { success, error } = action;
        if (success) {
          this.getReportConfig();
        } else {
          message.error(error);
        }
        return action;
      });
    }
    return dispatch(postReportConfig(structId, dataToSave)).then((action) => {
      const { success, error } = action;
      if (success) {
        this.getReportConfig();
      } else {
        message.error(error);
      }
      return action;
    });
  };

  handleClickDelete = (id) => {
    const { dispatch } = this.props;
    dispatch(delReportConfig(id)).then((action) => {
      const { success, error } = action;
      if (success) {
        this.getReportConfig();
      } else {
        message.error(error);
      }
    });
  };

  handleGenerateOk = (isEdit, dataToSave, id) =>
  // isEdit,id无用，但需保留
    this.props.dispatch(reportGenerate(dataToSave));

  hanldeStructChange = (value) => { // 结构物改变
    const { dispatch } = this.props;
    if (typeof value !== 'string') {
      this.setState({ structId: value });
      dispatch(getReportFactors(value))
        .then(() => dispatch(getReportConfig(value)));
    }
  };

  handleTypeFilter = (e) => {
    this.setState({ filterType: e.target.value });
  };

  render() {
    const {
      isRequesting, factors, reportConfig, reportTemplate, structures,
    } = this.props;
    const { filterType, structId } = this.state;
    const config = reportConfig && reportConfig.filter((c) => c.reportType == filterType || filterType == 'all');
    return (
      <LayoutContent>
        <Spin spinning={isRequesting}>
          <ReportConfigCard
            reportConfig={config}
            structId={structId}
            structures={structures}
            filterType={filterType}
            reportTemplate={reportTemplate}
            factors={factors && factors.length && factors.filter((f) => f.checked).map((f) => ({
              key: f.id, name: f.name, proto: f.proto, items: f.items,
            })) || []}
            onDelete={this.handleClickDelete}
            onSave={this.handleSave}
            onGenerateOkClick={this.handleGenerateOk}
            onStructClick={this.hanldeStructChange}
            onTypeFilter={this.handleTypeFilter}
          />
        </Spin>
      </LayoutContent>

    );
  }
}

function mapStateToProps(state) {
  const {
    reportFactors, reportConfig, reportTemplate, auth, thresholdStructures,
  } = state;

  return {
    user: auth.user,
    isRequesting: thresholdStructures.isRequesting || reportConfig.isRequesting || reportFactors.isRequesting || reportTemplate.isRequesting,
    factors: reportFactors.data,
    reportConfig: reportConfig.data,
    reportTemplate: reportTemplate.data,
    structures: thresholdStructures.data,
  };
}

export default connect(mapStateToProps)(ReportConfig);
