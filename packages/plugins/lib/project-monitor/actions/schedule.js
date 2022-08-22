import { ApiTable } from '$utils';
import { basicAction } from '@peace/utils';

function getScheduleExportList(userId, data) {
  return (dispatch) => basicAction({
    type: 'post',
    data,
    dispatch,
    actionType: 'SCHEDULE_EXPORT_LIST',
    url: ApiTable.getExportSchedules.replace('{userId}', userId),
    msg: {
      error: '获取日程导出信息失败',
    },
  });
}

function getScheduleMonthList(userId, projects, month) {
  return (dispatch) => basicAction({
    type: 'post',
    data: projects,
    dispatch,
    actionType: 'SCHEDULE_MONTH_LIST',
    url: ApiTable.getMonthsSchedules.replace('{userId}', userId).replace('{month}', month),
    msg: {
      error: '获取日程信息失败',
    },
    reducer: {
      name: 'scheduleMonthList',
    },
  });
}

function getScheduleYearList(userId, projects, year) {
  return (dispatch) => basicAction({
    type: 'post',
    data: projects,
    dispatch,
    actionType: 'SCHEDULE_YEAR_LIST',
    url: ApiTable.getYearsSchedules.replace('{userId}', userId).replace('{year}', year),
    msg: {
      error: '获取日程月统计信息失败',
    },
    reducer: {
      name: 'scheduleYearList',
    },
  });
}

function addSchedule(userId, schedule) {
  return (dispatch) => basicAction({
    type: 'post',
    data: schedule,
    dispatch,
    actionType: 'ADD_SCHEDULE',
    url: ApiTable.addSchedule.replace('{userId}', userId),
    msg: {
      option: '添加日程',
    },
  });
}

function editSchedule(scheduleId, scheduleInfo) {
  return (dispatch) => basicAction({
    type: 'put',
    data: scheduleInfo,
    dispatch,
    actionType: 'UPDATE_SCHEDULE',
    url: ApiTable.editSchedule.replace('{scheduleId}', scheduleId),
    msg: {
      option: '修改日程',
    },
  });
}

function deleteSchedule(scheduleId) {
  return (dispatch) => basicAction({
    type: 'del',
    dispatch,
    actionType: 'DELETE_SCHEDULE',
    url: ApiTable.deleteSchedule.replace('{scheduleId}', scheduleId),
    msg: {
      option: '删除日程',
    },
  });
}

export {
  getScheduleExportList,
  getScheduleMonthList,
  getScheduleYearList,
  addSchedule,
  editSchedule,
  deleteSchedule,
};
