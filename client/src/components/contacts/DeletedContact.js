import React, { useState, useEffect } from "react";
import DeleteContactItems from "./DeleteContactItem";

const DeletedContact = () => {
    const [deletedContacts, setDeletedContacts] = useState([]);

    // Fetch deleted contacts from localStorage when the component mounts
    useEffect(() => {
        const fetchDeletedContacts = () => {
            const storedDeletedContacts = localStorage.getItem('deletedContacts');
            if (storedDeletedContacts) {
                setDeletedContacts(JSON.parse(storedDeletedContacts));
            }
        };

        // Fetch deleted contacts when the component mounts
        fetchDeletedContacts();

        // Set up an interval to keep checking for changes in localStorage
        const interval = setInterval(fetchDeletedContacts, 1000); // Check every 1 second

        // Clean up the interval on component unmount
        return () => clearInterval(interval);
    }, []);

    if (deletedContacts.length === 0) {
        return <h4>No deleted contacts found</h4>;
    }

    return (
        <div>
            <h1>Deleted Contacts</h1>
            {deletedContacts.map(contact => (
                <DeleteContactItems key={contact._id} contact={contact} />
            ))}
        </div>
    );
};

export default DeletedContact;
