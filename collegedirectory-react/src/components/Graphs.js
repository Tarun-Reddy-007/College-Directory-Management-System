// Graphs.js
import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import './Graphs.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Graphs = () => {
    const [studentCountByYear, setStudentCountByYear] = useState({});
    const [enrollmentTrends, setEnrollmentTrends] = useState({});
    const [facultyCourseLoads, setFacultyCourseLoads] = useState({});
    const [studentsPerDepartment, setStudentsPerDepartment] = useState({});

    // Fetch data from the backend
    useEffect(() => {
        // Fetch student count by year
        fetch('http://localhost:8081/api/students-count-by-year')
            .then(response => response.json())
            .then(data => {
                // Check for error in response
                if (data.error) {
                    console.error('Error fetching student count:', data.error);
                    return;
                }
                // Prepare data for the bar chart
                setStudentCountByYear({
                    labels: Object.keys(data), // Years
                    datasets: [{
                        label: 'Number of Students',
                        data: Object.values(data), // Student counts
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    }]
                });
            })
            .catch(error => console.error('Error fetching student count:', error));

        // Fetch enrollment trends
        fetch('http://localhost:8081/api/graphs/enrollment-trends')
            .then(response => response.json())
            .then(data => {
                setEnrollmentTrends({
                    labels: Object.keys(data), // Years
                    datasets: [{
                        label: 'Enrollments per Year',
                        data: Object.values(data), // Enrollment counts
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    }]
                });
            })
            .catch(error => console.error('Error fetching enrollment trends:', error));

        // Fetch faculty course loads
        fetch('http://localhost:8081/api/graphs/faculty-course-loads')
            .then(response => response.json())
            .then(data => {
                setFacultyCourseLoads({
                    labels: Object.keys(data), // Faculty Names
                    datasets: [{
                        label: 'Courses Taught by Faculty',
                        data: Object.values(data), // Course load per faculty
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1,
                    }]
                });
            })
            .catch(error => console.error('Error fetching faculty course loads:', error));

        // Fetch students per department
        fetch('http://localhost:8081/api/graphs/students-per-department')
            .then(response => response.json())
            .then(data => {
                setStudentsPerDepartment({
                    labels: Object.keys(data), // Department names
                    datasets: [{
                        label: 'Number of Students',
                        data: Object.values(data), // Student counts
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    }]
                });
            })
            .catch(error => console.error('Error fetching students per department:', error));

            fetch('http://localhost:8081/api/graphs/students-count-by-year')
            .then(response => response.json())
            .then(data => {
                // Check for error in response
                if (data.error) {
                    console.error('Error fetching student count:', data.error);
                    return;
                }
                // Prepare data for the bar chart
                setStudentCountByYear({
                    labels: Object.keys(data), // Years
                    datasets: [{
                        label: 'Number of Students',
                        data: Object.values(data), // Student counts
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    }]
                });
            })
            .catch(error => console.error('Error fetching student count:', error));
    }, []);

    return (
        <div className="graphs-container">
            {/* Bar Chart: Number of Students by Year */}

            {/* Row 1: Enrollment Trends and Faculty Course Loads */}
            <div className="chart">
                <h3>Enrollment Trends</h3>
                {enrollmentTrends && enrollmentTrends.labels ? (
                    <Line
                        data={enrollmentTrends}
                        options={{
                            responsive: true,
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Year',
                                        font: {
                                            size: 12,
                                            weight: 'bold',
                                        },
                                    },
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Number of Enrollments',
                                        font: {
                                            size: 12,
                                            weight: 'bold',
                                        },
                                    },
                                    beginAtZero: true, // Start Y-axis at 0
                                    ticks: {
                                        precision: 0, // Show whole numbers
                                    },
                                },
                            },
                            plugins: {
                                legend: { position: 'top' },
                                title: { display: true, text: 'Enrollments per Year' },
                            },
                        }}
                    />
                ) : <p>Loading...</p>}
            </div>
    
            <div className="chart">
                <h3>Faculty Course Loads</h3>
                {facultyCourseLoads && facultyCourseLoads.labels ? (
                    <Bar
                        data={facultyCourseLoads}
                        options={{
                            responsive: true,
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Faculty',
                                        font: {
                                            size: 12,
                                            weight: 'bold',
                                        },
                                    },
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Courses Taught',
                                        font: {
                                            size: 12,
                                            weight: 'bold',
                                        },
                                    },
                                    beginAtZero: true, // Start Y-axis at 0
                                    ticks: {
                                        precision: 0, // Show whole numbers
                                    },
                                },
                            },
                            plugins: {
                                legend: { position: 'top' },
                                title: { display: true, text: 'Courses Taught by Faculty' },
                            },
                        }}
                    />
                ) : <p>Loading...</p>}
            </div>
    
            {/* Row 2: Students per Department */}
            <div className="chart" style={{ flex: '1 1 100%' }}>
                <h3>Students per Department</h3>
                {studentsPerDepartment && studentsPerDepartment.labels ? (
                    <Bar
                        data={studentsPerDepartment}
                        options={{
                            responsive: true,
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Department',
                                        font: {
                                            size: 12,
                                            weight: 'bold',
                                        },
                                    },
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Number of Students',
                                        font: {
                                            size: 12,
                                            weight: 'bold',
                                        },
                                    },
                                    beginAtZero: true, // Start Y-axis at 0
                                    ticks: {
                                        precision: 0, // Show whole numbers
                                    },
                                },
                            },
                            plugins: {
                                legend: { position: 'top' },
                                title: { display: true, text: 'Number of Students in Each Department' },
                            },
                        }}
                    />
                ) : <p>Loading...</p>}
            </div>
            <div className="chart">
                <h3>Number of Students by Year</h3>
                {studentCountByYear && studentCountByYear.labels ? (
                    <Bar
                        data={studentCountByYear}
                        options={{
                            responsive: true,
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Year',
                                        font: {
                                            size: 12,
                                            weight: 'bold',
                                        },
                                    },
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Number of Students',
                                        font: {
                                            size: 12,
                                            weight: 'bold',
                                        },
                                    },
                                    beginAtZero: true, // Start Y-axis at 0
                                    ticks: {
                                        precision: 0, // Show whole numbers
                                    },
                                },
                            },
                            plugins: {
                                legend: { position: 'top' },
                                title: { display: true, text: 'Students Count by Year' },
                            },
                        }}
                    />
                ) : <p>Loading...</p>}
            </div>
        </div>
    );
};

export default Graphs;
