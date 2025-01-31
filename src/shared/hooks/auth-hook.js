import {useState, useCallback, useEffect} from 'react';

let logoutTimer;

export const useAuth = () => {
    const [userId, setUserId] = useState(null);
    const [tokenExpDate, setTokenExpDate] = useState(null);
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    
    const login = useCallback((uid, token, role, expDate) => {
      const tokenExp = expDate || new Date(new Date().getTime() + 1000 * 60 * 60);
  
      setTokenExpDate(tokenExp)
      setUserId(uid);
      setToken(token);
      setRole(role);
      
      // store in page localstorage token, expDate and userId
      localStorage.setItem('userData', JSON.stringify({
        userId: uid,
        token,
        role,
        exp: tokenExp.toISOString()
      }))
    }, []);
  
    const logout = useCallback(() => {
      setTokenExpDate(null)
      setUserId(null);
      setToken(null);
      localStorage.removeItem('userData');
    }, []);
  
    useEffect(()=>{
      if(token && tokenExpDate){
        const remTime = tokenExpDate.getTime() - new Date().getTime();
        logoutTimer = setTimeout(logout, remTime);
      }else{
        clearTimeout(logoutTimer);
      }
    },[logout,token,tokenExpDate]);
  
    useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem('userData'));
      const { token, userId, role, exp } = storedData || {};
      if(storedData && token && new Date(exp) > new Date()){
        login(userId, token, role, new Date(exp));
      }
    },[login]);

    return {token, login, logout, userId, role};
};