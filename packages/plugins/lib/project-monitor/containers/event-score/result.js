import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { LayoutContent } from '@peace/components';
import { Tabs, message } from 'antd';
import Latest from '../../components/event-score/result/latest';
import History from '../../components/event-score/result/history';
import {
  getEventScoreLatest,
  getEventScoreHistory,
  getRainfallYearly,
  addRainfallYearly, RainfallYearlyAddTypes,
} from '../../actions/event-score/result';
import { getStructsList } from '../../actions/integrationInfo';

const { TabPane } = Tabs;

class EventScoreResultContainer extends Component {
  constructor(props) {
    super(props);
    this.structure = null;
  }

  componentDidMount() {
    const { dispatch, orgId } = this.props;
    dispatch(getStructsList(orgId));
  }

  redirect = (key) => {
    const { dispatch, location, match } = this.props;
    const { pathname, query } = location;
    console.log(query, key, match);
    dispatch(push({ pathname, state: { t: key } }));
  };

  handleChange = (key) => {
    this.redirect(key);
  };

  fetchEventScoreHistory = (structureId, timerange) => {
    const { start, end } = timerange;
    if (structureId && start && end) {
      this.props.dispatch(getEventScoreHistory(structureId, start, end));
    }
  };

  handleTabsChange = (tabkey, params) => {
    if (tabkey == 'latest') {
      const { structures } = params;
      structures.length = 2;
      if (structures && structures.length) this.props.dispatch(getEventScoreLatest(structures));
    }
    if (tabkey == 'history') {
      const { structureId, timerange } = params;
      this.fetchEventScoreHistory(structureId, timerange);
    }
  };

  handleStructureSelect = (structureId) => {
    this.structure = structureId;
    this.props.dispatch(getRainfallYearly(structureId));
  };

  handleSave = (dataToSave) => {
    const { dispatch } = this.props;
    const id = this.structure;
    dispatch(addRainfallYearly(id, dataToSave)).then((action) => {
      const { type, payload } = action;
      if (type === RainfallYearlyAddTypes.RequestSuccess) {
        // message.success(payload.data);
        dispatch(getRainfallYearly(id));
      }
      // else if (type === RainfallYearlyAddTypes.RequestError) {
      //     message.error(payload.error);
      // }
    });
  };

  render() {
    const {
      location, structList, eventScoreLatest, eventScoreHistory, rainfallYearly,
    } = this.props;

    return (
      <LayoutContent hasTabs>
        <Tabs defaultActiveKey={location.state && location.state.t || 'latest'} onChange={this.handleChange}>
          <TabPane tab="最新评分" key="latest" className="fs-page-subcontent">
            <Latest
              tabkey={location.state && location.state.t}
              structList={structList}
              scores={eventScoreLatest}
              rainfallYearly={rainfallYearly}
              onTabsChange={this.handleTabsChange}
              onStructureSelect={this.handleStructureSelect}
              onSave={this.handleSave}
            />
          </TabPane>
          <TabPane tab="历史评分" key="history" className="fs-page-subcontent">
            <History
              tabkey={location.state && location.state.t}
              structList={structList}
              scores={eventScoreHistory}
              onTabsChange={this.handleTabsChange}
              onSearchHistory={this.fetchEventScoreHistory}
            />
          </TabPane>
        </Tabs>
      </LayoutContent>

    );
  }
}

function mapStateToProps(state) {
  const {
    auth, structList, eventScoreLatest, eventScoreHistory, rainfallYearly,
  } = state;
  return {
    orgId: auth.user.orgId,
    structList: structList.data,
    eventScoreLatest: eventScoreLatest.data,
    eventScoreHistory: eventScoreHistory.data,
    rainfallYearly: rainfallYearly.data,
  };
}

export default connect(mapStateToProps)(EventScoreResultContainer);
