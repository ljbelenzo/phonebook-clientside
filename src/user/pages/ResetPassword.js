import React, {useState} from "react";

import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/api-hook";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";

import { VALIDATOR_REQUIRE } from "../../shared/util/validators";

import "./Auth.css"

const ResetPassword = () => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [notMatchedFlag, setNotMatchedFlag] = useState(false);
    const history = useHistory();
    const userId = useParams().uid;

        const [formState, inputHandler] = useForm({
               password: {
                    value: '',
                    isValid: false,
                },
                confirmPassword: {
                    value: '',
                    isValid: false,
                },
        }, false);

    const ResetPasswordHandler = async event => {
        event.preventDefault();
        setNotMatchedFlag(false);

        try{
            const {password, confirmPassword} = formState?.inputs

            if(password.value !== confirmPassword.value){
                setNotMatchedFlag(true);
            }else{
                await sendRequest(`/user/password/reset/${userId}`,'PATCH', JSON.stringify({
                    password: password.value,
                }), {});

                history.push(`/auth`);
            }
            setTimeout(()=>{
                setNotMatchedFlag(false);
            }, 2000);
        }catch(err){

        }
    };


    return(
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {isLoading && <LoadingSpinner asOverlay/>}
            <form className="place-form" onSubmit={ResetPasswordHandler}>
                    <Input
                        id="password"
                        type="password" 
                        label="Password"
                        element="input"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Password Is Required"
                        onInput={inputHandler}
                    />
                    <Input
                        id="confirmPassword"
                        type="password" 
                        label="Confirm Password"
                        element="input"
                        validators={[]}
                        errorText=""
                        onInput={inputHandler}
                    />
                    <Button size="small" type="submit" danger >Reset Password</Button>
                    {notMatchedFlag && <h4>Password Does not Match</h4>}
                </form>
        </React.Fragment>
    );
};

export default ResetPassword;