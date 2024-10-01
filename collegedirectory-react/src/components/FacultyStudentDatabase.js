import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FacultyStudentDatabase.css';

const FacultyStudentDatabase = () => {
    const [courses, setCourses] = useState([]);
    const [allStudentDetails, setAllStudentDetails] = useState([]);
    const [filteredStudentDetails, setFilteredStudentDetails] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetchCourses(userId);
            fetchAllStudentDetails(userId);
        } else {
            setError('User ID not found. Please log in again.');
            setIsLoading(false);
        }
    }, []);

    const fetchCourses = (userId) => {
        axios.get(`http://localhost:8081/api/courses/faculty/${userId}`)
            .then(response => {
                setCourses(response.data);
            })
            .catch(error => {
                console.error("Error fetching courses:", error);
                setError("Error fetching courses.");
            })
            .finally(() => setIsLoading(false)); 
    };

    const fetchAllStudentDetails = (userId) => {
        axios.get(`http://localhost:8081/api/student/faculty/${userId}`)
            .then(response => {
                setAllStudentDetails(response.data);
                setFilteredStudentDetails(response.data);
            })
            .catch(error => {
                console.error("Error fetching student details:", error);
                setError("Error fetching student details.");
            })
            .finally(() => setIsLoading(false));
    };

    const handleCourseClick = (courseId) => {
        setIsLoading(true); 
        axios.get(`http://localhost:8081/api/enrollments/enrolled-courses?courseId=${courseId}`)
            .then(response => {
                const enrolledStudentIDs = response.data;
                const commonStudentDetails = allStudentDetails.filter(student => 
                    enrolledStudentIDs.includes(student[0])
                );
                setFilteredStudentDetails(commonStudentDetails);
            })
            .catch(error => {
                console.error("Error fetching enrolled student details:", error);
                setError("Error fetching enrolled student details.");
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <div className="faculty-student-database-container">
            <h2>Courses Handled</h2>
            <div className="faculty-course-container">
                <button 
                    className="faculty-course-button" 
                    onClick={() => setFilteredStudentDetails(allStudentDetails)}
                >
                    All
                </button>
                {isLoading ? (
                    <p className="faculty-loading">Loading courses...</p>
                ) : courses.length > 0 ? (
                    courses.map((course) => (
                        <button 
                            key={course.id} 
                            className="faculty-course-button"
                            onClick={() => handleCourseClick(course.id)}
                        >
                            {course.title}
                        </button>
                    ))
                ) : (
                    <p className="faculty-no-courses">No courses found.</p>
                )}
            </div>
    
            <h2>Student Details</h2>
            {error && <p className="faculty-error-message">{error}</p>}
            {isLoading ? (
                <p className="faculty-loading">Loading student details...</p>
            ) : filteredStudentDetails.length > 0 ? (
                <div className="faculty-student-details-table-container">
                    <table className="faculty-student-details-table">
                        <thead>
                            <tr>
                                <th>Student Id</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Year</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudentDetails.map((student, index) => (
                                <tr key={index}>
                                    <td>{student[0]}</td>
                                    <td>{student[1]}</td>
                                    <td>{student[2]}</td>
                                    <td>{student[3]}</td>
                                    <td>{student[4]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="faculty-no-student-data">No student details found.</p>
            )}
        </div>
    );
};

export default FacultyStudentDatabase;
