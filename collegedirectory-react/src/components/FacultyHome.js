// src/pages/FacultyHome.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import FacultyProfile from '../components/FacultyProfile'; // Adjust the import path as necessary
import FacultyStudentDatabase from '../components/FacultyStudentDatabase'; // Adjust the import path as necessary
import './FacultyHome.css'; // Import the CSS file

const FacultyHome = () => {
    const [selectedMenu, setSelectedMenu] = useState('facultyprofile'); 
    const navigate = useNavigate();

    const renderContent = () => {
        switch (selectedMenu) {
            case 'facultyprofile':
                return <FacultyProfile />; // Render the Faculty Profile component
            case 'studentdatabase':
                return <FacultyStudentDatabase />; // Render the Student Database component
            default:
                return <FacultyProfile />; // Default to the Faculty Profile
        } 
    };

    const handleLogout = () => {
        localStorage.removeItem('userId'); // Clear user ID on logout
        navigate('/'); // Redirect to the login page
    };

    return (
        <div className="faculty-home-container">
            {/* Left Pane */}
            <div className="faculty-left-pane">
                <ul>
                    <li onClick={() => setSelectedMenu('facultyprofile')}>Profile</li>
                    <li onClick={() => setSelectedMenu('studentdatabase')}>Student Database</li>
                </ul>
                <button onClick={handleLogout}>Logout</button>
            </div>

            {/* Right Pane */}
            <div className="faculty-right-pane">
                <h1>College Directory Management System</h1>
                {renderContent()}
            </div>
        </div>
    );
};

export default FacultyHome;
