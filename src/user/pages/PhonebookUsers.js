import React, {useEffect,useState} from 'react';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from "../../shared/hooks/api-hook";

import UsersList from '../components/UsersList';

const PhonebookUsers = () => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState();   

        useEffect(()=>{
            const request = async () =>{
                try{
                    const {data} = await sendRequest('/user?where={"role":"user"}');
        
                    setLoadedUsers(data);
                }catch(err){
                    
                }
            };
            request();
        },[sendRequest]);

        return(
            <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <div className="center"> <LoadingSpinner /> </div>}
            {!isLoading && loadedUsers && <UsersList items={loadedUsers} /> }

            </React.Fragment>
        );
};

export default PhonebookUsers;
