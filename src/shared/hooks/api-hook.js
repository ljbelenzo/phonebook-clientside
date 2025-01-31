import { useState, useCallback, useRef, useEffect,useContext } from "react";
import { AuthContext } from "../context/auth-context";

const serverHost = "https://phonebook-serverside-production.up.railway.app";

const ExemptedAuthEndpoints = [];

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const auth = useContext(AuthContext);

    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(async (url, method='GET', body=null, headers) => {
        setIsLoading(true);
        const httpAbortControll = new AbortController();
        activeHttpRequests.current.push(httpAbortControll);

        let authHeader = {'authorization':`Bearer ${auth?.token}`};

        if(ExemptedAuthEndpoints.includes(url)) authHeader = undefined;

        if(!(body instanceof FormData)) headers = {...headers, 'Content-Type':'application/json'};

        try{
        console.log("error:", `${method} ${body} ${serverHost}${url}`);

            const response = await fetch(`${serverHost}${url}`, {
                method,
                body,
                headers: {...authHeader,...headers},
                // signal: httpAbortControll.signal,
            });


            const resData = await response.json();

            activeHttpRequests.current = activeHttpRequests.current.filter(
                reqCtrl => reqCtrl!==httpAbortControll
            );

            if(!response.ok){
                throw new Error(resData?.message);
            };

             setIsLoading(false);
            return resData;
       }catch(err){
        console.log("error:", err);
        setIsLoading(false);
        setError(err?.message || "Something went wrong with Http Client");
        throw err;
       }
    },[auth.token]);

    const clearError = () => setError(null);

    useEffect(()=>{
        return ()=>{
            // eslint-disable-next-line react-hooks/exhaustive-deps
            activeHttpRequests.current.forEach(abortCtrl=>abortCtrl.abort());
        };
    },[]);

    return {isLoading, error, sendRequest, clearError};
};