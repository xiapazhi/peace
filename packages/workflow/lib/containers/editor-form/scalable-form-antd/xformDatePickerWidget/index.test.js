"use strict";

var _react = _interopRequireDefault(require("react"));

var _index = _interopRequireDefault(require("../index"));

var _enzyme = require("enzyme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * xform DatePicker widget（时间选择器） 测试用例
 */
describe('xform DatePicker widget test', function () {
  var xform, form;
  var INIT_FORM_DATA = {
    beginDate: '',
    beginDay: '2017-08-09',
    endDate: '',
    endDay: '2017-08-09',
    arriveDate: '2017-08-09'
  };
  var BIZ_DATA = {
    beginDate: {
      fieldType: 'system',
      canSearch: true
    },
    beginDay: {
      fieldType: 'system',
      canSearch: true
    },
    endDate: {
      fieldType: 'system',
      canSearch: true
    },
    endDay: {
      fieldType: 'system',
      canSearch: true
    },
    arriveDate: {
      fieldType: 'system',
      canSearch: true
    }
  };
  var formSchema = {
    jsonSchema: {
      description: 'widget测试',
      type: 'object',
      required: ['beginDate', 'endDate', 'arriveDate'],
      properties: {
        beginDate: {
          type: 'string',
          title: '出发日期',
          format: 'date'
        },
        beginDay: {
          type: 'string',
          title: '出发日期',
          format: 'date'
        },
        endDate: {
          type: 'string',
          title: '结束日期',
          format: 'month'
        },
        endDay: {
          type: 'string',
          title: '结束日期',
          format: 'month'
        },
        arriveDate: {
          type: 'string',
          title: '到达日期',
          format: 'date'
        }
      }
    },
    uiSchema: {
      beginDate: {
        'ui:widget': 'date',
        'ui:options': {
          placeholder: '请选择出发日期',
          format: 'YYYY-MM-DD',
          validate: [{
            type: 'empty',
            message: '该字段不能为空'
          }]
        }
      },
      beginDay: {
        'ui:widget': 'date',
        'ui:options': {
          placeholder: '请选择出发日期',
          format: 'YYYY-MM-DD',
          validate: [{
            type: 'empty',
            message: '该字段不能为空'
          }]
        }
      },
      endDate: {
        'ui:widget': 'date',
        'ui:options': {
          placeholder: '请选择结束日期',
          format: 'YYYY-MM-DD'
        }
      },
      endDay: {
        'ui:widget': 'date',
        'ui:options': {
          placeholder: '请选择结束日期',
          format: 'YYYY-MM-DD'
        }
      },
      arriveDate: {
        'ui:widget': 'date',
        'ui:options': {
          placeholder: '请选择到达日期',
          format: 'YYYY-MM-DD',
          validate: [{
            type: 'empty',
            message: '该字段不能为空'
          }]
        }
      }
    },
    formData: INIT_FORM_DATA,
    bizData: BIZ_DATA
  };
  beforeEach(function () {
    xform = (0, _enzyme.mount)( /*#__PURE__*/_react["default"].createElement(_index["default"], {
      jsonSchema: formSchema.jsonSchema,
      uiSchema: formSchema.uiSchema,
      formData: formSchema.formData,
      bizData: formSchema.bizData
    }));
    form = xform.find('form').first();
    form.simulate('submit');
  });
  it('xform renders form label', function () {
    var form = xform.find('form').first();
    expect(form).toBeDefined();
  });
  it('xform renders item length to be 5', function () {
    expect(xform.find('.xform-item').length).toBe(5);
  });
  it('xform dateTime validate', function () {
    expect(xform.find('.ant-form-explain').first().text()).toBe('该字段不能为空');
  }); // it('xform MonthPicker noValue onChange', () => {
  //     const item = xform.find('.xform-item').at(2);
  //     const MonthPicker = item.find('MonthPicker').first();
  //     const change = MonthPicker.props().onChange();
  //     expect(MonthPicker).toBeDefined();
  // });
  // it('xform MonthPicker hasValue onChange', ()=> {
  //     const item = xform.find('.xform-item').at(3);
  //     const MonthPicker = item.find('MonthPicker').first();
  //     const change = MonthPicker.props().onChange();
  //     expect(MonthPicker).toBeDefined();
  // });
});