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
    Paper
} from '@mui/material';
import './ManageFaculties.css'; 

const ManageFaculty = () => {
    const [open, setOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        department: '',
        officeHours: '' 
    });
    const [faculty, setFaculty] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [errors, setErrors] = useState({});
    const userId = localStorage.getItem('userId');

    const fetchFaculty = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/users/getallfaculties');
            console.log(response.data);
            if (Array.isArray(response.data)) {
                setFaculty(response.data);
            } else {
                console.error('Data is not an array:', response.data);
            }
        } catch (error) {
            console.error('Error fetching faculty:', error);
        }
    };

    useEffect(() => {
        fetchFaculty();
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
            officeHours: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8081/api/users/addfaculty', formData);
            handleClose();
            fetchFaculty();
        } catch (error) {
            console.error('Error adding faculty:', error);
        }
    };

    const handleUpdateOpen = (faculty) => {
        setSelectedFaculty(faculty);
        setFormData(faculty);
        setUpdateOpen(true);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:8081/api/users/updatefaculty/${selectedFaculty.id}`, formData);
            setUpdateOpen(false); // Close the modal
            fetchFaculty(); // Refresh the faculty list
        } catch (error) {
            console.error('Error updating faculty:', error);
        }
    };

    const handleDeleteOpen = (faculty) => {
        setSelectedFaculty(faculty);
        setDeleteOpen(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8081/api/users/deletefaculty/${selectedFaculty.id}`);
            setDeleteOpen(false);
            fetchFaculty();
        } catch (error) {
            console.error('Error deleting faculty:', error);
        }
    };

    return (
        <div className="manage-faculty-container">
            <h2 className="manage-faculty-header">Manage Faculties</h2>
            <div className="manage-faculty-filters">
                <div className="filter-buttons">
                    {/* Filtering logic... */}
                </div>

                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Add Faculty
                </Button>
            </div>

            {/* Faculty Table */}
            <TableContainer component={Paper} className="table-container">
                <Table className="table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Department</TableCell> {/* Added department column */}
                            <TableCell>Office Hours</TableCell> {/* Added office hours column */}
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {faculty.map((faculty) => (
                            <TableRow key={faculty.id}>
                                <TableCell>{faculty.name}</TableCell>
                                <TableCell>{faculty.username}</TableCell>
                                <TableCell>{faculty.email}</TableCell>
                                <TableCell>{faculty.phone}</TableCell>
                                <TableCell>{faculty.departmentName}</TableCell> {/* Access department directly */}
                                <TableCell>{faculty.officeHours}</TableCell> {/* Access office hours directly */}
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleUpdateOpen(faculty)}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleDeleteOpen(faculty)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Faculty Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Faculty</DialogTitle>
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
                            <InputLabel>Office Hours</InputLabel>
                            <Select
                                name="officeHours"
                                value={formData.officeHours}
                                onChange={handleChange}
                                label="Office Hours"
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="8:00 am - 2:00 pm">8:00 am - 2:00 pm</MenuItem>
                                <MenuItem value="9:00 am - 3:00 pm">9:00 am - 3:00 pm</MenuItem>
                                <MenuItem value="10:00 am - 4:00 pm">10:00 am - 4:00 pm</MenuItem>
                                <MenuItem value="11:00 am - 5:00 pm">11:00 am - 5:00 pm</MenuItem>
                            </Select>
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">Add Faculty</Button>
                </DialogActions>
            </Dialog>

            {/* Update Faculty Dialog */}
            <Dialog open={updateOpen} onClose={() => setUpdateOpen(false)}>
                <DialogTitle>Update Faculty</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleUpdate}>
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
                            <InputLabel>Office Hours</InputLabel>
                            <Select
                                name="officeHours"
                                value={formData.officeHours}
                                onChange={handleChange}
                                label="Office Hours"
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="8:00 am - 2:00 pm">8:00 am - 2:00 pm</MenuItem>
                                <MenuItem value="9:00 am - 3:00 pm">9:00 am - 3:00 pm</MenuItem>
                                <MenuItem value="10:00 am - 4:00 pm">10:00 am - 4:00 pm</MenuItem>
                                <MenuItem value="11:00 am - 5:00 pm">11:00 am - 5:00 pm</MenuItem>
                            </Select>
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUpdateOpen(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleUpdate} color="primary">Update Faculty</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Faculty Dialog */}
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete {selectedFaculty?.name}?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOpen(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleDelete} color="primary">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ManageFaculty;
