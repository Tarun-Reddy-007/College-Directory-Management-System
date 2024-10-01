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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';

import './ManageDepartments.css';

const ManageDepartments = () => {
    const [open, setOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/departments');
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFormData({ name: '', description: '' });
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
            await axios.post('http://localhost:8081/api/adddepartment', formData);
            handleClose();
            fetchDepartments();
        } catch (error) {
            console.error('Error adding department:', error);
        }
    };

    const handleUpdateOpen = (department) => {
        setSelectedDepartment(department);
        setFormData(department);
        setUpdateOpen(true);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:8081/api/updatedepartment/${selectedDepartment.id}`, formData);
            setUpdateOpen(false);
            fetchDepartments();
        } catch (error) {
            console.error('Error updating department:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/api/deletedepartment/${id}`);
            fetchDepartments();
        } catch (error) {
            console.error('Error deleting department:', error);
        }
    };

    return (
        <div className="manage-department-container">
            <h3 className="manage-department-header">Manage Departments</h3>
            <div className="manage-department-filters">
                <div className="filter-buttons">
                    {/* Filtering logic... */}
                </div>

                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Add Department
                </Button>
            </div>
            <TableContainer component={Paper} className="table-container">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {departments.map((department) => (
                            <TableRow key={department.id} className="table-row">
                                <TableCell>{department.name}</TableCell>
                                <TableCell>{department.description}</TableCell>
                                <TableCell>
                                    <Button className="button" variant="outlined" onClick={() => handleUpdateOpen(department)}>Update</Button>
                                    <Button className="button" variant="outlined" color="secondary" onClick={() => handleDelete(department.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle className="dialog-title">Add Department</DialogTitle>
                <DialogContent className="dialog-content">
                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions className="dialog-actions">
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">Add</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={updateOpen} onClose={() => setUpdateOpen(false)}>
                <DialogTitle className="dialog-title">Update Department</DialogTitle>
                <DialogContent className="dialog-content">
                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions className="dialog-actions">
                    <Button onClick={() => setUpdateOpen(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleUpdate} color="primary">Update</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ManageDepartments;
