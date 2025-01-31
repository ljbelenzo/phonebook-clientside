import React from 'react';

import ContactTable from './ContactTable';

import './ContactList.css';

const ContactList = props => {
    const { items } = props;

    

    return (
        <React.Fragment>
            <div className="center">
                <table>
                    <tr>
                        <th></th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Number</th>
                    </tr>

                    {items.length > 0 && items.map(contacts=> (
                            <ContactTable 
                                key={contacts.id} 
                                id={contacts.id} 
                                ownerId={contacts.ownerId} 
                                contactFirstName={contacts.contactFirstName} 
                                contactLastName={contacts.contactLastName} 
                                contactEmail={contacts.contactEmail} 
                                contactNumber={contacts.contactNumber} 
                                contactPhoto={contacts.contactPhoto}
                                shared={contacts.shared || false} 
                            />
                        ))
                    }

                    {items.length === 0 &&
                        <tr>
                            <td colSpan="5"> <div className='center'>Phonebook Empty</div> </td>
                        </tr>
                    }
                </table>
             </div>
        </React.Fragment>
    );
};

export default ContactList;