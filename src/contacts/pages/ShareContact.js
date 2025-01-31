import React, {useState} from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/api-hook";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";

import { VALIDATOR_EMAIL } from "../../shared/util/validators";

import "./NewContact.css";

const UpdateContact = () => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [notFoundFlag, setNotFoundFlag] = useState(false);
    const history = useHistory();
    const contactId = useParams().cid;

    const [formState, inputHandler] = useForm({
           email: {
                value: '',
                isValid: false,
            },
    }, false);

    const shareHandler = async event => {
        event.preventDefault();
        const {email} = formState?.inputs
        setNotFoundFlag(false);

      try{
        const {count,data} = await sendRequest(`/user?where={"email":"${email.value}"}`);

        if(count > 0 || count){
            const userId = data[0]?.id || undefined;    
            
            await sendRequest(`/contact/share/${contactId}/${userId}`,'PATCH');

            history.push('/');
        }else{
            setNotFoundFlag(true);
        }

        setTimeout(()=>{
            setNotFoundFlag(false);
        }, 2000);


      }catch(err){

      }
    };

    return(
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {isLoading && <LoadingSpinner asOverlay/>}
                <form className="place-form" onSubmit={shareHandler}>
                    <Input
                        id="email"
                        type="text" 
                        label="Enter Email"
                        element="input"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Valid Email needed"
                        onInput={inputHandler}
                    />
                    <Button size="small" type="submit" >Share</Button>
                    {notFoundFlag && <h4>User not found</h4>}
                </form>
        </React.Fragment>
    );
};

export default UpdateContact;