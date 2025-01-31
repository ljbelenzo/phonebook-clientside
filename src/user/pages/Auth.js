import React, {useState,useContext} from "react";
import { useHttpClient } from "../../shared/hooks/api-hook";
import { useHistory } from "react-router-dom";

import { useForm } from "../../shared/hooks/form-hook";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { VALIDATOR_EMAIL } from "../../shared/util/validators";

import { AuthContext } from "../../shared/context/auth-context";

import "./Auth.css"

const Auth = () => {
    const auth = useContext(AuthContext);
    const history = useHistory();
    const [isLogin, setIsLogin] =useState(true);
    const [forgotPassword, setforgotPassword] = useState(false);
    const [notFoundFlag, setNotFoundFlag] = useState(false);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [formState, inputHandler] = useForm({
        email: {
            value: '',
            isvalid: false,
        },
        password: {
            value: '',
            isvalid: false,
        }
    }, false);

    const {isValid} = formState;

    const autheSubmitHandler = async event => {
        event.preventDefault();
        const {email,password} = formState?.inputs;

        try{
            const response = await sendRequest('/user/login','POST',
                JSON.stringify({
                    email: email.value,
                    password: password.value,
            }));

            successLogin(response?.data?.id,response?.data?.role,response?.data?.token);
        }catch(err){

        }
    };

    const switchModeHandler = () => {
        if(!isLogin){
            setforgotPassword(true);
        }else {
            setforgotPassword(false);
        }
        setIsLogin(prevMode => !prevMode);
    };

    const successLogin = (userId,role,token) => {
        auth.login(userId,token,role);
    }

    const confirmEmail = async event => {
        event.preventDefault();
        setNotFoundFlag(false);

        try{
            const {email} = formState?.inputs;

            const response = await sendRequest(`/user/email/${email?.value || null}`,'GET');

            if(!response.data){
                setNotFoundFlag(true);
            };

            if(response.data){
                history.push(`/password/reset/${response.data}`);
            }

            setTimeout(()=>{
                setNotFoundFlag(false);
            }, 2000);

        }catch(err){
                    
        }
    };

    return(
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay/>}
                <h2>{forgotPassword? "Forgot Password":"Login"}</h2>
                <hr/>
                <form onSubmit={autheSubmitHandler}>
                    <Input 
                    id="email"
                    element="input"
                    type="email"
                    label="E-mail"
                    validators={[VALIDATOR_EMAIL()]}
                    errorText="valid Email required"
                    onInput={inputHandler}
                    />
                    {!forgotPassword && <Input 
                    id="password"
                    element="input"
                    type="password"
                    label="Password"
                    validators={[]}
                    onInput={inputHandler}
                    />}
                    {!forgotPassword && <Button size="small" type="submit" disabled={!isValid}> Login </Button>}
                </form>
                {forgotPassword && <Button size="small" onClick={confirmEmail} > Confirm Email </Button>}
                <Button size="small" inverse onClick={switchModeHandler}> {!forgotPassword? "Forgot Password" : "Login"} </Button>
                {notFoundFlag && <h4>Email not found</h4>}
            </Card>
        </React.Fragment>
    );
};

export default Auth;