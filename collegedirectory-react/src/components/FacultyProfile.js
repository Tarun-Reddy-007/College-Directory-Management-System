import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FacultyProfile.css'; 

const FacultyProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId'); 

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/users/getid/${userId}`);
                console.log(response.data);
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
        return <div className="faculty-loading">Loading...</div>;
    }

    if (!user) {
        return <div className="faculty-not-found">User not found.</div>;
    }

    return (
        <div className="faculty-profile-container">
            <h2 className="faculty-profile-title">Faculty Profile</h2>
            <div className="faculty-profile-details">
                <p className="faculty-profile-label"><strong>Name:</strong> {user.name}</p>
                <p className="faculty-profile-label"><strong>Username:</strong> {user.username}</p>
                <p className="faculty-profile-label"><strong>Email:</strong> {user.email}</p>
                <p className="faculty-profile-label"><strong>Phone:</strong> {user.phone}</p>
                <p className="faculty-profile-label"><strong>Role:</strong> {user.role}</p>
            </div>
        </div>
    );
};

export default FacultyProfile;
