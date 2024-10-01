import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select'; // Import react-select
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    MenuItem,
    Select as MuiSelect,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import './ManageCourses.css'; // Import your CSS file

const ManageCourses = () => {
    const [open, setOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        department: '', // This will now store the department name
        faculty: ''
    });
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    // Fetch courses from the server
    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/courses/getallcourses');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    // Fetch departments from the server
    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/departments');
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    // Fetch faculties from the server for Autocomplete
    const fetchFaculties = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/users/getallfaculties');
            setFaculties(response.data);
        } catch (error) {
            console.error('Error fetching faculties:', error);
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchDepartments();
        fetchFaculties();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFormData({
            title: '',
            description: '',
            department: '', // Reset to empty string
            faculty: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleFacultyChange = (selectedOption) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            faculty: selectedOption ? selectedOption.value : '', // Use 'value' for the ID
        }));
    };

    const handleDepartmentChange = (selectedOption) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            department: selectedOption ? selectedOption.label : '', // Set department name
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form data:', formData); // Log the data being submitted
        try {
            const dataToSend = {
                title: formData.title,
                description: formData.description,
                faculty: formData.faculty, // Faculty ID
                department: formData.department // Use the retrieved department ID
            };
    
            const response = await axios.post('http://localhost:8081/api/courses/addcourse', dataToSend);
            console.log('Response:', response.data); // Log the response
            handleClose();
            fetchCourses();
        } catch (error) {
            console.error('Error adding course:', error);
        }
    };
    
    const handleUpdateOpen = (course) => {
        setSelectedCourse(course);
        setFormData(course);
        setUpdateOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        console.log('Form Data before update submission:', formData); // Log the form data
    
        try {
            const dataToUpdate = {
                title: formData.title,
                description: formData.description,
                faculty: formData.faculty, // Faculty ID
                department: formData.department, // Department name (ensure this matches your API structure)
            };
    
            console.log('Data being sent to the update API:', dataToUpdate); // Log the data being sent
    
            await axios.put(`http://localhost:8081/api/courses/updatecourse/${selectedCourse.id}`, dataToUpdate);
            setUpdateOpen(false);
            fetchCourses(); // Fetch the updated courses after a successful update
        } catch (error) {
            console.error('Error updating course:', error);
        }
    };
    

    const handleDeleteOpen = (course) => {
        setSelectedCourse(course);
        setDeleteOpen(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8081/api/courses/deletecourse/${selectedCourse.id}`);
            setDeleteOpen(false);
            fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    return (
        <div className="manage-courses-container">
            <h2 className="manage-courses-header">Manage Courses</h2>
            <div className="manage-courses-filters">
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Add Course
                </Button>
            </div>

            {/* Courses Table */}
            <TableContainer component={Paper} className="table-container">
                <Table className="table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Course ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Faculty</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {courses.map((course) => (
                            <TableRow key={course.id}>
                                <TableCell>{course.id}</TableCell>
                                <TableCell>{course.title}</TableCell>
                                <TableCell>{course.description}</TableCell>
                                <TableCell>{course.departmentName}</TableCell>
                                <TableCell>{course.facultyName}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleUpdateOpen(course)}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleDeleteOpen(course)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Course Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Course</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            margin="dense"
                            label="Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            fullWidth
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Department</InputLabel>
                            <MuiSelect
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                label="Department"
                            >
                                {departments.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.name}>
                                        {dept.name}
                                    </MenuItem>
                                ))}
                            </MuiSelect>
                        </FormControl>

                        {/* Faculty Autocomplete using react-select */}
                        <FormControl fullWidth margin="dense">
                            <Select
                                options={faculties.map(faculty => ({
                                    value: faculty.id,
                                    label: faculty.name
                                }))}
                                onChange={handleFacultyChange}
                                placeholder="Select Faculty"
                                isClearable
                            />
                        </FormControl>

                        {/* Move DialogActions inside the form */}
                        <DialogActions>
                            <Button onClick={handleClose} color="secondary">Cancel</Button>
                            <Button type="submit" color="primary">Add Course</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Update Course Dialog */}
            <Dialog open={updateOpen} onClose={() => setUpdateOpen(false)}>
            <DialogTitle>Update Course</DialogTitle>
            <DialogContent>
                <form onSubmit={handleUpdate}>
                    <TextField
                        margin="dense"
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Department</InputLabel>
                        <MuiSelect
                            name="department"
                            value={formData.department} // Update to reflect the department name
                            onChange={handleChange}
                            label="Department"
                        >
                            {departments.map((dept) => (
                                <MenuItem key={dept.id} value={dept.name}>
                                    {dept.name}
                                </MenuItem>
                            ))}
                        </MuiSelect>
                    </FormControl>

                    {/* Faculty Autocomplete for update */}
                    <FormControl fullWidth margin="dense">
                        <Select
                            options={faculties.map(faculty => ({
                                value: faculty.id,
                                label: faculty.name
                            }))}
                            onChange={handleFacultyChange}
                            value={faculties.find(faculty => faculty.id === formData.faculty) || null}
                            placeholder="Select Faculty"
                            isClearable
                        />
                    </FormControl>

                    <DialogActions>
                        <Button onClick={() => setUpdateOpen(false)} color="secondary">Cancel</Button>
                        <Button type="submit" color="primary">Update Course</Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>Delete Course</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this course?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOpen(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleDelete} color="primary">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ManageCourses;
