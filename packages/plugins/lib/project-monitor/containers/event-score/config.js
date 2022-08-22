import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LayoutContent } from '@peace/components';
import EventScoreConfig from '../../components/event-score/config';
import {
  getEventScoreWeight,
  setEventScoreWeight, EventScoreWeightSetTypes,
  delEventScoreWeight, EventScoreWeightDelTypes,
} from '../../actions/event-score/config';
import { getStructsList } from '../../actions/integrationInfo';

class EventScoreConfigContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, orgId } = this.props;
    dispatch(getStructsList(orgId)).then((res) => {
      const { payload } = res;
      const structList = payload.data;
      if (structList && structList.length) {
        dispatch(getEventScoreWeight(structList[0].id));
      }
    });
  }

  actionHandler = (action) => {
    const { dispatch } = this.props;
    const { actionCreator, actionTypes, id } = action;
    dispatch(actionCreator).then((action) => {
      const { type, payload } = action;
      if (type === actionTypes.RequestSuccess) {
        // message.success(payload.data);
        dispatch(getEventScoreWeight(id));
      }
    });
  };

  handleStructureChange = (structureId) => {
    this.props.dispatch(getEventScoreWeight(structureId));
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { dispatch, structList } = nextProps;
    if (this.props.structList == null && structList && structList.length) {
      dispatch(getEventScoreWeight(structList[0].id));
    }
  }

  render() {
    const { structList, eventScoreWeight } = this.props;
    return (
      <LayoutContent>
        <EventScoreConfig
          structList={structList}
          metricsWeight={eventScoreWeight}
          onStructureChange={this.handleStructureChange}
          onSaveWeight={(id, dataToSave) => this.actionHandler({
            actionCreator: setEventScoreWeight(id, dataToSave),
            actionTypes: EventScoreWeightSetTypes,
            id,
          })}
          onDeleteWeight={(id) => this.actionHandler({
            actionCreator: delEventScoreWeight(id),
            actionTypes: EventScoreWeightDelTypes,
            id,
          })}
        />
      </LayoutContent>

    );
  }
}

function mapStateToProps(state) {
  const { auth, structList, eventScoreWeight } = state;
  return {
    orgId: auth.user.orgId,
    structList: structList.data,
    eventScoreWeight: eventScoreWeight.data,
  };
}

export default connect(mapStateToProps)(EventScoreConfigContainer);
