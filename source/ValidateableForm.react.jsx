'use strict';

var _redboxReact2 = require('redbox-react');

var _redboxReact3 = _interopRequireDefault(_redboxReact2);

var _reactTransformCatchErrors3 = require('react-transform-catch-errors');

var _reactTransformCatchErrors4 = _interopRequireDefault(_reactTransformCatchErrors3);

var _react2 = require('react');

var _react3 = _interopRequireDefault(_react2);

var _reactTransformHmr3 = require('react-transform-hmr');

var _reactTransformHmr4 = _interopRequireDefault(_reactTransformHmr3);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _defaultRules2 = require('./defaultRules');

var _defaultRules3 = _interopRequireDefault(_defaultRules2);

var _defaultMessages2 = require('./defaultMessages');

var _defaultMessages3 = _interopRequireDefault(_defaultMessages2);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _components = {
  _component: {}
};

var _reactTransformHmr2 = (0, _reactTransformHmr4.default)({
  filename: './source/ValidateableForm.react.jsx',
  components: _components,
  locals: [module],
  imports: [_react3.default]
});

var _reactTransformCatchErrors2 = (0, _reactTransformCatchErrors4.default)({
  filename: './source/ValidateableForm.react.jsx',
  components: _components,
  locals: [],
  imports: [_react3.default, _redboxReact3.default]
});

function _wrapComponent(id) {
  return function (Component) {
    return _reactTransformHmr2(_reactTransformCatchErrors2(Component, id), id);
  };
}

/**
 * Created by wujianbo on 15/12/8.
 */
/**
 * Usage: Set the ref of the form to be validated as :
 *     ref="vForm"
 * then pass down the props:
 *     rules
 *     messages
 * And you are all set to go!
 *  [CAUTION]:  You will need to pass the [submit event handler] from the original Form to this ValidateableForm!
 *
 * Default rules ar in the [ defaultRules.js ]
 *
 * example: rules : {
 *              field1: {
 *                  number: true,
 *                  required: true
 *              },
 *              field2: {
 *                  email: true,
 *                  space: /\b/
 *              }
 *          }
 *          messages : {
 *              field1: {
 *                  number: 'Please Input A Valid Number !',
 *                  required: 'Please Input Field1 !'
 *              }
 *          }
 */
exports.__esModule = true;

require('./ValidateableForm.css');

var __OriginFromSubmitHandler = function __OriginFromSubmitHandler() {};
var _defaultMessage = 'Input is not valid.';

function insertMessageAfterInput(messages) {
  var inputClassName = this.className.split(/\s+/);
  if (inputClassName.indexOf('text-red') === -1) {
    inputClassName.push('text-red');
  } else {
    //Do Noting
  }
  this.className = inputClassName.join(' ');
  if (this.nextSibling && this.nextSibling.className === 'validate-message') {
    this.nextSibling.innerText = messages[0];
  } else {
    var messageNode = document.createElement('span');
    messageNode.innerText = messages[0];
    messageNode.className = 'validate-message';
    if (this.nextSibling && this.parentNode) {
      this.parentNode.insertBefore(messageNode, this.nextSibling);
    } else if (this.parentNode) {
      this.parentNode.appendChild(messageNode);
    } else {
      throw "Don't have a parent Node?  Impossible!";
    }
  }
}
function deleteMessageAfterInput() {
  var inputClassName = this.className.split(/\s+/);
  while (inputClassName.indexOf('text-red') !== -1) {
    inputClassName.splice(inputClassName.indexOf('text-red'), 1);
  }
  this.className = inputClassName.join(' ');
  if (this.nextSibling && this.nextSibling.className === 'validate-message') {
    this.nextSibling.innerText = '';
  } else {
    //Do Nothing
  }
}

