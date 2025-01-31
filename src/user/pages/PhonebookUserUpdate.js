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

import "./PhonebookUserCreate.css";

const PhonebookUserUpdate = () => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [identifiedUser, setIdentifiedUser] = useState(null);
    const auth = useContext(AuthContext);
    const userId = useParams().uid;


    const [formState, inputHandler, setFormData] = useForm({
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
            contactPhoto:{
                value:null,
                isValid:false
            },
        }, false);

    const history = useHistory();

        useEffect(()=>{
            const request = async () =>{
                try{
                    const {data} = await sendRequest(`/user?where={"_id":"${userId}"}`);
                    const {firstName,lastName, contactNumber, email, contactPhoto} = data[0];
                    setFormData({
                                firstName:{
                                    value: firstName,
                                    isValid: true,
                                },
                                lastName:{
                                    value: lastName,
                                    isValid: true,
                                },
                                email:{
                                    value: email,
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
                    setIdentifiedUser(data[0]);
    
                }catch(err){
            
                }
            }
            request();
        },[sendRequest, setFormData, auth.userId, userId]);

        const updateUser = async event => {
            event.preventDefault();
            const {firstName, lastName, email, contactNumber, contactPhoto} = formState?.inputs;
    
           try{
                const formData = new FormData();
                formData.append('firstName',firstName.value);
                formData.append('lastName',lastName.value);
                formData.append('email',email.value);
                formData.append('contactNumber',contactNumber.value);
                formData.append('contactPhoto',contactPhoto.value);
                
                await sendRequest(`/user/${userId}`,'PATCH', formData, {});
    
                history.push(`/admin/users`);
           }catch(err){}
        };

        const CancelHandler = event => {
            event.preventDefault();
            try{
                history.push(`/admin/users`);
            }catch(err){}
        };

        const activateUser = async event => {
            event.preventDefault();
            await updateStatus("active",userId);
        };

        const deactivateUser = async event => {
            event.preventDefault();
            await updateStatus("deactivated",userId);
        };

        const updateStatus = async (status, userId) =>{
            try{
                const formData = new FormData();
                formData.append('status',status);
                await sendRequest(`/user/${userId}`,'PATCH',formData, {});
                history.push(`/admin/users`);
            }catch(err){}
        }

    return(
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {!isLoading && identifiedUser && 
                <form className="place-form" 
                // onSubmit={submitUpdateHandler}
                >
                    {isLoading && <LoadingSpinner asOverlay/>}
                    <ImageUpload center id="contactPhoto" onInput={inputHandler} initialValue={identifiedUser.contactPhoto}/>
                    <Input 
                        id="firstName"
                        element="input"
                        type="text"
                        label="First Name"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Field is required"
                        onInput={inputHandler}
                        initialValue={identifiedUser.firstName}
                        initialValid={true}
                    />
                    <Input 
                        id="lastName"
                        element="input"
                        type="text"
                        label="Last Name"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Field is required"
                        onInput={inputHandler}
                        initialValue={identifiedUser.lastName}
                        initialValid={true}
                    />
                    <Input 
                        id="email"
                        element="input"
                        type="text"
                        label="Email"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Field is required"
                        onInput={inputHandler}
                        initialValue={identifiedUser.email}
                        initialValid={true}
                    />

                    <Input 
                        id="contactNumber"
                        element="input"
                        type="text"
                        label="Contact"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Field is required"
                        onInput={inputHandler}
                        initialValue={identifiedUser.contactNumber}
                        initialValid={true}
                    />

                    <Button onClick={updateUser} size="small">Update</Button>
                    {identifiedUser.status !== "active" && <Button onClick={activateUser} size="small" inverse>Activate User</Button>}
                    {identifiedUser.status === "active" && <Button onClick={deactivateUser} size="small" danger>Deactivate User</Button>}
                    <Button onClick={CancelHandler} size="small" danger>Back</Button>
                </form>
            }
        </React.Fragment>
    );
};

export default PhonebookUserUpdate;