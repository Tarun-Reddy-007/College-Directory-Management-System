import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FacultyStudentDatabase.css'; // Ensure this path is correct

const FacultyStudentDatabase = () => {
    const [courses, setCourses] = useState([]);
    const [allStudentDetails, setAllStudentDetails] = useState([]); // Store all student details
    const [filteredStudentDetails, setFilteredStudentDetails] = useState([]); // Store filtered student details
    const [error, setError] = useState('');

    useEffect(() => {
        const userId = localStorage.getItem('userId');

        if (userId) {
            // Fetch courses handled by the faculty from backend
            axios.get(`http://localhost:8081/api/courses/faculty/${userId}`)
                .then(response => {
                    setCourses(response.data);
                })
                .catch(error => {
                    console.error("Error fetching courses:", error);
                });

            // Automatically fetch all student details when the component mounts
            fetchAllStudentDetails(userId);
        }
    }, []);

    // Function to fetch all student details
    const fetchAllStudentDetails = (userId) => {
        axios.get(`http://localhost:8081/api/student/faculty/${userId}`)
            .then(response => {
                setAllStudentDetails(response.data); // Set all student details
                setFilteredStudentDetails(response.data); // Initialize filtered student details with all details
            })
            .catch(error => {
                console.error("Error fetching student details:", error);
                setError("Error fetching student details.");
            });
    };

    const handleCourseClick = (courseId) => {
        // Fetch enrolled student IDs directly for the selected course
        axios.get(`http://localhost:8081/api/enrollments/enrolled-courses?courseId=${courseId}`)
            .then(response => {
                const enrolledStudentIds = response.data; // Assuming this contains the list of student IDs
                console.log(enrolledStudentIds); // For debugging

                // Filter student details based on the common student IDs
                const commonStudentDetails = allStudentDetails.filter(student => 
                    enrolledStudentIds.includes(student[0]) // Assuming student[0] is the student ID
                );
                setFilteredStudentDetails(commonStudentDetails); // Set the filtered student details
            })
            .catch(error => {
                console.error("Error fetching enrolled student details:", error);
                setError("Error fetching enrolled student details.");
            });
    };

    return (
        <div className="faculty-student-database-container">
            <h2>Courses Handled</h2>
            <div className="faculty-course-container">
                <button 
                    className="faculty-course-button" 
                    onClick={() => setFilteredStudentDetails(allStudentDetails)} // Show all students when "All" is clicked
                >
                    All
                </button>
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <button 
                            key={course.id} 
                            className="faculty-course-button"
                            onClick={() => handleCourseClick(course.id)} // Fetch students for specific course
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
            {filteredStudentDetails.length > 0 ? (
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
                                    <td>{student[0]}</td> {/* Adjust index based on your data structure */}
                                    <td>{student[1]}</td>
                                    <td>{student[2]}</td>
                                    <td>{student[3]}</td>
                                    <td>{student[4]}</td> {/* Adjust index based on your data structure */}
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
