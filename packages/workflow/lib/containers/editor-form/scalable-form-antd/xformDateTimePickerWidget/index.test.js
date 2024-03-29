"use strict";

var _react = _interopRequireDefault(require("react"));

var _index = _interopRequireDefault(require("../index"));

var _enzyme = require("enzyme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * xform DateTimePicker widget（时间选择器） 测试用例
 */
describe('xform DateTimePicker widget test', function () {
  var xform, form;
  var INIT_FORM_DATA = {
    beginDate: '',
    endDate: '',
    arriveDate: '2017-08-09 19:51:12'
  };
  var BIZ_DATA = {
    beginDate: {
      fieldType: 'system',
      canSearch: true
    },
    endDate: {
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
          format: 'date-time'
        },
        endDate: {
          type: 'string',
          title: '结束日期',
          format: 'date'
        },
        arriveDate: {
          type: 'string',
          title: '到达日期',
          format: 'date-time'
        }
      }
    },
    uiSchema: {
      beginDate: {
        'ui:widget': 'datetime',
        'ui:options': {
          placeholder: '请选择出发日期',
          format: 'YYYY-MM-DD HH:mm:ss',
          validate: [{
            type: 'empty',
            message: '该字段不能为空'
          }]
        }
      },
      endDate: {
        'ui:widget': 'datetime',
        'ui:options': {
          placeholder: '请选择结束日期',
          format: 'YYYY-MM-DD'
        }
      },
      arriveDate: {
        'ui:widget': 'datetime',
        'ui:options': {
          placeholder: '请选择到达日期',
          format: 'YYYY-MM-DD HH:mm:ss',
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
  it('xform renders item length to be 3', function () {
    expect(xform.find('.xform-item').length).toBe(3);
  });
  it('xform dateTimePicker validate', function () {
    expect(xform.find('.ant-form-explain').first().text()).toBe('该字段不能为空');
  }); // it('xform dateTimePicker noValue onChange', () => {
  //     const item = xform.find('.xform-item').at(0);
  //     const DatePicker = item.find('DatePicker');
  //     expect(xform.find('DatePicker').length).toBe(1);
  //     // const change = DatePicker.props().onChange();
  //     // expect(change).toBeDefined();
  // });
  // it('xform dateTimePicker hasValue onChange', ()=> {
  //     const item = xform.find('.xform-item').at(2);
  //     const DatePicker = item.find('DatePicker');
  //     const change = DatePicker.props().onChange();
  //     expect(change).toBeDefined();
  // });
});