import React, {Suspense} from 'react';
import { BrowserRouter as Router, 
  Route, 
  Redirect, 
  Switch 
} from 'react-router-dom'
import MainNavigation from './shared/components/Navigation/MainNavigation';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';
import { useAuth } from './shared/hooks/auth-hook';
import { AuthContext } from './shared/context/auth-context';

// import './App.css'

const Auth = React.lazy(()=>import('./user/pages/Auth'));
const ResetPassword = React.lazy(()=>import('./user/pages/ResetPassword'));
const Contacts = React.lazy(()=>import('./contacts/pages/Contacts'));
const NewContact = React.lazy(()=>import('./contacts/pages/NewContact'));
const UpdateContact = React.lazy(()=>import('./contacts/pages/UpdateContact'));
const ShareContact = React.lazy(()=>import('./contacts/pages/ShareContact'));

const PhonebookUsers = React.lazy(()=>import('./user/pages/PhonebookUsers'));
const PhonebookUserUpdate = React.lazy(()=>import('./user/pages/PhonebookUserUpdate'));
const PhonebookUserCreate = React.lazy(()=>import('./user/pages/PhonebookUserCreate'));

const App = () => {
  const {token, userId, login, logout, role} = useAuth();

  let routes;

  if(token){
    routes = (
    <Switch>

      <Route path="/" exact>
       <Contacts />
      </Route>

      <Route path="/contacts/new" exact>
       <NewContact />
      </Route>

      <Route path="/contacts/:cid" exact>
       <UpdateContact />
      </Route>

      <Route path="/contacts/share/:cid" exact>
       <ShareContact />
      </Route>

      <Route path="/admin/users" exact>
       <PhonebookUsers />
      </Route>

      <Route path="/admin/users/new" exact>
       <PhonebookUserCreate />
      </Route>

      <Route path="/admin/users/:uid" exact>
       <PhonebookUserUpdate />
      </Route>

      

      <Redirect to="/" />
    </Switch>
    );
  }else{
    routes = (
      <React.Fragment>
          <Route path="/password/reset/:uid" exact>
              <ResetPassword />
          </Route>

          <Route path="/auth" exact>
              <Auth/>
          </Route>

          <Redirect to="/auth" />
      </React.Fragment>
    );
  }



  return (
    <AuthContext.Provider value={{isLoggedIn:!!token, userId, token, login, logout, role}}>
      <Router>
        <MainNavigation />
         <main>
          <Suspense fallback={<div className='center'>
            <LoadingSpinner/>
          </div>}>{routes}</Suspense>
         </main>
      </Router>
     </AuthContext.Provider>
  );
};

export default App;
