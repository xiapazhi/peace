/**
 * Created by Xumeng 2020/04/22.
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col, Space, Button, message, notification, Form, Input, Tooltip, Menu, Dropdown,
} from 'antd';
import moment from 'moment';
import XLSX from 'xlsx';
import { fromJS } from 'immutable';
import { Request } from '@peace/utils';
import FileSaver from 'file-saver';
import './index.less';

// 通用前端导入导出组件  使用方法查看底部propTypes
function ExportAndImport(props) {
  const [form] = Form.useForm();
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const {
    importDataCallback, onImportSucess, handelData, importMethod = 'post',
  } = props;

  useEffect(() => () => {
    // 只有unmount 时调用
    notification.close('import-notification');
  });
  const importExcel = (file, type) => {
    setImportLoading(true);
    // 获取上传的文件对象
    const { files } = file.target;
    // 判断xls、xlsx格式
    if (files[0].type.indexOf('sheet') > -1 || files[0].type.indexOf('ms-excel') > -1) {
      // 通过FileReader对象读取文件
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        try {
          const { importRequest = true, importUrl, importQuery } = props;
          if (importRequest && !importUrl) {
            message.error('获取导入接口失败！');
            form.resetFields();
            return;
          }
          const { result } = event.target;
          // 以二进制流方式读取得到整份excel表格对象
          const workbook = XLSX.read(result, { type: 'binary', cellDates: true });
          let data = []; // 存储获取到的数据
          // 遍历每张工作表进行读取（这里默认只读取第一张表）
          for (const sheet in workbook.Sheets) {
            if (workbook.Sheets.hasOwnProperty(sheet)) {
              // 利用 sheet_to_json 方法将 excel 转成 json 数据
              data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
              break; // 如果只取第一张表，就取消注释这行
            }
          }
          if (data.length > 10000) {
            message.error('一次最多导入10000条数据，请分批导入！');
            form.resetFields();
            setImportLoading(false);
            return;
          }
          if (importRequest) {
            message.success('获取文件数据成功，开始处理导入...');
            const importData = handelData ? handelData(data) : data;
            Request[importMethod](importUrl, { data: importData }, importQuery || {}).then((res) => {
              message.success('导入数据成功');
              form.resetFields();
              notification.close('import-notification');
              setImportLoading(false);
              onImportSucess && onImportSucess();
            }, (err) => {
              if (err.status === 500) {
                message.error('数据导入出错,导入失败');
              } else if (err.status === 400) {
                message.error(err.body.message || '数据验证出错,请检查数据格式是否正确');
              } else {
                message.error('导入失败');
              }
              form.resetFields();
              setImportLoading(false);
            });
          } else {
            form.resetFields();
            setImportLoading(false);
            importDataCallback && importDataCallback(data, type);
            notification.close('import-notification');
          }
        } catch (e) {
          console.log(e);
          // 这里可以抛出文件类型错误不正确的相关提示
          message.error('文件格式不正确！');
          setImportLoading(false);
          form.resetFields();
        }
      };
      // fileReader.onloadend = (event) => {
      //     console.log(event)
      // }
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(files[0]);
    } else {
      message.error('文件格式不正确！');
      form.resetFields();
      setImportLoading(false);
    }
  };

  const loop = (data, keypath, values) => { // deal with array
    const dkey = keypath.slice(0, 1)[0];
    console.log(dkey);
    if (dkey) {
      const dvalue = data[dkey];
      const otherKeypath = keypath.slice(1);
      if (Array.isArray(dvalue)) {
        if (otherKeypath.length) {
          const immutableData = fromJS(data);
          for (let index = 0; index < dvalue.length; index++) {
            const tmp = immutableData.getIn([dkey, index]).toJS();
            loop(tmp, otherKeypath, values);
          }
        }
      } else {
        values.push(dvalue);
      }
    }
    return values;
  };
  const getColumnData = (opts) => {
    const {
      data, keypath, render, spliter, rawdata,
    } = opts;
    let v = null;
    const outer = data[keypath[0]];

    if (Array.isArray(outer)) {
      const values = loop(data, keypath, []);
      v = rawdata ? values : values.join(spliter || '，');
    } else {
      v = fromJS(data).getIn(keypath);
    }
    // 处理render
    if (render && typeof render === 'function') {
      v = render(outer, data);
    }
    return v;
  };
  const getDataSource = (attrs, filterData) => {
    // let token = JSON.parse(sessionStorage.getItem('user')).token;
    const dataSource = filterData.map((item) => {
      const record = {};
      attrs.forEach((attr) => {
        const {
          key, dataIndex, render, child,
        } = attr;
        if (child) {
          record[key] = getDataSource(child, item[key]);
        } else {
          const v = getColumnData({
            data: item,
            keypath: dataIndex || [key],
            render: render || null,
          });
          record[key] = v;
        }
      });

      return record;
    });
    return dataSource;
  };
  // 暂时只处理两层
  const getFlatData = (attrs, filterData, dataToAoa, deep = 0) => {
    filterData.map((item) => {
      let cur = dataToAoa[deep];
      if (!cur) {
        cur = dataToAoa[deep] = [];
      }
      attrs.map((attr, index) => {
        const { key, child } = attr;
        if (child) {
          if (Array.isArray(item[key])) {
            // getFlatData(child,item[key],dataToAoa,deep)

            item[key].map((s, i) => {
              if (i == 0) {
                child.map((c) => {
                  cur.push(s[c.key]);
                });
              } else {
                deep++;
                const childCur = dataToAoa[deep] = [];
                pushNull(childCur, index);
                child.map((c) => {
                  childCur.push(s[c.key]);
                });
              }
            });
          }
        } else {
          cur.push(item[key]);
        }
      });
      deep++;
    });
  };

  const getHeader = (headers, excelHeader, deep, perOffset) => {
    let offset = 0;
    let cur = excelHeader[deep];
    if (!cur) {
      cur = excelHeader[deep] = [];
    }
    pushNull(cur, perOffset - cur.length);
    for (let i = 0; i < headers.length; i++) {
      const head = headers[i];
      cur.push(head.name);
      if (head.hasOwnProperty('child') && Array.isArray(head.child) && head.child.length > 0) {
        const childOffset = getHeader(head.child, excelHeader, deep + 1, cur.length - 1);
        pushNull(cur, childOffset - 1);
        offset += childOffset;
      } else {
        offset++;
      }
    }
    return offset;
  };

  const pushNull = (arr, count) => {
    for (let i = 0; i < count; i++) {
      arr.push(null);
    }
  };
  const fillNull = (arr) => {
    const max = Math.max(...(arr.map((a) => a.length)));
    arr.filter((e) => e.length < max).forEach((e) => pushNull(e, max - e.length));
  };
  const doMerges = (arr) => {
    // 要么横向合并 要么纵向合并
    const deep = arr.length;
    const merges = [];
    for (let y = 0; y < deep; y++) {
      // 先处理横向合并
      const row = arr[y];
      let colSpan = 0;
      for (let x = 0; x < row.length; x++) {
        if (row[x] === null) {
          colSpan++;
          if (((x + 1) === row.length) && (colSpan > 0 && x > colSpan)) {
            merges.push({ s: { r: y, c: x - colSpan }, e: { r: y, c: x } });
          }
        } else if (colSpan > 0 && x > colSpan) {
          merges.push({ s: { r: y, c: x - colSpan - 1 }, e: { r: y, c: x - 1 } });
          colSpan = 0;
        } else {
          colSpan = 0;
        }
      }
    }
    // 再处理纵向合并
    const colLength = arr[0].length;
    for (let x = 0; x < colLength; x++) {
      let rowSpan = 0;
      for (let y = 0; y < deep; y++) {
        if (arr[y][x] != null) {
          rowSpan = 0;
        } else {
          rowSpan++;
        }
      }
      if (rowSpan > 0) {
        merges.push({ s: { r: deep - rowSpan - 1, c: x }, e: { r: deep - 1, c: x } });
      }
    }
    return merges;
  };
  // 内容暂只出了纵向合并
  const doContetMerges = (arr, headerLength) => {
    const deep = arr.length;
    const merges = [];
    // 处理纵向合并
    const colLength = arr[0].length;
    for (let x = 0; x < colLength; x++) {
      let rowSpan = 0;
      const mergY = 0;
      for (let y = 0; y < deep; y++) {
        if (rowSpan > 0) {
          // 如果还有null 继续加
          if (arr[y][x] === null) {
            rowSpan += 1;
          } else {
            // 不为null 增加merge
            merges.push({ s: { r: headerLength + (y - rowSpan - 1), c: x }, e: { r: headerLength + y - 1, c: x } });
            rowSpan = 0;
          }
        } else if (arr[y][x] === null) {
          rowSpan += 1;
        }
      }
      if (rowSpan > 0) {
        merges.push({ s: { r: headerLength + (deep - rowSpan - 1), c: x }, e: { r: headerLength + deep - 1, c: x } });
        rowSpan = 0;
      }
    }
    return merges;
  };
  const exportMergeExcel = async () => {
    setExportLoading(true);
    const {
      column, data, fileName, exportUrl, exportQuery, exportBody, requestType, header, showYearMouth,
    } = props || {};

    let resultData = [];
    if (exportUrl) {
      resultData = requestType == 'post' ? await Request.post(exportUrl, exportBody || {}, exportQuery || {}).then((data) => {
        // 数据接口返回的结果 如果是对象 必须把返回数组放入rows
        if (typeof data === 'object' && data.rows) {
          return data.rows;
        }
        return data;
      }, (err) => {
        message.error('获取数据失败，导出失败！');
      }) : await Request.get(exportUrl, exportQuery || {}).then((data) => {
        if (typeof data === 'object' && data.rows) {
          return data.rows;
        }
        return data;
      }, (err) => {
        message.error('获取数据失败，导出失败！');
      });
      if (!resultData) {
        return;
      }
    } else {
      resultData = data;
    }
    const excelHeader = [];
    getHeader(column, excelHeader, 0, 0);
    fillNull(excelHeader);

    // console.log(excelHeader);

    const loopData = getDataSource(column, resultData);
    // console.log(loopData)

    const dataToAoa = [];
    getFlatData(column, loopData, dataToAoa, 0);
    fillNull(dataToAoa);
    // console.log(dataToAoa);

    const aoa = [].concat(excelHeader, dataToAoa);
    // console.log(aoa)

    const headerMerges = doMerges(excelHeader);
    const contentMerages = doContetMerges(dataToAoa, excelHeader.length);
    const merges = [].concat(headerMerges, contentMerages);
    // console.log(contentMerages)

    // let opts = {
    //     defaultCellStyle: {
    //         font: { name: "宋体", sz: 11, color: { auto: 1 } },
    //         border: {
    //             color: { auto: 1 }
    //         },
    //         alignment: {
    //             /// 自动换行
    //             wrapText: 1,
    //             // 居中
    //             horizontal: "center",
    //             vertical: "center",
    //             indent: 0
    //         }
    //    }
    // }
    const sheet = XLSX.utils.aoa_to_sheet(aoa);
    // let newSheet = {};
    // for (let [key, value] of Object.entries(sheet)) {
    //     if(key == '!ref'){
    //         newSheet[key] = value
    //     }else if(typeof value === 'object'){
    //         newSheet[key] = {
    //             ...value,
    //             s: opts.defaultCellStyle
    //         }
    //     }
    // }
    const wpx = column.map((c) => ({
      wpx: Number.parseInt(c.wpx) ? Number.parseInt(c.wpx) : 100,
    }));
    sheet['!cols'] = wpx;
    sheet['!merges'] = merges;

    // 构建 workbook 对象
    const workbook = XLSX.utils.book_new();

    const time = moment().format('YYYY-MM-DD');

    XLSX.utils.book_append_sheet(workbook, sheet, 'mySheet');
    // 导出 Excel
    XLSX.writeFile(workbook, fileName ? `${fileName}-${time}.xlsx` : '导出数据.xlsx');
    setExportLoading(false);
    message.success(`成功导出了 ${loopData.length || 0} 条数据`);
  };

  const exportProExcel = async () => {
    setExportLoading(true);
    const {
      column, data, fileName, exportUrl, exportQuery, exportBody, requestType, showYearMouth,
    } = props || {};
    let resultData = [];
    if (exportUrl) {
      resultData = requestType == 'post' ? await Request.post(exportUrl, exportBody || {}, exportQuery || {}).then((data) => {
        // 数据接口返回的结果 如果是对象 必须把返回数组放入rows
        if (typeof data === 'object') {
          return data.data ? data.data : data.rows;
        }
        return data;
      }, (err) => {
        message.error('获取数据失败，导出失败！');
      }) : await Request.get(exportUrl, exportQuery || {}).then((data) => {
        if (showYearMouth) {

        }
        if (typeof data === 'object' && data.rows) {
          return data.rows;
        }
        return data;
      }, (err) => {
        message.error('获取数据失败，导出失败！');
      });
      if (!resultData) {
        return;
      }
    } else {
      resultData = data;
    }

    const loopData = getDataSource(column, resultData);

    let content = '';
    let header = '<tr>';
    // header += `<th><div>序号</div></th>`;
    column.map((colum) => {
      header += `<th><div>${colum.name}</div></th>`;
    });
    header += '</tr>';
    loopData.map((data) => {
      content += '<tr>';
      column.map((c) => {
        if (c.style) {
          content += `<th style="${c.style}"><div>${data[c.dataIndex || c.key]}</div></th>`;
        } else {
          content += `<th><div>${data[c.dataIndex || c.key]}</div></th>`;
        }
      });
      content += '</tr>';
    });

    const exportTable = `\uFEFF
                <table style='text-alagin:center' border="1">
                    ${header}
                    ${content}
                </table>
            `;
    const time = moment().format('YYYY-MM-DD');
    const tempStrs = new Blob([exportTable], { type: 'text/xls' });
    FileSaver.saveAs(tempStrs, fileName ? `${fileName}-${time}.xls` : '导出数据.xls');
    setExportLoading(false);
    message.success(`成功导出了 ${loopData.length || 0} 条数据`);
  };

  const exportExcel = async () => {
    setExportLoading(true);
    const {
      column, data, fileName, exportUrl, exportQuery, exportBody, requestType,
    } = props || {};
    const _headers = column
      .map((item, i) => ({ key: item.key, title: item.name, position: String.fromCharCode(65 + i) + 1 }))
      .reduce((prev, next) => ({ ...prev, [next.position]: { key: next.key, v: next.title } }), {});
    let resultData = [];
    if (exportUrl) {
      resultData = requestType == 'post' ? await Request.post(exportUrl, exportBody || {}, exportQuery || {}).then((data) => {
        // 数据接口返回的结果 如果是对象 必须把返回数组放入rows

        if (typeof data === 'object' && (data.rows || data.data)) {
          return data.data ? data.data : data.rows;
        }
        return data;
      }, (err) => {
        message.error('获取数据失败，导出失败！');
      }) : await Request.get(exportUrl, exportQuery || {}).then((data) => {
        if (typeof data === 'object' && data.rows) {
          return data.rows;
        }
        return data;
      }, (err) => {
        message.error('获取数据失败，导出失败！');
      });
      if (!resultData) {
        return;
      }
    } else {
      resultData = data;
    }

    const loopDate = getDataSource(column, resultData);

    const wpx = column.map((c) => ({
      wpx: Number.parseInt(c.wpx) ? Number.parseInt(c.wpx) : 100,
    }));
    if (!(loopDate.length > 0)) {
      setExportLoading(false);
      return;
    }
    const _data = loopDate
      .map((item, i) => column.map((key, j) => ({ content: item[key.key], position: String.fromCharCode(65 + j) + (i + 2) })))
      // 对刚才的结果进行降维处理（二维数组变成一维数组）
      .reduce((prev, next) => prev.concat(next))
      // 转换成 worksheet 需要的结构
      .reduce((prev, next) => ({ ...prev, [next.position]: { v: next.content } }), {});

    // 合并 column 和 data
    const output = { ..._headers, ..._data };
    // 获取所有单元格的位置
    const outputPos = Object.keys(output);
    // 计算出范围 ,["A1",..., "H2"]
    const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;

    // 构建 workbook 对象
    const workbook = {
      SheetNames: ['mySheet'],
      Sheets: {
        mySheet: {

          ...output,
          '!ref': ref,
          '!cols': wpx,
        },
      },
    };
    const time = moment().format('YYYY-MM-DD');
    // 导出 Excel
    XLSX.writeFile(workbook, fileName ? `${fileName}-${time}.xlsx` : '导出数据.xlsx');
    setExportLoading(false);
    message.success(`成功导出了 ${loopDate.length || 0} 条数据`);
  };

  const exportTemplete = async () => {
    const { importTemColumn, importTemData, fileName } = props || {};
    const _headers = importTemColumn
      .map((item, i) => {
        let group = 0; // 用于处理Z1的时候，重计算AA1
        if (parseInt(i / 26) > group) {
          group = parseInt(i / 26);
        }
        if (group > 0) { // AA1 BA1 CA1
          const position = String.fromCharCode(65 + (group - 1));
          return { key: item.key, title: item.name, position: position + String.fromCharCode(65 + (i % 26)) + 1 };
        } return { key: item.key, title: item.name, position: String.fromCharCode(65 + i) + 1 };
      })
      .reduce((prev, next) => ({ ...prev, [next.position]: { key: next.key, v: next.title } }), {});

    const loopDate = getDataSource(importTemColumn, importTemData);

    const wpx = importTemColumn.map((c) => ({
      wpx: Number.parseInt(c.wpx) ? Number.parseInt(c.wpx) : 100,
    }));
    const _data = loopDate.length ? loopDate
      .map((item, i) => importTemColumn.map((key, j) => ({ content: item[key.key], position: String.fromCharCode(65 + j) + (i + 2) })))
      // 对刚才的结果进行降维处理（二维数组变成一维数组）
      .reduce((prev, next) => prev.concat(next))
      // 转换成 worksheet 需要的结构
      .reduce((prev, next) => ({ ...prev, [next.position]: { v: next.content } }), {}) : [];
    // 合并 column 和 data
    const output = { ..._headers, ..._data };
    // 获取所有单元格的位置
    const outputPos = Object.keys(output);
    // 计算出范围 ,["A1",..., "H2"]
    const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;

    // 构建 workbook 对象
    const workbook = {
      SheetNames: ['mySheet'],
      Sheets: {
        mySheet: {

          ...output,
          '!ref': ref,
          '!cols': wpx,
        },
      },
    };
    // 导出 Excel
    XLSX.writeFile(workbook, fileName ? `${fileName}-导入模板.xlsx` : '导入模板.xlsx');
  };
  const tips = (type) => {
    const { tips, templeteBth = true } = props;
    const description = (
      <div className="export-import">
        {tips && tips}
        <Row gutter={16}>
          <Col span={12}>
            <Form form={form} initialValues={{}}>
              <Form.Item name="import-file">
                <Input className="file-uploader" type="file" accept=".xlsx, .xls" onChange={(e) => importExcel(e, type)} />
                <Button style={props.btnStyle} className={props.btnClass} loading={importLoading}>
                  选择文件
                </Button>
              </Form.Item>
            </Form>
          </Col>
          {templeteBth && (
            <Col span={12}>
              <Button style={props.btnStyle} className={props.btnClass} onClick={exportTemplete}>
                模板下载
              </Button>
            </Col>
          )}
        </Row>
      </div>
    );

    notification.info({
      message: '支持 .xlsx、.xls 格式的文件',
      description,
      key: 'import-notification',
      duration: null,
    });
  };

  return (
    <Space>
      {
        props.import && (
          <Button style={props.btnStyle} className={props.btnClass} loading={importLoading} onClick={tips}>
            {props.importBtnName || '导入'}
          </Button>
        )
      }
      {
        props.export && (
          <Tooltip placement="top" title={props.exportBtnTips || '默认导出所有数据'}>
            <Button style={props.btnStyle} className={props.btnClass} loading={exportLoading} onClick={props.exportType === 'pro' ? exportProExcel : exportExcel}>
              {props.exportBtnName || '导出'}
            </Button>
          </Tooltip>
        )
      }
    </Space>
  );
}

ExportAndImport.propTypes = {
  export: PropTypes.bool, // 是否显示导出按钮
  exportBtnName: PropTypes.string, // 导出按钮文字
  importBtnName: PropTypes.string, // 导入按钮文字
  import: PropTypes.bool, // 是否显示导入按钮
  variedImport: PropTypes.bool, // 是否显示多样导入
  variedImportDisable: PropTypes.bool, // 多样导入禁用
  variedImportBtnName: PropTypes.string, // 多样导入文字
  column: PropTypes.array, // 导出显示的header数组 兼容antd column 可直接拿table的column使用  注：column每列的属性wpx设置导出的execl每列的宽度值 默认 100
  data: PropTypes.array, // 导出的数据 兼容antd table 数组嵌套处理
  exportUrl: PropTypes.string, // 导出数据从接口获取的url地址   返回的数据1、数组必须支持column的设置 ，2、如果是对象，数组需放在rows属性上
  exportBody: PropTypes.object, // 导出数据接口body参数
  exportQuery: PropTypes.object, // 导出数据从接口获取的url地址上的参数
  exportBtnTips: PropTypes.string, // 导出按钮tips文字提示
  importUrl: PropTypes.string, // 导入接口url
  importQuery: PropTypes.object, // 导入接口url地址上的参数
  btnClass: PropTypes.string, // 按钮className
  btnStyle: PropTypes.object, // 按钮style
  tips: PropTypes.oneOfType([PropTypes.string, PropTypes.element]), // 上传文件提示的信息
  onImportSucess: PropTypes.func, // 上传成功后 返回处理函数
  importTemColumn: PropTypes.array, // 导入模板设置 头部字段数组
  importTemData: PropTypes.array, // 导入模板默认数据
  requestType: PropTypes.string, // 请求类型
  importDataCallback: PropTypes.func, // 上传后数据返回
  templeteBth: PropTypes.bool, // 模板按钮
  importRequest: PropTypes.bool, // 请求导入接口，false时搭配importDataCallback,
  exportType: PropTypes.string, // 导出执行的函数名
};

export default ExportAndImport;
