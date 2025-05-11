import React, { useState } from 'react';
import './SearchBar.css';
// import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ searching, setSearching }) => {
    const [query, setQuery] = useState('');
    const [field, setField] = useState('all');

    const handleSubmit = (e) => {
        e.preventDefault();
        // onSearch({ query, field });
        const updateSearch ={
            searchText: query,
            searchField: field
        }
        setSearching(updateSearch);
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <div className="search-input-wrapper">
                {/* <FiSearch className="search-icon" /> */}
                <i className="bi bi-search search-icon"></i>
                <input
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <select value={field} onChange={(e) => setField(e.target.value)}>
                <option value="all">All Fields</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="locality">Locality</option>
                {/* <option value="experience">Year of Experience</option>
                <option value="salary">Salary</option> */}
            </select>

            <button type="submit">Search</button>
        </form>
    );
};

export default SearchBar;
