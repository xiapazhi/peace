/**
 * xform基础widget => 普通文本框类型
 */

import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { InputItem } from 'antd-mobile';
import classnames from 'classnames';

import './index.less';

export default class CustomInputWidget extends PureComponent {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.input = null;
    }

    componentDidMount() {
        const logger = this.props.formContext.logger;
        logger.logEvent('widget', 'show', 'input');
    }

    _getValidateMessage(errorType, validate) {
        let errorMessage = '';
        validate.map((validateItem) => {
            if (validateItem.type === errorType) {
                errorMessage = validateItem.message;
                return false;
            }
        });
        return errorMessage;
    }

    handleChange(value) {
        this.props.onChange(value);
    }

    handleFocus = () => {
        const inputElement = ReactDOM.findDOMNode(this.input);
        if (inputElement.click) {
            inputElement.click();
        }
        inputElement.scrollIntoView();
    };

    //过滤掉react-json-schema中注入option中的属性，防止这部分属性添加到组件上
    _filterSystemOptions(options) {
        const BLACK_LIST = ['enumOptions', 'disabled', 'readonly', 'help'];
        BLACK_LIST.map((name) => {
            if (options.hasOwnProperty(name)) {
                delete options[name];
            }
        });
        return options;
    }

    render() {
        const { schema, options, label, readonly, required, placeholder, value } = this.props;
        let disabled = this.props.disabled;
        //解析schema中的约定maxlength
        const maxLength = schema.maxLength;
        const minLength = schema.minLength;

        //解析schema中约定的_errorType字段，用来标识是validate中哪种类型校验不通过
        let validateMessage = '';
        let { _errorType, validate, ...otherOptions } = options;
        otherOptions = this._filterSystemOptions(otherOptions);
        _errorType = _errorType || '';

        if (_errorType !== '' && typeof validate !== 'undefined') {
            validateMessage = this._getValidateMessage(_errorType, validate);
        }

        //判断节点禁用属性
        let formContext = this.props.formContext;
        let disnodes = options.disnodes || null;
        if (formContext.currentNode && Array.isArray(disnodes)) {
            if (disnodes.indexOf(formContext.currentNode) > -1) {
                disabled = true;
            }
        }

        return (
            <div className={classnames({
                'xform-custom-widget': true,
                'xform-custom-input': true,
                'xform-item-has-error': _errorType !== ''
            })}>
                <InputItem
                    ref={(input) => {
                        this.input = input;
                    }}
                    type="text"
                    //clear
                    error={_errorType !== ''}
                    maxLength={maxLength || Infinity}
                    minLength={minLength || 0}
                    placeholder={placeholder}
                    value={value}
                    editable={!readonly}
                    disabled={disabled}
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    {...otherOptions}
                ><label className={classnames({
                    required: required
                })}>{label}</label></InputItem>
                <div className="xform-item-error-explain">{validateMessage}</div>
            </div>
        );
    }
}
