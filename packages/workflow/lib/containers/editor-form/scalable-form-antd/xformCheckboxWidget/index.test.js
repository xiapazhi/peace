"use strict";

var _react = _interopRequireDefault(require("react"));

var _index = _interopRequireDefault(require("../index"));

var _enzyme = require("enzyme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * xform Checkboxes widget（复选框选择器） 测试用例
 */
describe('xform Checkboxes widget test', function () {
  var xform, form;
  var INIT_FORM_DATA = {
    road: [],
    street: '',
    district: ['chongwen', 'chaoyang']
  };
  var BIZ_DATA = {
    road: [],
    street: ['xijie'],
    district: {
      fieldType: 'universal',
      canSearch: true
    }
  };
  var formSchema = {
    jsonSchema: {
      description: 'widget测试',
      type: 'object',
      required: ['note'],
      properties: {
        road: {
          type: 'array',
          title: '',
          items: {
            type: 'string',
            "enum": ['wenyi', 'wener', 'tianmu'],
            enumNames: ['文一西路', '文二西路', '天目山路']
          },
          uniqueItems: true
        },
        street: {
          type: 'array',
          title: '',
          items: {
            type: 'string',
            "enum": ['xijie', 'dongjie'],
            enumNames: ['西街', '东街']
          },
          data: [{
            label: '西街',
            value: 'xijie'
          }],
          uniqueItems: true
        },
        district: {
          type: 'array',
          title: '请选择城市的地区',
          items: {
            type: 'string',
            "enum": ['haidian', 'chaoyang', 'chongwen'],
            enumNames: ['海淀', '朝阳', '崇文']
          },
          uniqueItems: true
        }
      }
    },
    uiSchema: {
      road: {
        'ui:widget': 'checkboxes',
        'ui:options': {
          vertical: false,
          validate: [{
            type: 'empty',
            message: '请至少选择一项'
          }]
        }
      },
      street: {
        'ui:widget': 'checkboxes',
        'ui:options': {
          vertical: false,
          validate: [{
            type: 'empty',
            message: '请至少选择一项'
          }]
        }
      },
      district: {
        'ui:widget': 'checkboxes',
        'ui:options': {
          vertical: false,
          validate: [{
            type: 'empty',
            message: '请至少选择一项'
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
  it('xform renders input[type=checkbox]', function () {
    expect(xform.find('input[type="checkbox"]')).toBeDefined();
  });
  it('xform Checkboxes validate', function () {
    expect(xform.find('.ant-form-explain').first().text()).toBe('请至少选择一项');
  });
  it('xform Checkboxed onchange', function () {
    var item = xform.find('.xform-item').at(2);
    var input = item.find('input[type="checkbox"]').at(0);
    input.simulate('change', {
      target: {
        checked: true
      }
    });
    expect(input.node.checked).toBe(true);
  });
});