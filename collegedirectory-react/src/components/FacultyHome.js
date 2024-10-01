import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import FacultyProfile from '../components/FacultyProfile'; 
import FacultyStudentDatabase from '../components/FacultyStudentDatabase'; 
import './FacultyHome.css'; 

const FacultyHome = () => {
    const [selectedMenu, setSelectedMenu] = useState('facultyprofile'); 
    const navigate = useNavigate();

    const renderContent = () => {
        switch (selectedMenu) {
            case 'facultyprofile':
                return <FacultyProfile />;
            case 'studentdatabase':
                return <FacultyStudentDatabase />;
            default:
                return <FacultyProfile />;
        } 
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/');
    };

    return (
        <div className="faculty-home-container">
            <div className="faculty-left-pane">
                <ul>
                    <li onClick={() => setSelectedMenu('facultyprofile')}>Profile</li>
                    <li onClick={() => setSelectedMenu('studentdatabase')}>Student Database</li>
                </ul>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <div className="faculty-right-pane">
                <h1>College Directory Management System</h1>
                {renderContent()}
            </div>
        </div>
    );
};

export default FacultyHome;
