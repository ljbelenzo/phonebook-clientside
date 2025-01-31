import React from "react";

import { useHistory } from "react-router-dom";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/api-hook";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";

import { VALIDATOR_REQUIRE } from "../../shared/util/validators";

import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import "./NewContact.css";

const NewContact = () => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
   
    const [formState, inputHandler] = useForm({
        contactName: {
            value: '',
            isValid: false,
        },
        contactNumber: {
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
        const {contactName,contactNumber,
            // contactPhoto
        } = formState?.inputs

      try{
        // const formData = new FormData();
        // formData.append('contactName', contactName.value);
        // formData.append('contactNumber', contactNumber.value);
        // formData.append('contactPhoto', contactPhoto.value);

        await sendRequest('/contact','POST',JSON.stringify({
            contactName: contactName.value,
            contactNumber: contactNumber.value,
    }   ),{});

        history.push('/');
      }catch(err){

      }
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            <form className="place-form" onSubmit={submitHandler}>
                {isLoading && <LoadingSpinner asOverlay/>}
                <ImageUpload center id="contactPhoto" onInput={inputHandler} errorText="Contact Photo is needed" />
                <Input
                    id="contactName"
                    type="text" 
                    label="Contact Name"
                    element="input"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Field must not be empty."
                    onInput={inputHandler}
                />
                <Input
                    id="contactNumber"
                    type="text" 
                    label="Contact Number"
                    element="input"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Field must not be empty."
                    onInput={inputHandler}
                />
                <Button size="small" type="submit" disabled={!formState.isValid}>Add Contact</Button>
            </form>
        </React.Fragment>
    )
};

export default NewContact;