var VFrom = _wrapComponent('_component')(_react3.default.createClass({
  displayName: 'VFrom',
  getDefaultProps: function getDefaultProps() {
    return {
      rules: {},
      messages: {},
      onSubmit: function onSubmit() {},

      messageClassName: ''
    };
  },
  getInitialState: function getInitialState() {
    return {
      fitRule: true,
      messages: []
    };
  },
  findChildInputByName: function findChildInputByName(name) {
    var _theForm = _reactDom2.default.findDOMNode(this.refs['vForm']);
    return _theForm.querySelector('[name=' + name + ']');
  },
  addChangeValidator: function addChangeValidator(name) {
    var rules = (0, _objectAssign2.default)({}, this.props.rules[name]);
    return this.validate(rules, this.props.messages[name] || {});
  },
  validate: function validate(rules, messages) {
    return function (event) {
      var value = event.target.value,
        testFlag = true,
        popMessages = [],
        input = event.target;
      for (var i in rules) {
        if (rules.hasOwnProperty(i) && rules[i]) {
          if (Object.prototype.toString.call(rules[i]) === '[object RegExp]') {
            //If the rule itself is a RegExp Object
            if (!rules[i].test(value)) {
              //If you break the rules
              testFlag = false;
              popMessages.push(messages[i] || _defaultMessage);
            } else {
              //Do Nothing
            }
          } else if (Object.prototype.toString.call(rules[i]) === '[object Function]') {
            //If the rule itself is a Function.
            if (!rules[i](value)) {
              testFlag = false;
              popMessages.push(messages[i] || _defaultMessage);
            } else {
              //Do Nothing
            }
          } else {
            if (!_defaultRules3.default[i]) {
              if (!_defaultRules3.default['_NOT_' + i]) {
                //没有这条规则
                throw 'ERROR: Rule: ' + i + ' is not defined.';
              } else {
                //If there is a anti-rule of this current rule
                if (_defaultRules3.default['_NOT_' + i].test(value)) {
                  testFlag = false;
                  popMessages.push(messages[i] || _defaultMessages3.default[i]);
                } else {
                  //Do Nothing
                }
              }
            } else {
              //If there is a Default Rule.
              if (Object.prototype.toString.call(_defaultRules3.default[i]) === '[object RegExp]') {
                if (!_defaultRules3.default[i].test(value)) {
                  testFlag = false;
                  popMessages.push(messages[i] || _defaultMessages3.default[i]);
                } else {
                  //Do Nothing
                }
              } else if (Object.prototype.toString.call(_defaultRules3.default[i]) === '[object Function]') {
                if (!_defaultRules3.default[i](rules[i], value)) {
                  testFlag = false;
                  popMessages.push(messages[i] || _defaultMessages3.default[i] + rules[i]);
                }
              }
            }
          }
        }
      }
      if (testFlag) {
        deleteMessageAfterInput.call(input, popMessages);
      } else {
        insertMessageAfterInput.call(input, popMessages);
      }
      return testFlag;
    };
  },
  componentDidMount: function componentDidMount() {
    var rules = this.props.rules;
    if (this.refs['vForm']) {
      var _theForm = _reactDom2.default.findDOMNode(this.refs['vForm']);
      _theForm.addEventListener('submit', this.valid);
      for (var i in rules) {
        if (rules.hasOwnProperty(i)) {
          var input = this.findChildInputByName(i);
          if (input) {
            input.onkeyup = this.addChangeValidator(i);
          } else {
            throw 'ERROR: There is no input name as :' + i + ' !';
          }
        }
      }
    } else {
      throw 'ERROR: Did not found a Form to validate. Make sure you set the ref of the Form as "vForm".';
    }
  },
  valid: function valid(event) {
    if (this.refs['vForm']) {
      var rules = this.props.rules;
      var testFlag = true;
      for (var i in rules) {
        if (rules.hasOwnProperty(i)) {
          var input = this.findChildInputByName(i);
          if (input) {
            testFlag = this.validate(this.props.rules[i], this.props.messages[i] || {})({ target: input }) && testFlag;
          } else {
            throw 'ERROR: There is no input name as :' + i + ' !';
          }
        }
      }
      if (!testFlag) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        this.props.onSubmit(event);
      }
    } else {
      throw 'ERROR: Did not found a Form to validate. Make sure you set the ref of the Form as "vForm".';
    }
  },
  render: function render() {
    return _react3.default.createElement(
      'div',
      null,
      _react3.default.Children.map(this.props.children, function (element) {
        return _react3.default.cloneElement(element, { ref: element.ref });
      })
    );
  }
}));

exports['default'] = VFrom;
module.exports = exports['default'];
