import React  from "react";

import { useHistory } from "react-router-dom";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/api-hook";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";

import { VALIDATOR_REQUIRE,VALIDATOR_EMAIL } from "../../shared/util/validators";

import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import "./PhonebookUserCreate.css";

const PhonebookUserCreate = () => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

     const [formState, inputHandler] = useForm({
            firstName: {
                value: '',
                isValid: false,
            },
            lastName: {
                value: '',
                isValid: false,
            },
            contactNumber: {
                value: '',
                isValid: false,
            },
            email: {
                value: '',
                isValid: false,
            },
            password: {
                value: '',
                isValid: false,
            },
            contactPhoto:{
                value:null,
                isValid:false
            },
        }, false);

        const history = useHistory();

        const submitHandler = async event => {
            event.preventDefault();
            const {firstName,lastName,contactNumber,email,password,contactPhoto} = formState?.inputs
    
          try{
            const formData = new FormData();
            formData.append('firstName', firstName.value);
            formData.append('lastName', lastName.value);
            formData.append('contactNumber', contactNumber.value);
            formData.append('email', email.value);
            formData.append('password', password.value);
            formData.append('contactPhoto', contactPhoto.value);

            await sendRequest('/user','POST',JSON.stringify({
                firstName: firstName.value,
                lastName: lastName.value,
                contactNumber: contactNumber.value,
                email: email.value,
                password: password.value,
            }),{});
    
            history.push('/admin/users');
          }catch(err){
    
          }
        };

    return(
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            <form className="place-form" onSubmit={submitHandler}>
                {isLoading && <LoadingSpinner asOverlay/>}
                <ImageUpload center id="contactPhoto" onInput={inputHandler} errorText="Contact Photo is needed" />
                <Input
                    id="firstName"
                    type="text" 
                    label="First Name"
                    element="input"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Field must not be empty."
                    onInput={inputHandler}
                />
                <Input
                    id="lastName"
                    type="text" 
                    label="Last Name"
                    element="input"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Field must not be empty."
                    onInput={inputHandler}
                />
                 <Input
                    id="email"
                    type="text" 
                    label="User Email"
                    element="input"
                    validators={[VALIDATOR_EMAIL()]}
                    errorText="Valid Email required"
                    onInput={inputHandler}
                />
                 <Input
                    id="password"
                    type="password" 
                    label="User Password"
                    element="input"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Field must not be empty."
                    onInput={inputHandler}
                />
                <Input
                    id="contactNumber"
                    type="text" 
                    label="Contact"
                    element="input"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Field must not be empty."
                    onInput={inputHandler}
                />
                <Button size="small" type="submit" disabled={!formState.isValid}>Create User</Button>
            </form>
        </React.Fragment>
    );
};

export default PhonebookUserCreate;