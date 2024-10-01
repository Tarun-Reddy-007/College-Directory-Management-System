// src/components/StudentSearch.js
import React, { useState, useEffect } from 'react';
import './StudentSearch.css'; // Importing the CSS file
import axios from 'axios';

const StudentSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [studentData, setStudentData] = useState([]); // Use state for student data

    // Fetch student data on component mount
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/users/getallstudents'); // Call your API function
                setStudentData(response.data); // Set the fetched data to state
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };

        fetchStudentData();
    }, []);

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value) {
            const filteredSuggestions = studentData.filter((student) =>
                student.name.toLowerCase().includes(value.toLowerCase()) ||
                student.email.toLowerCase().includes(value.toLowerCase()) ||
                student.username.toLowerCase().includes(value.toLowerCase()) ||
                student.phone.includes(value)
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    return (
        <div className="search-container">
            <h2 className="search-title">Search Section</h2>
            <p className="search-description">Search Students</p>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by name, email, username, or phone"
                    value={searchTerm}
                    onChange={handleChange}
                    className="search-input"
                />
                <div className="suggestions">
                    {suggestions.map((student, index) => (
                        <div key={index} className="suggestion-item">
                            <span className="suggestion-name">{student.name}</span>
                            <span className="suggestion-email"> {student.email}</span>
                            <span className="suggestion-username">{student.username}</span>
                            <span className="suggestion-phone">{student.phone}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentSearch;
