import React, {useEffect,useState} from 'react';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from "../../shared/hooks/api-hook";

import ContactList from '../components/ContactList';

const Contacts =  () => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedContacts, setLoadedContacts] = useState();    

    useEffect(()=>{
        const request = async () =>{
            try{
                const {data} = await sendRequest('/user/contact');
    
                setLoadedContacts(data);
            }catch(err){
                
            }
        };
        request();
       },[sendRequest]);

    return(
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <div className="center"> <LoadingSpinner /> </div>}
            {!isLoading && loadedContacts && <ContactList items={loadedContacts} /> }
        </React.Fragment>
    );
};
export default Contacts;