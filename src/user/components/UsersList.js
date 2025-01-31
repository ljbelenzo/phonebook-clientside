import React from 'react';

import UserTable from './UserTable';

import './UsersList.css';

const UsersList = props => {
    const { items } = props;

    return(
        <React.Fragment>
            <div className="center">
                <table>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Email</th>
                        <th>Status</th>
                    </tr>

                    {items.length > 0 && items.map(user=> (
                            <UserTable 
                                key={user.id} 
                                id={user.id} 
                                name={`${user.firstName} ${user.lastName}`} 
                                contact={user.contactNumber} 
                                email={user.email} 
                                status={user.status}
                                userImage={user.contactPhoto}
                            />
                        ))
                    }

                    {items.length === 0 &&
                        <tr>
                            <td colSpan="5"> <div className='center'>Data Empty</div> </td>
                        </tr>
                    }

                    
                </table>
            </div>
        </React.Fragment>
    );
};

export default UsersList;