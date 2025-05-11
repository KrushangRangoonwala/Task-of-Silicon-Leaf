import React, { useState } from 'react';
import './Filter.css';

const Filter = ({ filter, setFilter, setisFilterApplyClicked }) => {
    //   const [filter, setFilter] = useState({
    //     gender: '',
    //     isPermanent: '',
    //     yearOfExperience: { start: '', end: '' },
    //     salary: { start: '', end: '' },
    //   });
    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('yearOfExperience')) {
            const field = name.split('.')[1];
            setFilter(prev => ({
                ...prev,
                yearOfExperience: { ...prev.yearOfExperience, [field]: value },
            }));
        } else if (name.includes('salary')) {
            const field = name.split('.')[1];
            setFilter(prev => ({
                ...prev,
                salary: { ...prev.salary, [field]: value },
            }));
        } else {
            setFilter(prev => ({
                ...prev,
                [name]: value,
            }));
        }

        // onFilterChange?.(filter); // Optional callback
    };

    function applyFilter() {
        setisFilterApplyClicked(true);
    }

    function clearFilter() {
        setFilter({
            gender: '',
            isPermanent: '',
            // skills: [],
            yearOfExperience: {
                start: '',
                end: '',
            },
            salary: {
                start: '',
                end: '',
            },
        })
    }

    return (
        <div className="filter-container">
            <span onClick={() => setIsOpen(!isOpen)} className='filterTitle'>
                {isOpen ? <i className="bi bi-chevron-up filterToggleIcon"></i> : <i className="bi bi-chevron-down filterToggleIcon"></i>}
                {' '}Filters {' '}<span><i className="bi bi-filter"></i></span></span>


            {isOpen && (
                <div className="filter-columns">
                    {/* Left Column */}
                    <div className="filter-column">
                        {/* Gender Filter */}
                        <div className="filter-group">
                            <label className="filter-label">Gender:</label>
                            <div className="radio-group">
                                <label><input type="radio" name="gender" value="Male" checked={filter.gender === 'Male'} onChange={handleChange} /> Male</label>
                                <label><input type="radio" name="gender" value="Female" checked={filter.gender === 'Female'} onChange={handleChange} /> Female</label>
                            </div>
                        </div>

                        {/* Employment Type */}
                        <div className="filter-group">
                            <label className="filter-label">Employment Type:</label>
                            <div className="radio-group">
                                <label><input type="radio" name="isPermanent" value="true" checked={filter.isPermanent === 'true'} onChange={handleChange} /> Permanent</label>
                                <label><input type="radio" name="isPermanent" value="false" checked={filter.isPermanent === 'false'} onChange={handleChange} /> Temporary</label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="filter-column">
                        {/* Year of Experience */}
                        <div className="filter-group">
                            <label className="filter-label">Year of Experience:</label>
                            <div className="range-group">
                                <input type="number" name="yearOfExperience.start" placeholder="Start" value={filter.yearOfExperience.start} onChange={handleChange} />
                                <span>to</span>
                                <input type="number" name="yearOfExperience.end" placeholder="End" value={filter.yearOfExperience.end} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Salary */}
                        <div className="filter-group">
                            <label className="filter-label">Salary (₹):</label>
                            <div className="range-group">
                                <input type="number" name="salary.start" placeholder="Min" value={filter.salary.start} onChange={handleChange} />
                                <span>to</span>
                                <input type="number" name="salary.end" placeholder="Max" value={filter.salary.end} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="filter-actions">
                            <button className="btn-clear" onClick={clearFilter}>
                                Clear
                            </button>
                            <button className="btn-apply" onClick={applyFilter}>
                                Apply
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default Filter;
