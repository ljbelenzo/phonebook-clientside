import React from "react";
import { useHistory } from "react-router-dom";
import Avatar from "../../shared/components/UIElements/Avatar";
import './ContactTable.css';

const serverHost = "https://phonebook-serverside-production.up.railway.app";


const ContactTable = props => {
    const {id,contactFirstName,contactLastName,contactNumber,contactEmail,contactPhoto} = props;
    const history = useHistory();

    const handleEvent = () => {
        history.push(`/contacts/${id}`);
    };

    return(
        <tr onClick={handleEvent}>
            <td className="image_td"><Avatar image={`${serverHost}/${contactPhoto}`} alt={contactPhoto}/></td>
            <td className="td_entry">{contactFirstName}</td>
            <td className="td_entry">{contactLastName}</td>
            <td className="td_entry">{contactEmail}</td>
            <td className="td_entry">{contactNumber}</td>
        </tr>
    );
};

export default ContactTable;
