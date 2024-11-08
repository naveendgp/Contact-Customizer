import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import ContactContext from '../../context/contact/contactContext';

const DeleteContactItems = ({ contact }) => {
    const contactContext = useContext(ContactContext);
    const { deleteContact, setCurrent, clearCurrent } = contactContext;

    const { _id, name, email, phone, type } = contact;

    // Initialize deletedContacts in localStorage if it doesn't exist
    useEffect(() => {
        if (!localStorage.getItem('deletedContacts')) {
            localStorage.setItem('deletedContacts', JSON.stringify([])); // Initialize as empty array
        }
    }, []); // Empty dependency array ensures this runs once on component mount

    const onDelete = () => {
        // Delete the contact from the context (state)
        deleteContact(_id);
        clearCurrent();

        // Retrieve existing deleted contacts from localStorage
        let deletedContacts = JSON.parse(localStorage.getItem('deletedContacts')) || [];

        // Add the current contact to the deleted contacts array
        deletedContacts.push(contact);

        // Store the updated deleted contacts array in localStorage
        localStorage.setItem('deletedContacts', JSON.stringify(deletedContacts));
    };

    return (
        <div className='card bg-light'>
            <h3 className='text-primary text-left'>
                {name}{' '}
                <span
                    style={{ float: 'right' }}
                    className={
                        'badge ' +
                        (type === 'professional' ? 'badge-success' : 'badge-primary')
                    }
                >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
            </h3>
            <ul className='list'>
                {email && (
                    <li>
                        <i className='fas fa-envelope-open' /> {email}
                    </li>
                )}
                {phone && (
                    <li>
                        <i className='fas fa-phone' /> {phone}
                    </li>
                )}
            </ul>
            
        </div>
    );
};

DeleteContactItems.propTypes = {
    contact: PropTypes.object.isRequired
};

export default DeleteContactItems;
