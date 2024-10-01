import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Autocomplete, // Import Autocomplete
} from '@mui/material';
import './ManageStudents.css'; // Import your CSS file

const ManageStudent = () => {
    const [open, setOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteFacultyAdvisorOpen, setDeleteFacultyAdvisorOpen] = useState(false);
    const [enrollOpen, setEnrollOpen] = useState(false); 
    const [AddFacultyAdvisorOpen, setAddFacultyAdvisorOpen] = useState(false);// State for enrollment dialog
    const [enrollDeleteOpen, setEnrollDeleteOpen] = useState(false); // State for enrollment dialog
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        department: '',
        year: ''
    });
    const [students, setStudents] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [courses, setCourses] = useState([]); // State to hold courses
    const [studentcourses, setStudentCourses] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedfacultyAdvisor, setSelectedFacultyAdvisor] = useState(null); // State to hold selected course
    const [errors, setErrors] = useState({});
    const userId = localStorage.getItem('userId');

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/users/getallstudents');
            if (Array.isArray(response.data)) {
                setStudents(response.data);
            } else {
                console.error('Data is not an array:', response.data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const fetchFaculties = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/faculties/getallfaculties');
            if (Array.isArray(response.data)) {
                setFaculties(response.data);
            } else {
                console.error('Data is not an array:', response.data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const deleteStudentEnrollment = async () => {
        if (!selectedStudent || !selectedCourse) {
            console.error("Student or Course is not selected");
            return;
        }
        try {
            const response = await axios.delete('http://localhost:8081/api/enrollments/delete', {
                params: {
                    studentId: selectedStudent.id,
                    courseId: selectedCourse.id
                }
            });
            alert("Enrollment deleted successfully.");
            setEnrollDeleteOpen(false); // Close the dialog after deletion
        } catch (error) {
            console.error("Error deleting enrollment:", error);
            alert("Failed to delete enrollment.");
        }
    };
    
    // Fetch courses
    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/courses/getallcourses'); // Update the endpoint to match your API
            if (Array.isArray(response.data)) {
                setCourses(response.data);
            } else {
                console.error('Data is not an array:', response.data);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchCourses(); 
        fetchFaculties(); 
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setErrors({});
        setFormData({
            name: '',
            username: '',
            email: '',
            phone: '',
            password: '',
            department: '',
            year: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleFilter = async () => {
        // Filtering logic...
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8081/api/users/addstudent', formData);
            handleClose();
            fetchStudents();
        } catch (error) {
            console.error('Error adding student:', error);
        }
    };

    const handleUpdateOpen = (student) => {
        setSelectedStudent(student);
        setFormData(student);
        setUpdateOpen(true);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:8081/api/users/updatestudent/${selectedStudent.id}`, formData);
            setUpdateOpen(false);
            fetchStudents();
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    const handleDeleteOpen = (student) => {
        setSelectedStudent(student);
        setDeleteOpen(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8081/api/users/deletestudent/${selectedStudent.id}`);
            setDeleteOpen(false);
            fetchStudents();
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    const handleEnrollOpen = (student) => {
        setSelectedStudent(student);
        setEnrollOpen(true);
    };

    const handleAddFacultyAdvisorOpen=(student)=>{
        setSelectedStudent(student);
        setAddFacultyAdvisorOpen(true);
    };

    const handleEnroll = async () => {
        if (!selectedCourse || !selectedStudent) return; // Ensure both course and student are selected
        try {
            const enrollmentData = {
                student: { userId: selectedStudent.id }, // Set student reference
                course: { id: selectedCourse.id },   // Set course reference
            };
    
            await axios.post(`http://localhost:8081/api/enrollments/enroll`, enrollmentData);
            setEnrollOpen(false);
            fetchStudents(); // Refresh students after enrollment
        } catch (error) {
            console.error('Error enrolling student:', error);
        }
    };

    const addFacultyAdvisor = async () => {
        if (!selectedfacultyAdvisor || !selectedStudent) return; // Ensure both student and faculty are selected
    
        try {
            // Create the data object to send in the request body
            const facultyAdvisorData = {
                studentId: selectedStudent.id,
                facultyId: selectedfacultyAdvisor.facultyId
            };
            
            // Send the data as JSON in the request body
            const response = await axios.post(`http://localhost:8081/api/facultyAdvisors/addfacultyadvisor`, facultyAdvisorData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            // Check the response message
            if (response.data === "Faculty advisor added successfully") {
                // Close the dialog box and refresh students
                setAddFacultyAdvisorOpen(false);
                fetchStudents(); // Refresh students after enrollment
            } else {
                // Handle case where student already has a faculty advisor
                alert(response.data); // Display the message (or handle as needed)
            }
        } catch (error) {
            console.error('Error enrolling student:', error);
        }
    };
    

    const handleEnrollDeleteOpen = async (student) => {
        setSelectedStudent(student); 
        setEnrollDeleteOpen(true); 
        try {
            const response = await axios.get(`http://localhost:8081/api/enrollments/getstudentcourses/${student.id}`); 
            console.log(response);
            setStudentCourses(response.data); 
        } catch (error) {
            console.error("Error fetching enrolled courses:", error);
        }
    };

    const handleDeleteFacultyAdvisorOpen = (student) => {
        setSelectedStudent(student);
        setDeleteFacultyAdvisorOpen(true);
    };

    const handleDeleteFacultyAdvisor = async () => {
        console.log(selectedStudent.id);
        try {
            await axios.delete(`http://localhost:8081/api/facultyAdvisors/deletefacultyadvisor/${selectedStudent.id}`);
            setDeleteFacultyAdvisorOpen(false);
            fetchStudents();
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    

    return (
        <div className="manage-student-container">
            <h2 className="manage-student-header">Manage Students</h2>
            <div className="manage-student-filters">
                <div className="filter-buttons">
                    {/* Filtering logic... */}
                </div>

                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Add Student
                </Button>
            </div>

            {/* Student Table */}
            <TableContainer component={Paper} className="table-container">
                <Table className="table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.username}</TableCell>
                                <TableCell>{student.email}</TableCell>
                                <TableCell>{student.phone}</TableCell>
                                <TableCell>{student.department}</TableCell>
                                <TableCell>{student.year}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleUpdateOpen(student)}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleDeleteOpen(student)}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="default"
                                        onClick={() => handleEnrollOpen(student)} // Open enroll dialog
                                    >
                                        Enroll Course
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="default"
                                        onClick={() => handleEnrollDeleteOpen(student)} // Open enroll dialog
                                    >
                                        Delete Enrolled Course
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="default"
                                        onClick={() => handleAddFacultyAdvisorOpen(student)} // Open enroll dialog
                                    >
                                        Add Faculty Advisor
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="default"
                                        onClick={() => handleDeleteFacultyAdvisorOpen(student)} // Open enroll dialog
                                    >
                                        Delete Faculty Advisor
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Student Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Student</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            margin="dense"
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Department</InputLabel>
                            <Select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                label="Department"
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="Computer Science">Computer Science</MenuItem>
                                <MenuItem value="Physics">Physics</MenuItem>
                                <MenuItem value="Chemistry">Chemistry</MenuItem>
                                <MenuItem value="Mathematics">Mathematics</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Year</InputLabel>
                            <Select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                label="Year"
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="1">1</MenuItem>
                                <MenuItem value="2">2</MenuItem>
                                <MenuItem value="3">3</MenuItem>
                                <MenuItem value="4">4</MenuItem>
                            </Select>
                        </FormControl>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button type="submit" color="primary">
                                Add
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Update Student Dialog */}
            <Dialog open={updateOpen} onClose={() => setUpdateOpen(false)}>
                <DialogTitle>Update Student</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleUpdate}>
                        {/* Fields for updating student */}
                        <TextField
                            margin="dense"
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            fullWidth
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Department</InputLabel>
                            <Select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                label="Department"
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="Computer Science">Computer Science</MenuItem>
                                <MenuItem value="Physics">Physics</MenuItem>
                                <MenuItem value="Chemistry">Chemistry</MenuItem>
                                <MenuItem value="Mathematics">Mathematics</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Year</InputLabel>
                            <Select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                label="Year"
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="1">1</MenuItem>
                                <MenuItem value="2">2</MenuItem>
                                <MenuItem value="3">3</MenuItem>
                                <MenuItem value="4">4</MenuItem>
                            </Select>
                        </FormControl>
                        <DialogActions>
                            <Button onClick={() => setUpdateOpen(false)} color="primary">
                                Cancel
                            </Button>
                            <Button type="submit" color="primary">
                                Update
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this student?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="primary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Enroll to Course Dialog */}
            <Dialog open={enrollOpen} onClose={() => setEnrollOpen(false)}>
                <DialogTitle>Enroll to Course</DialogTitle>
                <DialogContent>
                    <Typography>Select a course to enroll {selectedStudent?.name}:</Typography>
                    <Autocomplete
                        options={courses}
                        getOptionLabel={(option) => `${option.title} (${option.departmentName}, ${option.facultyName})`} // Combine title, departmentName, and facultyName
                        onChange={(event, value) => setSelectedCourse(value)} // Set selected course
                        renderInput={(params) => <TextField {...params} label="Course" variant="outlined" fullWidth />}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEnrollOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleEnroll} color="primary">
                        Enroll
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={enrollDeleteOpen} onClose={() => setEnrollDeleteOpen(false)}>
                <DialogTitle>Delete Enrollment to Course</DialogTitle>
                <DialogContent>
                    <Typography>Select a course to Delete enrollment {selectedStudent?.name}:</Typography>
                    <Autocomplete
                        options={studentcourses}
                        getOptionLabel={(option) => `${option.title} ${option.description}`} // Combine title, departmentName, and facultyName
                        onChange={(event, value) => setSelectedCourse(value)} // Set selected course
                        renderInput={(params) => <TextField {...params} label="Course" variant="outlined" fullWidth />}
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setEnrollDeleteOpen(false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={deleteStudentEnrollment} color="primary">
                    Delete Enrollment
                </Button>
            </DialogActions>
            </Dialog>
            <Dialog open={AddFacultyAdvisorOpen} onClose={() => setAddFacultyAdvisorOpen(false)}>
                <DialogTitle>Add Faculty Advisor</DialogTitle>
                <DialogContent>
                    <Typography>Select a Faculty Advisor {selectedStudent?.name}:</Typography>
                    <Autocomplete
                        options={faculties}
                        getOptionLabel={(option) => `${option.facultyId} ${option.facultyName} ${option.phone} ${option.email} ${option.departmentName}`} // Combine title, departmentName, and facultyName
                        onChange={(event, value) => setSelectedFacultyAdvisor(value)} // Set selected course
                        renderInput={(params) => <TextField {...params} label="FacultyAdvisor" variant="outlined" fullWidth />}
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setAddFacultyAdvisorOpen(false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={addFacultyAdvisor} color="primary">
                    Add Faculty Advisor
                </Button>
            </DialogActions>
            </Dialog>
            <Dialog open={deleteFacultyAdvisorOpen} onClose={() => setDeleteFacultyAdvisorOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete the Faculty Advisor?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteFacultyAdvisorOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteFacultyAdvisor} color="primary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ManageStudent;
