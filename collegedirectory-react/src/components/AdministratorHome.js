import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './AdministratorHome.css'; 
import Profile from './Profile';
import ManageStudents from './ManageStudents';
import ManageFaculties from './ManageFaculties';
import ManageDepartments from './ManageDepartments';
import ManageCourses from './ManageCourses';
import Graphs from './Graphs';

const AdministratorHome = () => {
    const [selectedMenu, setSelectedMenu] = useState('Profile'); 
    const navigate = useNavigate(); 

    const renderComponent = () => {
        switch (selectedMenu) {
            case 'Profile':
                return <Profile />;
            case 'Manage Students':
                return <ManageStudents />;
            case 'Manage Faculties':
                return <ManageFaculties />;
            case 'Manage Departments':
                return <ManageDepartments />;
            case 'Manage Courses':
                return <ManageCourses />;
            case 'Graphs':
                return <Graphs />;
            default:
                return <Profile />;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userId'); 
        navigate('/'); 
    };

    return (
        <div className="admin-container">
            <div className="admin-left-pane">
                <ul>
                    <li onClick={() => setSelectedMenu('Profile')}>Profile</li>
                    <li onClick={() => setSelectedMenu('Manage Students')}>Manage Students</li>
                    <li onClick={() => setSelectedMenu('Manage Courses')}>Manage Courses</li>
                    <li onClick={() => setSelectedMenu('Manage Departments')}>Manage Departments</li>
                    <li onClick={() => setSelectedMenu('Manage Faculties')}>Manage Faculties</li>
                    <li onClick={() => setSelectedMenu('Graphs')}>Graphs</li>
                </ul>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <div className="admin-right-pane">
                <h1>College Directory Management System</h1>
                {renderComponent()} 
            </div>
        </div>
    );
};

export default AdministratorHome;
