import React, { useReducer, useEffect } from "react";

// useEffect allows us to run a logic when some dependencies change,
// we can use it to run something off first render
// but we can also use it to runs a logic when dependencies change

import { validate } from "../../util/validators";
import "./Input.css"

const inputReducer = (state,action) => {
    const {type,val,validators} = action;

    switch(type){
        case 'CHANGE':
            return {
                ...state,
                value: val,
                isValid: validate(val,validators),
            };
        case 'TOUCH':
            return {
                ...state,
                isTouched: true,
            };
        default:
            return state;
    };
};

const Input = props => {
    // object destructuring 
    const {id,label,element,type,placeholder,rows,errorText,validators, onInput,initialValue:propsInitialValue, initialValid, readOnly} = props;

    //useReducer can be used if you have to manage complex/multiple states etc.
   const [inputState,dispatch] = useReducer(inputReducer, 
    {
        value: propsInitialValue || '', 
        isValid: initialValid || false, 
        isTouched: false
    });

   const { value, isValid, isTouched } = inputState;

   useEffect(()=>{
    onInput(id, value, isValid);
   }, [id, value, isValid, onInput]);

    const changeHandler = event => {
        const {target} = event;
        dispatch({
            type: 'CHANGE',
            val: target.value,
            validators,
        });

    };

    const touchHandler = () => {
        dispatch({
            type: 'TOUCH'
        });
    };

    const elements = element === 'input' ? <input
    id={id}
    type={type}
    placeholder={placeholder}
    onChange={changeHandler} 
    onBlur={touchHandler}
    value={value}
    readOnly={readOnly}
    /> : <textarea 
        id={id} 
        rows={rows || 3}
        onChange={changeHandler} 
        onBlur={touchHandler}
        value={value}
    readOnly={readOnly}
    /> ;

    return (
        <div className={`form-control ${!isValid && isTouched && 'form-control--invalid'}`}>
            <label htmlFor={id}>{label}</label>
            {elements}
            {!isValid && isTouched && <p>{errorText}</p>}
        </div>
    )
};

export default Input;