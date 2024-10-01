import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StudentProfile.css'; // Import the new CSS file

const StudentProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId'); // Get userId from localStorage

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/users/getid/${userId}`);
                setUser(response.data);
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

    if (loading) {
        return <div className="student-loading">Loading...</div>;
    }

    if (!user) {
        return <div className="student-not-found">User not found.</div>;
    }

    return (
        <div className="student-profile-container">
            <h2 className="student-profile-title">Student Profile</h2>
            <div className="student-profile-details">
                <p className="student-profile-label"><strong>Name:</strong> {user.name}</p>
                <p className="student-profile-label"><strong>Username:</strong> {user.username}</p>
                <p className="student-profile-label"><strong>Email:</strong> {user.email}</p>
                <p className="student-profile-label"><strong>Phone:</strong> {user.phone}</p>
                <p className="student-profile-label"><strong>Role:</strong> {user.role}</p>
            </div>
        </div>
    );
};

export default StudentProfile;
