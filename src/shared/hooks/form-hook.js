import { useCallback, useReducer } from "react";

const formReducer = (state,action) => {
    const {type, isValid, value, inputId:actionInputId} = action;
    const {inputs} = state;
    switch(type){
        case 'INPUT_CHANGE': 
        let formIsValid = true;
        for(const inputId in inputs ){
            if(!inputs[inputId]){ continue; }
            if(inputId === actionInputId){
                formIsValid = formIsValid && isValid;
            }else {
                formIsValid = formIsValid && inputs[inputId].isValid;
            }
        }
            return {
                ...state,
                inputs: {
                    ...inputs,
                    [actionInputId]: {value, isValid}
                },
                isValid: formIsValid,
            };
        
        case 'SET_DATA': 
        return {
            inputs: action.inputs,
            isValid: action.formIsValid
        }
        default:
        return state;
    }
};

export const useForm = (initialInputs, initialFormValidity) => {
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialFormValidity
    });

    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({type: 'INPUT_CHANGE', value, isValid, inputId:id})
    },[]);

    const setFormData = useCallback((inputData,formValidity)=>{
        dispatch({
            type: 'SET_DATA',
            inputs: inputData,
            formIsValid: formValidity,
        });
    },[]);

    return [formState, inputHandler, setFormData];
};