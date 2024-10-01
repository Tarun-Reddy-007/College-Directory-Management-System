// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import StudentHome from './components/StudentHome';
import FacultyHome from './components/FacultyHome';
import AdministratorHome from './components/AdministratorHome';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/student-home" element={<StudentHome />} />
                <Route path="/faculty-home" element={<FacultyHome />} />
                <Route path="/administrator-home" element={<AdministratorHome />} />
            </Routes>
        </Router>
    );
};

export default App;
