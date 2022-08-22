import { basicAction } from '@peace/utils';
import { ApiTable } from '$utils';

export const FactorsGetTypes = 'GET_THRESHOLD_FACTORS';
export const StructuresGetTypes = 'GET_THRESHOLD_STRUCTURE';
export const ThesholdStationsGetType = 'GET_THRESHOLD_STATIONS';

export function getFactors(structId) {
  return (dispatch) => basicAction({
    type: 'get',
    dispatch,
    actionType: FactorsGetTypes,
    url: ApiTable.getStructFactorList.replace('{structureId}', structId),
    msg: {
      option: '查询监测因素信息',
    },
    reducer: {
      name: 'thresholdFactorList',
    },
  });
}

export function getStructures(orgId) {
  return (dispatch) => basicAction({
    type: 'get',
    dispatch,
    actionType: StructuresGetTypes,
    url: ApiTable.getStructsList.replace('{organizationId}', orgId),
    msg: {
      option: '查询结构物信息',
    },
    reducer: {
      name: 'thresholdStructures',
    },
  });
}

export function getStations(structId, factorId) {
  return (dispatch) => basicAction({
    type: 'get',
    dispatch,
    actionType: ThesholdStationsGetType,
    url: `${ApiTable.getStations.replace('{structureId}', structId)}?factorId=${factorId}`,
    msg: {
      option: '查询测点',
    },
    reducer: {
      name: 'thresholdStationList',
    },
    callback: (res) => (res.length > 0
      ? res[0].groups.reduce((p, n) => {
        n.stations.forEach((s) => {
          p.push({ id: s.id, name: s.name });
        });
        return p;
      }, [])
      : []),
  });
}

export default {
  getFactors,
  getStructures,
  getStations,
};
