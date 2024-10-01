// src/pages/StudentHome.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import StudentProfile from '../components/StudentProfile';
import StudentAcademics from '../components/StudentAcademics';
import StudentSearch from '../components/StudentSearch';
import './StudentHome.css'; // Import the CSS file

const StudentHome = () => {
    const [selectedMenu, setSelectedMenu] = useState('studentprofile'); 
    const navigate = useNavigate();

    const renderContent = () => {
        switch (selectedMenu) {
            case 'studentprofile':
                return <StudentProfile />;
            case 'studentacademics':
                return <StudentAcademics />;
            case 'studentsearch':
                return <StudentSearch />;
            default:
                return <StudentProfile />;
        } 
    };
    const handleLogout = () => {
        localStorage.removeItem('userId'); // Clear user ID on logout
        navigate('/'); // Redirect to the login page
    };

    return (
        <div className="student-home-container">
            {/* Left Pane */}
            <div className="student-left-pane">
                <ul>
                    <li onClick={() => setSelectedMenu('studentprofile')}>Profile</li>
                    <li onClick={() => setSelectedMenu('studentacademics')}>Academics</li>
                    <li onClick={() => setSelectedMenu('studentsearch')}>Search</li>
                </ul>
                <button onClick={handleLogout}>Logout</button>
            </div>

            {/* Right Pane */}

            <div className="student-right-pane">
                <h1>College Directory Management System</h1>
                {renderContent()}
            </div>
        </div>
    );
};

export default StudentHome;
