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
    const [facultyAdvisorWorkload, setFacultyAdvisorWorkload] = useState({});
    const [ratioData, setRatioData] = useState({ labels: ['Student-Faculty Ratio'], datasets: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const [studentCountRes, enrollmentTrendsRes, facultyCourseLoadsRes, studentsPerDeptRes, facultyAdvisorWorkloadRes, ratioRes] = await Promise.all([
                fetch('http://localhost:8081/api/graphs/students-count-by-year'),
                fetch('http://localhost:8081/api/graphs/enrollment-trends'),
                fetch('http://localhost:8081/api/graphs/faculty-course-loads'),
                fetch('http://localhost:8081/api/graphs/students-per-department'),
                fetch('http://localhost:8081/api/graphs/faculty-advisor-workload'),
                fetch('http://localhost:8081/api/graphs/students-to-faculty')
            ]);

            const studentCountData = await studentCountRes.json();
            const enrollmentTrendsData = await enrollmentTrendsRes.json();
            const facultyCourseLoadsData = await facultyCourseLoadsRes.json();
            const studentsPerDeptData = await studentsPerDeptRes.json();
            const facultyAdvisorWorkloadData = await facultyAdvisorWorkloadRes.json();
            const ratio = await ratioRes.json();

            // Prepare data for the charts
            setStudentCountByYear({
                labels: Object.keys(studentCountData),
                datasets: [{
                    label: 'Number of Students',
                    data: Object.values(studentCountData),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }]
            });

            setEnrollmentTrends({
                labels: Object.keys(enrollmentTrendsData),
                datasets: [{
                    label: 'Enrollments per Year',
                    data: Object.values(enrollmentTrendsData),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }]
            });

            setFacultyCourseLoads({
                labels: Object.keys(facultyCourseLoadsData),
                datasets: [{
                    label: 'Courses Taught by Faculty',
                    data: Object.values(facultyCourseLoadsData),
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                }]
            });

            setStudentsPerDepartment({
                labels: Object.keys(studentsPerDeptData),
                datasets: [{
                    label: 'Number of Students',
                    data: Object.values(studentsPerDeptData),
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                }]
            });

            setFacultyAdvisorWorkload({
                labels: facultyAdvisorWorkloadData.map(entry => entry.facultyName),
                datasets: [{
                    label: 'Students Advised',
                    data: facultyAdvisorWorkloadData.map(entry => entry.studentCount),
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1,
                }]
            });

            setRatioData({
                labels: ['Student-Faculty Ratio'],
                datasets: [{
                    label: 'Ratio',
                    data: [ratio],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }]
            });

        } catch (err) {
            setError('Error fetching data: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const chartOptions = (title, xLabel, yLabel) => ({
        responsive: true,
        maintainAspectRatio: false, // Allow the chart to grow based on its container
        scales: {
            x: {
                title: {
                    display: true,
                    text: xLabel,
                    font: {
                        size: 12,
                        weight: 'bold',
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: yLabel,
                    font: {
                        size: 12,
                        weight: 'bold',
                    },
                },
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: title },
        },
    });
    

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="graphs-container">
            <div className="chart">
                <h3>Enrollment Trends</h3>
                <Line data={enrollmentTrends} options={chartOptions('Enrollments per Year', 'Year', 'Number of Enrollments')} />
            </div>

            <div className="chart">
                <h3>Faculty Course Loads</h3>
                <Bar data={facultyCourseLoads} options={chartOptions('Courses Taught by Faculty', 'Faculty', 'Courses Taught')} />
            </div>

            <div className="chart" style={{ flex: '1 1 100%' }}>
                <h3>Students per Department</h3>
                <Bar data={studentsPerDepartment} options={chartOptions('Number of Students in Each Department', 'Department', 'Number of Students')} />
            </div>

            <div className="chart">
                <h3> Students by Year</h3>
                <Bar data={studentCountByYear} options={chartOptions('Students Count by Year', 'Year', 'Number of Students')} />
            </div>

            <div className="chart">
                <h3>Faculty Advisor Workload</h3>
                <Bar data={facultyAdvisorWorkload} options={chartOptions('Students Advised by Faculty', 'Faculty', 'Number of Students')} />
            </div>

            <div className="chart">
                <h3>Student-Faculty Ratio</h3>
                <Bar data={ratioData} options={chartOptions('Student to Faculty Ratio', 'Ratio', 'Count')} />
            </div>
        </div>
    );
};

export default Graphs;
