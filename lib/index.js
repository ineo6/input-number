'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _mixin = require('./mixin');

var _mixin2 = _interopRequireDefault(_mixin);

var _InputHandler = require('./InputHandler');

var _InputHandler2 = _interopRequireDefault(_InputHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function noop() {}

function preventDefault(e) {
  e.preventDefault();
}

var InputNumber = _react2["default"].createClass({
  displayName: 'InputNumber',

  propTypes: {
    focusOnUpDown: _react.PropTypes.bool,
    onChange: _react.PropTypes.func,
    onKeyDown: _react.PropTypes.func,
    onKeyUp: _react.PropTypes.func,
    prefixCls: _react.PropTypes.string,
    disabled: _react.PropTypes.bool,
    onFocus: _react.PropTypes.func,
    onBlur: _react.PropTypes.func,
    readOnly: _react.PropTypes.bool,
    max: _react.PropTypes.number,
    min: _react.PropTypes.number,
    step: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    upHandler: _react.PropTypes.node,
    downHandler: _react.PropTypes.node,
    useTouch: _react.PropTypes.bool,
    formatter: _react.PropTypes.func,
    handler: _react.PropTypes.bool, // ux
    addonBefore: _react.PropTypes.node, // ux
    addonAfter: _react.PropTypes.node },

  mixins: [_mixin2["default"]],

  getDefaultProps: function getDefaultProps() {
    return {
      focusOnUpDown: true,
      useTouch: false,
      prefixCls: 'rc-input-number',
      handler: false
    };
  },
  componentDidMount: function componentDidMount() {
    this.componentDidUpdate();
  },
  componentDidUpdate: function componentDidUpdate() {
    if (this.props.focusOnUpDown && this.state.focused && document.activeElement !== this.refs.input) {
      this.focus();
    }
  },
  onKeyDown: function onKeyDown(e) {
    if (e.keyCode === 38) {
      var ratio = this.getRatio(e);
      this.up(e, ratio);
      this.stop();
    } else if (e.keyCode === 40) {
      var _ratio = this.getRatio(e);
      this.down(e, _ratio);
      this.stop();
    }
    var onKeyDown = this.props.onKeyDown;

    if (onKeyDown) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      onKeyDown.apply(undefined, [e].concat(args));
    }
  },
  onKeyUp: function onKeyUp(e) {
    this.stop();
    var onKeyUp = this.props.onKeyUp;

    if (onKeyUp) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      onKeyUp.apply(undefined, [e].concat(args));
    }
  },
  getRatio: function getRatio(e) {
    var ratio = 1;
    if (e.metaKey || e.ctrlKey) {
      ratio = 0.1;
    } else if (e.shiftKey) {
      ratio = 10;
    }
    return ratio;
  },
  getValueFromEvent: function getValueFromEvent(e) {
    return e.target.value;
  },
  focus: function focus() {
    this.refs.input.focus();
  },
  formatWrapper: function formatWrapper(num) {
    if (this.props.formatter) {
      return this.props.formatter(num);
    }
    return num;
  },
  render: function render() {
    var _classNames, _classNames2;

    var props = _extends({}, this.props);
    var prefixCls = props.prefixCls,
        disabled = props.disabled,
        readOnly = props.readOnly,
        useTouch = props.useTouch,
        handler = props.handler;

    var classes = (0, _classnames2["default"])((_classNames = {}, _defineProperty(_classNames, prefixCls, true), _defineProperty(_classNames, props.className, !!props.className), _defineProperty(_classNames, prefixCls + '-disabled', disabled), _defineProperty(_classNames, prefixCls + '-focused', this.state.focused), _classNames));
    var upDisabledClass = '';
    var downDisabledClass = '';
    var value = this.state.value;
    if (!isNaN(value)) {
      var val = Number(value);
      if (val >= props.max) {
        upDisabledClass = prefixCls + '-handler-up-disabled';
      }
      if (val <= props.min) {
        downDisabledClass = prefixCls + '-handler-down-disabled';
      }
    } else {
      upDisabledClass = prefixCls + '-handler-up-disabled';
      downDisabledClass = prefixCls + '-handler-down-disabled';
    }

    var editable = !props.readOnly && !props.disabled;

    // focus state, show input value
    // unfocus state, show valid value
    var inputDisplayValue = void 0;
    if (this.state.focused) {
      inputDisplayValue = this.state.inputValue;
    } else {
      inputDisplayValue = this.toPrecisionAsStep(this.state.value);
    }

    if (inputDisplayValue === undefined) {
      inputDisplayValue = '';
    }

    var upEvents = void 0;
    var downEvents = void 0;
    if (useTouch) {
      upEvents = {
        onTouchStart: editable && !upDisabledClass ? this.up : noop,
        onTouchEnd: this.stop
      };
      downEvents = {
        onTouchStart: editable && !downDisabledClass ? this.down : noop,
        onTouchEnd: this.stop
      };
    } else {
      upEvents = {
        onMouseDown: editable && !upDisabledClass ? this.up : noop,
        onMouseUp: this.stop,
        onMouseLeave: this.stop
      };
      downEvents = {
        onMouseDown: editable && !downDisabledClass ? this.down : noop,
        onMouseUp: this.stop,
        onMouseLeave: this.stop
      };
    }
    var inputDisplayValueFormat = this.formatWrapper(inputDisplayValue);

    // ux group
    var wrapperClassName = props.prefixCls + '-group';
    var addonClassName = wrapperClassName + '-addon';
    var addonBefore = props.addonBefore ? _react2["default"].createElement(
      'span',
      { className: addonClassName },
      props.addonBefore
    ) : null;

    var addonAfter = props.addonAfter ? _react2["default"].createElement(
      'span',
      { className: addonClassName },
      props.addonAfter
    ) : null;

    var wrapClassName = (0, _classnames2["default"])((_classNames2 = {}, _defineProperty(_classNames2, prefixCls + '-input-wrap', true), _defineProperty(_classNames2, wrapperClassName, addonBefore || addonAfter), _classNames2));
    // ux group end

    // ref for test
    return _react2["default"].createElement(
      'div',
      { className: classes, style: props.style },
      handler ? _react2["default"].createElement(
        'div',
        { className: prefixCls + '-handler-wrap' },
        _react2["default"].createElement(
          _InputHandler2["default"],
          _extends({
            ref: 'up',
            disabled: !!upDisabledClass || disabled || readOnly,
            prefixCls: prefixCls,
            unselectable: 'unselectable'
          }, upEvents, {
            className: prefixCls + '-handler ' + prefixCls + '-handler-up ' + upDisabledClass
          }),
          this.props.upHandler || _react2["default"].createElement('span', {
            unselectable: 'unselectable',
            className: prefixCls + '-handler-up-inner',
            onClick: preventDefault
          })
        ),
        _react2["default"].createElement(
          _InputHandler2["default"],
          _extends({
            ref: 'down',
            disabled: !!downDisabledClass || disabled || readOnly,
            prefixCls: prefixCls,
            unselectable: 'unselectable'
          }, downEvents, {
            className: prefixCls + '-handler ' + prefixCls + '-handler-down ' + downDisabledClass
          }),
          this.props.downHandler || _react2["default"].createElement('span', {
            unselectable: 'unselectable',
            className: prefixCls + '-handler-down-inner',
            onClick: preventDefault
          })
        )
      ) : null,
      _react2["default"].createElement(
        'div',
        { className: wrapClassName },
        addonBefore,
        _react2["default"].createElement('input', {
          type: props.type,
          placeholder: props.placeholder,
          onClick: props.onClick,
          className: prefixCls + '-input',
          autoComplete: 'off',
          onFocus: this.onFocus,
          onBlur: this.onBlur,
          onKeyDown: editable ? this.onKeyDown : noop,
          onKeyUp: editable ? this.onKeyUp : noop,
          autoFocus: props.autoFocus,
          readOnly: props.readOnly,
          disabled: props.disabled,
          max: props.max,
          min: props.min,
          name: props.name,
          onChange: this.onChange,
          ref: 'input',
          value: inputDisplayValueFormat
        }),
        addonAfter
      )
    );
  }
});

exports["default"] = InputNumber;
module.exports = exports['default'];