import React from "react";
import { useHistory } from "react-router-dom";
import Avatar from "../../shared/components/UIElements/Avatar";

import './UserTable.css';

const serverHost = "https://phonebook-serverside-production.up.railway.app";

const UserTable = props => {
    const {id,name,contact,email,status,userImage} = props;
    const history = useHistory();

    const handleEvent = () => {
        history.push(`/admin/users/${id}`);
    };

    return(
        <tr onClick={handleEvent}>
            <td className="image_td"><Avatar image={`${serverHost}/${userImage}`} alt={userImage}/></td>
            <td className="td_entry">{name}</td>
            <td className="td_entry">{contact}</td>
            <td className="td_entry">{email}</td>
            <td className="td_entry">{status}</td>
        </tr>
    );
};

export default UserTable;