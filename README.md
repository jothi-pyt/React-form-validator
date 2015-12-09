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
rules: {
     field1: {
         number: true,
         required: true
     },
     field2: {
         email: true,
         space: /\b/
     }
}
messages : {
    field1: {
        number: 'Please Input A Valid Number !',
        required: 'Please Input Field1 !'
    }
}
```

You may see the demo in the [demo.html](https://cdn.rawgit.com/0rangeT1ger/React-form-validator/tree/master/source/index.html)