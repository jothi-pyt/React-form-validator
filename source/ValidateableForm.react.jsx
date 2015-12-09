/**
 * Created by wujianbo on 15/12/8.
 */
/**
 * 使用方法: 给需要设置验证的表单设置 ref="vForm"  然后传入 rules 和 messages 即可开始使用!
 *  [注意]:  需要将原来传入到 Form 标签的 onSubmit 事件传入本组件中!
 * 目前提供的默认规则都存在defaultRules中,  可以查看
 *     范例: rules : {
 *              field1: {
 *                  number: true,
 *                  required: true
 *              },
 *              field2: {
 *                  email: true,
 *                  zhiHang: /[支行|分行]/
 *              }
 *          }
 *          messages : {
 *              field1: {
 *                  number: '请在field1中输入数字!',
 *                  required: '请输入field1!'
 *              }
 *          }
 */
import React from 'react';
import ReactDom from 'react-dom';
import _defaultRules from './defaultRules';
import _defaultMessages from './defaultMessages';
import assign from 'object-assign';
require('./ValidateableForm.css');

let __OriginFromSubmitHandler = function(){};

function insertMessageAfterInput (messages){
    let inputClassName = this.className.split(/\s+/);
    if(inputClassName.indexOf('text-red') === -1){
        inputClassName.push('text-red');
    }
    else {
        //Do Noting
    }
    this.className = inputClassName.join(' ');
    if(this.nextSibling && this.nextSibling.className === 'validate-message'){
        this.nextSibling.innerText = messages[0];
    }
    else{
        let messageNode = document.createElement('span');
        messageNode.innerText = messages[0];
        messageNode.className = 'validate-message';
        if(this.nextSibling && this.parentNode){
            this.parentNode.insertBefore(messageNode, this.nextSibling);
        }
        else if(this.parentNode) {
            this.parentNode.appendChild(messageNode);
        }
        else {
            throw '你居然没有父节点? 不科学!'
        }
    }
}
function deleteMessageAfterInput (){
    let inputClassName = this.className.split(/\s+/);
    while(inputClassName.indexOf('text-red') !== -1){
        inputClassName.splice(inputClassName.indexOf('text-red'), 1);
    }
    this.className = inputClassName.join(' ');
    if(this.nextSibling && this.nextSibling.className === 'validate-message'){
        this.nextSibling.innerText = '';
    }
    else {
        //Do Nothing
    }
}

const VFrom = React.createClass({
    getDefaultProps (){
        return {
            rules: {},
            messages: {},
            onSubmit(){}
        }
    },
    getInitialState (){
        return {
            fitRule: true,
            messages: []
        }
    },
    findChildInputByName (name){
        const _theForm = ReactDom.findDOMNode(this.refs['vForm']);
        return _theForm.querySelector('[name=' + name + ']');
    },
    addChangeValidator (name){
        const rules = assign({}, this.props.rules[name]);
        return this.validate(rules, this.props.messages[name] || {});
    },
    validate (rules, messages){
        return (event) => {
            let value = event.target.value,
                testFlag = true,
                popMessages = [],
                input = event.target;
            for(let i in rules){
                if(rules.hasOwnProperty(i) && rules[i]){
                    if(Object.prototype.toString.call(rules[i]) === '[object RegExp]'){
                            //如果规则本身是个正则表达式
                        if(!rules[i].test(value)){
                            //如果违反规则,  标志为未验证通过,  并且在要提示的信息中加入该信息
                            testFlag = false;
                            popMessages.push(messages[i] || _defaultMessages[i]);
                        }
                        else {
                            //Do Nothing
                        }
                    }
                    else {
                        if(!_defaultRules[i]){
                            if(!_defaultRules['_NOT_' + i]){  //没有这条规则
                                throw 'ERROR: 规则' + i + '未定义!';
                            }
                            else { //如果有这条规则的反规则
                                if(_defaultRules['_NOT_' + i].test(value)){
                                    testFlag = false;
                                    popMessages.push(messages[i] || _defaultMessages[i]);
                                }
                                else {
                                    //Do Nothing
                                }
                            }
                        }
                        else { //有这条默认规则
                            if(!_defaultRules[i].test(value)){
                                testFlag = false;
                                popMessages.push(messages[i] || _defaultMessages[i]);
                            }
                            else {
                                //Do Nothing
                            }
                        }
                    }
                }
            }
            if(testFlag){
                //insertMessageAfterInput.call(input, popMessages);
                deleteMessageAfterInput.call(input, popMessages);
            }
            else {
                insertMessageAfterInput.call(input, popMessages);
            }
            return testFlag;
        }
    },
    componentDidMount (){
        const rules = this.props.rules;
        if(this.refs['vForm']){
            const _theForm = ReactDom.findDOMNode(this.refs['vForm']);
            _theForm.addEventListener('submit', this.valid);
            for(let i in rules){
                if(rules.hasOwnProperty(i)){
                    let input = this.findChildInputByName(i);
                    if(input){
                        //input.addEventListener('change', this.addChangeValidator(i));
                        input.onkeyup = this.addChangeValidator(i);
                    }
                    else {
                        throw 'ERROR: 表单中没有' + i + '这个字段!'
                    }
                }
            }
        }
        else {
            throw 'ERROR: 没有找到要验证的表单, 请设置要验证的表单的 ref 属性为 "vForm"'
        }
    },
    valid (event){
        if(this.refs['vForm']){
            const rules = this.props.rules;
            let testFlag = true;
            for(let i in rules){
                if(rules.hasOwnProperty(i)){
                    let input = this.findChildInputByName(i);
                    if(input){
                        testFlag = this.validate(this.props.rules[i], this.props.messages[i] || {})({target: input});
                    }
                    else {
                        throw 'ERROR: 表单中没有' + i + '这个字段!'
                    }
                }
            }
            if(!testFlag){
                console.log('停止传播!');
                event.preventDefault();
                event.stopPropagation();
            }
            else {
                this.props.onSubmit(event);
            }
        }
        else {
            throw 'ERROR: 没有找到要验证的表单, 请设置要验证的表单的 ref 属性为 "vForm"'
        }
    },
    render (){
        return(
            <div>
                {React.Children.map(this.props.children, (element) => {
                    return React.cloneElement(element, { ref: element.ref });
                    })}
            </div>
        )
    }
});

export default VFrom;