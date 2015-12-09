/**
 * Created by wujianbo on 15/12/9.
 */
/**
 * Created by wujianbo on 15/12/8.
 */
import React from 'react';
import ReactDom from 'react-dom';
import ValidateableForm from './ValidateableForm.react.jsx';

const App = React.createClass({
    console (event){
        console.log('simulate submit!');
        event.preventDefault();
        event.stopPropagation();
    },
    render (){
        return (
            <ValidateableForm  onSubmit={this.console}
                               rules={{
                 input1: {
                     required: true,
                     numbers: true
                 },
                 input2: {
                     required: true,
                     idCard: true
                 }
                }}>
                <form ref="vForm">
                    <label>请输入数字!</label>
                    <input type="text" name="input1"/>
                    <br/>
                    <label>请输入身份证号!</label>
                    <input type="text" name="input2"/>
                    <br/>
                    <input type="submit"/>
                </form>
            </ValidateableForm>
        )
    }
});

ReactDom.render(
    <App />,
    document.getElementById('content')
);