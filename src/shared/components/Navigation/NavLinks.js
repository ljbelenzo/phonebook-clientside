import React, {useContext} from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";

import "./NavLinks.css";

const NavLinks = props => {
   const auth = useContext(AuthContext);
    return (
        <ul className="nav-links" >
      {auth?.role && (auth?.role === "admin" || auth?.role === "super-admin") && (
         <React.Fragment>
            <li>
               <NavLink to="/admin/users/new">New User</NavLink>
            </li>
            <li>
               <NavLink to="/admin/users">User Management</NavLink>
            </li>
        </React.Fragment>
       )}

        {auth.isLoggedIn && (
         <React.Fragment>
            <li>
               <NavLink to="/">Contacts</NavLink>
            </li>
            <li>
               <NavLink to="/contacts/new">New Contact</NavLink>
            </li>
            <li>
               <button onClick={auth.logout}>LOGOUT</button>
            </li>
         </React.Fragment>
         )}
       
    </ul>
    );
};

export default NavLinks;