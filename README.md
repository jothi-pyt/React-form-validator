# React-form-validator
## A React Form Validator. The same API as jQuery.validator

Usage: Set the ref of the form to be validated as :
 
`ref="vForm"`
     
then pass down the props:

* rules
* messages

And you are all set to go!
 
**CAUTION**:  You will need to pass the **submit event handler** from the original Form to this ValidateableForm!

Default rules ar in the 
 
`defaultRules.js`

example: 
```
<ValidateableForm  
    onSubmit={this.console}
    rules={{
        input1: {
            required: true,
            numbers: true
        },
        input2: {
            required: true,
            idCard: true
        }}}>
    <form ref="vForm">
        <label>Please input Numbers!</label>
        <input type="text" name="input1"/>
        <br/>
        <label>Please input a Chinese IdCard Number!</label>
        <input type="text" name="input2"/>
        <br/>
        <input type="submit"/>
    </form>
</ValidateableForm>
```

You may see the demo in the [demo.html](https://rawgit.com/0rangeT1ger/React-form-validator/master/source/index.html)