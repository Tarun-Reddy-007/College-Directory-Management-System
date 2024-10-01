import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        try {
            const response = await fetch('http://localhost:8081/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, role }),
            });
    
            if (response.ok) {
                const data = await response.json(); 
                localStorage.setItem('userId', data.userId); 

                if (role === 'STUDENT') {
                    navigate('/student-home');
                } else if (role === 'FACULTY_MEMBER') {
                    navigate('/faculty-home');
                } else if (role === 'ADMINISTRATOR') {
                    navigate('/administrator-home');
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Invalid credentials.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    

    return (
        <div className="login-container">
            <h1>College Directory Management System</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                />

                <label htmlFor="role">Role</label>
                <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="STUDENT">STUDENT</option>
                    <option value="FACULTY_MEMBER">FACULTY MEMBER</option>
                    <option value="ADMINISTRATOR">ADMINISTRATOR</option>
                </select>

                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            {error && <p className="error-message">{error}</p>} {/* Display error message */}
        </div>
    );
};

export default Login;
