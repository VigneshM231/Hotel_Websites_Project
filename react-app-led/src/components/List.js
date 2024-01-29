import React, { useState, useEffect } from 'react';
import axios from 'axios';

const List = ({ data ,searchTerm}) => {
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        setUserData(data);
    }, [data]);

    const handleDelete = async (name, id) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/userdelete/${name}/${id}`);
            // Refresh the data after deletion
            const result = await axios("http://127.0.0.1:5000/users/"+searchTerm);
            setUserData(result.data);
        } catch (err) {
            console.log("Delete failed", err);
        }
    }

    return (
        <div className="container">
            <h3>Hotel Details</h3>
            <div className="d-flex flex-wrap">
                {userData.map((user, i) => (
                    <div key={i} className="p-2">
                        {user.details && user.details.length > 0 && (
                            <div>
                                <img
                                    src={`http://127.0.0.1:5000/static/uploads/${user.name}/${user.details}`}
                                    alt={`Image for ${user.name}`}
                                    className="img-fluid img-bordered"
                                    style={{ width: '200px', height: 'auto' }}
                                />
                                <button onClick={() => handleDelete(user.name, user.id)} className="btn btn-danger mt-2">Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default List;
