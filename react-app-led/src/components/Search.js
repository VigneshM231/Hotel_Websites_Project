import React from 'react';

const Search = ({ placeholder, value, onChange, onSearch }) => {
    return (
        <div className="mb-3 mt-3">
            <label className="form-label">Search:</label>
            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={onSearch}
                >
                    Search
                </button>
            </div>
        </div>
    );
}

export default Search;
