import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material'; // MUI Components
import './Profile.css'; // Optional: if you want additional styles

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false); // For dialog visibility
    const [formData, setFormData] = useState({ username: '', email: '', role: '', name: '', phone: '', password: '' }); // Form data state
    const [errors, setErrors] = useState({}); // For handling validation errors

    const userId = localStorage.getItem('userId'); // Get userId from localStorage

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/users/getid/${userId}`);
                setUser(response.data);
                setFormData({
                    username: response.data.username,
                    email: response.data.email,
                    role: response.data.role,
                    name: response.data.name,
                    phone: response.data.phone,
                    password: '' // Password will be left blank initially
                });
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    // Handle opening the dialog
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Handle closing the dialog
    const handleClose = () => {
        setOpen(false);
        setErrors({}); // Clear validation errors on close
    };

    // Handle input changes in the form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    // Validation logic
    const validate = () => {
        let isValid = true;
        const newErrors = {};

        // Check for null or empty fields
        ['email', 'phone', 'password', 'name', 'username'].forEach((field) => {
            if (!formData[field]) {
                newErrors[field] = 'Cannot be null'; // Common error message
                isValid = false;
            }
        });

        // Additional validations
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email format';
            isValid = false;
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if (formData.phone && !phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Invalid phone number (10 digits)';
            isValid = false;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (formData.password && !passwordRegex.test(formData.password)) {
            newErrors.password = 'Password must be at least 8 characters, with at least 1 uppercase letter, 1 number, and 1 special character';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle form submission to update user details
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                await axios.put(`http://localhost:8081/api/users/updateid/${userId}`, formData); // Update API call
                setUser(formData); // Update the profile details with new data
                handleClose(); // Close the dialog on successful update
            } catch (error) {
                console.error('Error updating profile details:', error);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found.</div>;
    }

    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            <div className="profile-details">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>Role:</strong> {user.role}</p>
            </div>

            {/* Edit Details Button */}
            <div className="edit-button">
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Edit Details
                </Button>
            </div>

            {/* Dialog for editing user details */}
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Edit Profile Details</DialogTitle>
                <DialogContent className="dialog-content">
                    <form onSubmit={handleSubmit}>
                        <TextField
                            margin="dense"
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name || ' '}
                        />
                        <TextField
                            margin="dense"
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.username}
                            helperText={errors.username || ' '}
                        />
                        <TextField
                            margin="dense"
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email || ' '}
                        />
                        <TextField
                            margin="dense"
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.phone}
                            helperText={errors.phone || ' '}
                        />
                        <TextField
                            margin="dense"
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.password}
                            helperText={errors.password || ' '}
                        />
                        {/* Role field is now disabled */}
                        <TextField
                            margin="dense"
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            fullWidth
                            disabled // The role cannot be changed
                            helperText="Role cannot be changed"
                        />
                    </form>
                </DialogContent>
                <DialogActions className="dialog-actions">
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Profile;
