import React, {useEffect,useState,useContext} from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/api-hook";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";

import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import { VALIDATOR_REQUIRE } from "../../shared/util/validators";

import "./NewContact.css";

const UpdateContact = () => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [identifiedContact, setIdentifiedContact] = useState(null);
    const [sharedContact, setsharedContact] = useState(false);
    const auth = useContext(AuthContext);
    const contactId = useParams().cid;

     const [formState, inputHandler, setFormData] = useForm({
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

    useEffect(()=>{
        const request = async () =>{
            try{
                const {data} = await sendRequest(`/contact?where={"_id":"${contactId}"}`);
                const {contactName,contactNumber, contactPhoto, ownerId} = data[0];
                setFormData({
                            contactName:{
                                value: contactName,
                                isValid: true,
                            },
                            contactNumber:{
                                value: contactNumber,
                                isValid: true,
                            },
                            contactPhoto:{
                                value: contactPhoto,
                                isValid: true,
                            },
                }, true);
                setIdentifiedContact(data[0]);

                if(ownerId !== auth?.userId) setsharedContact(true);
            }catch(err){
        
            }
        }
        request();
    },[sendRequest, contactId, setFormData, auth?.userId]);

    
    const submitUpdateHandler = async event => {
        event.preventDefault();
        const {contactName,contactNumber,
            // contactPhoto
        } = formState?.inputs

       try{
            // const formData = new FormData();
            // formData.append('contactNumber',contactNumber.value);
            // formData.append('contactName',contactName.value);
            // formData.append('contactPhoto',contactPhoto.value);
            
            await sendRequest(`/contact/${contactId}`,'PATCH', JSON.stringify({
                contactName: contactName.value,
                contactNumber: contactNumber.value,
            }), {});

            history.push(`/`);
       }catch(err){}
    };

    const DeleteHandler = async event => {
        event.preventDefault();
        try{
            await sendRequest(`/contact/${contactId}`,'DELETE');

            history.push(`/`);
        }catch(err){}
    };

    const ShareHandler = async event => {
        event.preventDefault();
        try{
            history.push(`/contacts/share/${contactId}`);
            
        }catch(err){}
    };

    const CancelHandler = async event => {
        event.preventDefault();
        try{
            history.push(`/`);
        }catch(err){}
    };

    const UnShareContact = async event => {
        event.preventDefault();
        try{
            await sendRequest(`/contact/unshare/${contactId}/${auth?.userId}`,'PATCH');

            history.push(`/`);
        }catch(err){}
    };

    const {isValid} = formState; 

    if(isLoading){
        return (
            <div className="center">
                <LoadingSpinner asOverlay/>
            </div>
        );
    }

    return(
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
                 {!isLoading && identifiedContact &&
                    <form className="place-form" 
                    // onSubmit={submitUpdateHandler}
                    >
                        <ImageUpload center id="contactPhoto" onInput={inputHandler} initialValue={identifiedContact.contactPhoto} readOnly={sharedContact} />
                        <Input 
                        id="contactName"
                        element="input"
                        type="text"
                        label="Contact Name"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Field is required"
                        onInput={inputHandler}
                        initialValue={identifiedContact.contactName}
                        initialValid={true}
                        readOnly={sharedContact}
                        />

                        <Input 
                        id="contactNumber"
                        element="textarea"
                        label="Contact Number"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Field must be at least 5 characters."
                        onInput={inputHandler}
                        initialValue={identifiedContact.contactNumber}
                        initialValid={true}
                        readOnly={sharedContact}
                        />

                        {!sharedContact && <Button onClick={submitUpdateHandler} size="small" type="submit" disabled={!isValid}>Update</Button>}
                        {!sharedContact && <Button onClick={ShareHandler} size="small" warn>Share</Button>}
                        {!sharedContact && <Button onClick={DeleteHandler} size="small" danger>Delete</Button>}

                        {sharedContact && <Button onClick={UnShareContact} size="small" danger>Remove from Contacts</Button>}

                        <Button onClick={CancelHandler} size="small" danger>Back</Button>
                    </form>
                }
        </React.Fragment>
    );
};

export default UpdateContact;