import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Edit = () => {
    const { hotel } = useParams();
    console.log(hotel)
    const navigate = useNavigate();

    const [userField, setUserField] = useState({});



    const changeUserFieldHandler = (e) => {
        setUserField({
            ...userField,
            [e.target.name]: e.target.value
        });
    }

    const onSubmitChange = async (e) => {
        e.preventDefault();
        console.log(userField)
        try {
            await axios.put(`http://127.0.0.1:5000/userupdate/${hotel}`, userField);
            navigate('/');
        } catch (err) {
            console.log("Something went wrong");
        }
    }

    return (
        <div className="container">
            <h1>Edit Form</h1>
            <form>
                <div className="mb-3 mt-3">
                    <label className="form-label"> Full Name:</label>
                    <input type="text" className="form-control" placeholder="Enter Your Full Name" name="new_name" value={userField.name} onChange={e => changeUserFieldHandler(e)} />
                </div>
                <button type="submit" className="btn btn-primary" onClick={e => onSubmitChange(e)}>Update</button>
            </form>
            <div className='container d-flex justify-content-center'>
                <button className='btn btn-primary' onClick={() => navigate('/')}>Back To Home</button>
            </div>
        </div>
    );
};

export default Edit;
