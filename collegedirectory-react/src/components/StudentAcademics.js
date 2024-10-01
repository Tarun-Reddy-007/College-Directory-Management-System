import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentAcademics.css'; // Import the new CSS file

const StudentAcademics = () => {
    const [academicDetails, setAcademicDetails] = useState({
        year: '',
        department: ''
    });
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [facultyAdvisor, setFacultyAdvisor] = useState({});

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        
        if (userId) {
            // Fetch academic details from backend
            axios.get('http://localhost:8081/api/student/dept-year', {
                params: { userId }
            })
            .then(response => {
                const { year, department } = response.data;
                setAcademicDetails({ year, department });
            })
            .catch(error => {
                console.error("Error fetching academic details:", error);
            });

            // Fetch enrolled courses from backend
            axios.get('http://localhost:8081/api/student/enrolled-courses', {
                params: { userId }
            })
            .then(response => {
                setEnrolledCourses(response.data);
            })
            .catch(error => {
                console.error("Error fetching enrolled courses:", error);
            });

            // Fetch faculty advisor details
            axios.get(`http://localhost:8081/api/facultyAdvisors/${userId}`)
            .then(response => {
                setFacultyAdvisor(response.data);
            })
            .catch(error => {
                console.error("Error fetching faculty advisor details:", error);
            });
        }
    }, []);

    return (
        <div className="academics-container">
            <h2 className="academics-title">Academics Section</h2>
            <p className="academics-detail"><strong>Year:</strong> {academicDetails.year}</p>
            <p className="academics-detail"><strong>Department:</strong> {academicDetails.department}</p>
            <h3 className="faculty-advisor-title">Faculty Advisor Details</h3>
            {facultyAdvisor.name ? (
                <div className="faculty-advisor-info">
                    <p><strong>Name:</strong> {facultyAdvisor.name}</p>
                    <p><strong>Email:</strong> {facultyAdvisor.email}</p>
                    <p><strong>Phone:</strong> {facultyAdvisor.phone}</p>
                    <p><strong>Office Hours:</strong> {facultyAdvisor.officeHours}</p>
                    <p><strong>Department:</strong> {facultyAdvisor.departmentName}</p>
                </div>
            ) : (
                <p>No faculty advisor assigned.</p>
            )}
            <h3 className="enrolled-courses-title">Enrolled Courses</h3>
            {enrolledCourses.length > 0 ? (
                <ul className="enrolled-courses-list">
                    {enrolledCourses.map((course, index) => (
                        <li key={index} className="enrolled-course-item">
                            <strong>{course.title}</strong>: {course.description}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-courses-message">No enrolled courses found.</p>
            )}
        </div>
    );
};

export default StudentAcademics;
