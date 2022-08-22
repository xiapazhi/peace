"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _antd = require("antd");

var _classnames = _interopRequireDefault(require("classnames"));

var _transferTable = _interopRequireDefault(require("./transferTable"));

var _transferNormalTable = _interopRequireDefault(require("./transferNormalTable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var onComposition = false; // cited from: https://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome

var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor); //数据源格式较为特殊
// {
//     "data":[                                                           ——对应data
//         {"key":"0","title":"某某1","department":"1号部门"},
//         {"key":"1","title":"某某2","department":"2号部门"}, 
//     ],
//     "leftColumns":[{"dataIndex":"title","title":"姓名"},{"dataIndex":"department","title":"所属部门"}],    ——对应左侧表格的Columns配置
//     "rightColumns":[{"dataIndex":"title","title":"姓名"},{"dataIndex":"department","title":"所属部门"}]     ——对应右侧表格的Columns配置
// }

var CustomTransferWidget = /*#__PURE__*/function (_Component) {
  _inherits(CustomTransferWidget, _Component);

  var _super = _createSuper(CustomTransferWidget);

  function CustomTransferWidget(props) {
    var _this;

    _classCallCheck(this, CustomTransferWidget);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "onTargetKeysChange", function (nextTargetKeys) {
      _this.setSelectedData(nextTargetKeys);
    });

    _this.timer = null;
    _this.state = {
      transferType: props.options.TransferType ? props.options.enumOptions.filter(function (x) {
        return x.value == props.options.TransferType;
      })[0].label : "",
      targetKeys: []
    };
    return _this;
  }

  _createClass(CustomTransferWidget, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var logger = this.props.formContext.logger;
      logger.logEvent('widget', 'show', 'input');
    }
  }, {
    key: "setSelectedData",
    value: function setSelectedData(data) {
      var _this2 = this;

      if (this.timer !== null) {
        window.clearTimeout(this.timer);
        this.timer = window.setTimeout(function () {
          _this2._handleFieldValueChange(data);
        }, 100);
      } else {
        this.timer = window.setTimeout(function () {
          _this2._handleFieldValueChange(data);
        }, 100);
      }
    }
  }, {
    key: "_handleFieldValueChange",
    value: function _handleFieldValueChange(value) {
      var onChange = this.props.onChange;
      this.setState({
        targetKeys: value
      }, function () {
        onChange(value);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var schema = this.props.schema;
      var options = this.props.options;
      var transferType = this.state.transferType,
          data = schema.transferData,
          targetKeys = this.state.targetKeys,
          leftTitle = options.leftTitle,
          rightTitle = options.rightTitle,
          checkType = options.checkType ? 'radio' : 'checkbox';
      var transferData = data ? data.data : [],
          leftColumns = data ? data.leftColumns : [],
          rightColumns = data ? data.rightColumns : []; //判断节点禁用属性

      var disabled = options.disabled;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: (0, _classnames["default"])({
          'ant-form-item-control': true,
          'xform-custom-widget': true,
          'xform-custom-input': true
        })
      }, checkType == 'radio' ? /*#__PURE__*/_react["default"].createElement(_transferNormalTable["default"], {
        disabled: disabled,
        transferData: transferData,
        targetKeys: targetKeys,
        columns: leftColumns,
        title: leftTitle,
        onChange: this.onTargetKeysChange
      }) : /*#__PURE__*/_react["default"].createElement(_transferTable["default"], {
        disabled: disabled,
        transferData: transferData,
        targetKeys: targetKeys,
        leftColumns: leftColumns,
        rightColumns: rightColumns,
        leftTitle: leftTitle,
        checkType: checkType,
        rightTitle: rightTitle,
        onChange: this.onTargetKeysChange
      }));
    }
  }]);

  return CustomTransferWidget;
}(_react.Component);

exports["default"] = CustomTransferWidget;