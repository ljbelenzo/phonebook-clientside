import React from "react";
import { useHistory } from "react-router-dom";
import Avatar from "../../shared/components/UIElements/Avatar";
import './ContactTable.css';

const serverHost = process.env?.REACT_APP_SERVER_CONNECTIVTY || "https://phonebook-serverside-production.up.railway.app";


const ContactTable = props => {
    const {id,contactName,contactNumber,contactPhoto} = props;
    const history = useHistory();

    const handleEvent = () => {
        history.push(`/contacts/${id}`);
    };

    return(
        <tr onClick={handleEvent}>
            <td className="image_td"><Avatar image={`${serverHost}/${contactPhoto}`} alt={contactPhoto}/></td>
            <td className="td_entry">{contactName}</td>
            <td className="td_entry">{contactNumber}</td>
        </tr>
    );
};

export default ContactTable;
