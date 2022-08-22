export const DataServiceApiTable = {
  netdiskFiles: 'users/{userId}/netdisk-files',
  uploadFile: 'users/{userId}/netdisk-files/upload',
  deleteFile: 'netdisk-files/{fileId}',
  attachments: 'attachments',
  downloadHdfsFile: 'structures/{structureId}/{dataType}/data-file/download?path={path}',
  fileRename: 'netdisk-files/rename',
  getProjects: 'projects/userId/{userId}',
  getStaticFiles: 'static/pan/files',
  starFileDirectory: 'users/{userId}/file-types/{fileTypeId}/targets/{targetId}/star',
  unstarFileDirectory: 'users/{userId}/file-types/{fileTypeId}/targets/{targetId}/unstar',
  uploadManmadeData: 'man-madedata/upload',
  getHdfsDirStats: 'organizations/{organizationId}/data-file/stats?dataType={dataType}',
  getHdfsDir: 'structures/{structureId}/{dataType}/data-file/dir?path={path}',
  batchDownload: 'download/batch',
};

export const AggtimeDayOfWeek = {
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
  7: '周日',
};

export const AGGWEEKINDEX = {
  1: '第一个',
  2: '第二个',
  3: '第三个',
  4: '第四个',
  5: '最后一个',
};

export const Category = {
  2001: '日聚集',
  2002: '周聚集',
  2003: '月聚集',
  2005: '时聚集',
};
export const CategoryToNum = {
  日聚集: 2001,
  周聚集: 2002,
  月聚集: 2003,
  时聚集: 2005,
};

export const Algorithm = {
  3001: 'avg',
  3002: 'max',
  3003: 'min',
  3004: 'mid',
  3005: 'sum',
};
export const AlgorithmToMath = {
  avg: 3001,
  max: 3002,
  min: 3003,
  mid: 3004,
  sum: 3005,
};
export const AlgorithmToName = {
  3001: '平均值',
  3002: '最大值',
  3003: '最小值',
  3004: '中值',
  3005: '求和',
};
export const AlgorithmToNum = {
  平均值: 3001,
  最大值: 3002,
  最小值: 3003,
  中值: 3004,
  求和: 3005,
};

export const CATEGORYTOTHRESHOLD = {
  2001: '日变化速率',
  2002: '周变化速率',
  2003: '月变化速率',
  2005: '时变化速率',
};

export const ReportTypeToName = {
  0: '日报表',
  1: '周报表',
  2: '月报表',
  3: '年报表',
};
export const ReportTypeToNum = {
  日报表: 0,
  周报表: 1,
  月报表: 2,
  年报表: 3,
};
export const initData = (data, arr, exArr = null) => {
  // 赋值
  const keys = Object.keys(data);
  arr.map((item) => {
    if (exArr && exArr.includes(item.id) || !keys.includes(item.id)) {
      data[item.id] = item.value;
    }
  });
};
