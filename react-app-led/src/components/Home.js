import React, { useState, useEffect } from 'react';
import List from './List';
import Search from './Search';
import axios from 'axios';
import { Link } from 'react-router-dom'; //EDIT.JS

const Home = () => {

    const [userField, setUserField] = useState({
        name: "",
        details: [],
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [allHotels, setAllHotels] = useState([]);

    useEffect(() => {
        fetchAllHotels();
    }, []);

    const fetchAllHotels = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/users");
            const uniqueHotels = Array.from(new Set(response.data.map(user => user.name)));
            setAllHotels(uniqueHotels);
        } catch (err) {
            console.log("Error fetching hotels", err);
        }
    };

    const changeUserFieldHandler = (e) => {
        setUserField({
            ...userField,
            [e.target.name]: e.target.value
        });
    };

    const handleChange = (e) => {
        const selectedImages = e.target.files;
        setUserField({
            ...userField,
            details: selectedImages,
        });
    };

    const onSubmitChange = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", userField.name);

            if (userField.details && userField.details.length > 0) {
                for (let i = 0; i < userField.details.length; i++) {
                    formData.append("details", userField.details[i]);
                }
            }

            const response = await axios.post("http://127.0.0.1:5000/newuser", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(response);

            // Display success message
            window.alert('Hotel added successfully!');
            
            // Refetch the data after adding a new user
            handleSearch();

            // Refresh the page
            window.location.reload();
        } catch (err) {
            // Display error message
            console.log("Something went wrong", err);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/users/${searchTerm}`);
            setSearchResults(response.data);
        } catch (err) {
            console.log("Something went wrong", err);
        }
    };

    const navigateToHome = () => {
        window.location.reload();
    };

    return (
        <div className="container">
            <h2 className='w-100 d-flex justify-content-center p-3'>Hotels Categories</h2>
            <div className='row'>
                <div className='col-md-3'>
                    <h3>Add Hotel Detail</h3>
                    <form>
                        <div className="mb-3 mt-3">
                            <label className="form-label"> Hotel Name:</label>
                            <input type="text" className="form-control" id="name" placeholder="Enter Your Full Name" name="name" onChange={e => changeUserFieldHandler(e)} />
                        </div>
                        <div className="mb-3 mt-3">
                            <div className="card-body">
                                <div className="form-group py-2">
                                    <label htmlFor="images">Images</label>
                                    <input
                                        type="file"
                                        name="details"
                                        onChange={handleChange}
                                        multiple
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" onClick={e => onSubmitChange(e)}>Add Hotel</button>

                        {/* Display all available hotels in a table */}
                        <div className="mt-3">
                            <h4>All Available Hotels:</h4>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Hotel Name</th>
                                        <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allHotels.map((hotel, index) => (
                                        <tr key={index}>
                                            <td>{hotel}</td>
                                            <td>
                                                <Link to={`/edit/${hotel}`} className="btn btn-info">Edit</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </form>
                </div>
                <div className='col-md-9'>
                    <Search
                        placeholder="Enter your search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onSearch={handleSearch}
                    />
                    <List data={searchResults} searchTerm={searchTerm} />
                </div>
            </div>

        </div>
    );
};

export default Home;
