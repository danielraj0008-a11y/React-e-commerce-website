import React, { useState, useEffect } from "react";
import { Navbar, Footer } from "../components";
import axios from '../utils/axios';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedAddress, setEditedAddress] = useState(null);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                setError('Please login to view your profile');
                setLoading(false);
                return;
            }

            const response = await axios.get('/api/users/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Profile API response:', response.data);
            setUserData(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError(err.response?.data?.message || 'Failed to fetch user data');
            setLoading(false);
        }
    };

    const handleEdit = (address) => {
        setEditedAddress(address);
        setIsEditing(true);
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                setError('Please login to perform this action');
                return;
            }

            const response = await axios.put('/api/users/profile/billing', editedAddress, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data) {
                setIsEditing(false);
                setEditedAddress(null);
                fetchUserData(); // Refresh the data
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update address');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container my-3 py-3">
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="container my-3 py-3">
                    <div className="alert alert-danger">{error}</div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container my-3 py-3">
                <h1 className="text-center">User Profile</h1>
                <hr />
                {successMessage && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        {successMessage}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setSuccessMessage('')}
                            aria-label="Close"
                        ></button>
                    </div>
                )}
                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setError('')}
                            aria-label="Close"
                        ></button>
                    </div>
                )}
                <div className="row my-4 h-100">
                    <div className="col-md-6 col-lg-6 col-sm-8 mx-auto">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Account Details</h5>
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <p className="form-control-static">{userData?.name}</p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <p className="form-control-static">{userData?.email}</p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Account Type</label>
                                    <p className="form-control-static">
                                        {userData?.isAdmin ? 'Admin' : 'Regular User'}
                                    </p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Member Since</label>
                                    <p className="form-control-static">
                                        {new Date(userData?.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {userData?.billingAddresses?.length > 0 && (
                            <div className="card mt-4">
                                <div className="card-body">
                                    <h5 className="card-title">Saved Billing Address</h5>
                                    {(() => {
                                        const address = userData.billingAddresses.find(addr => addr.isDefault) ||
                                            userData.billingAddresses[0];

                                        if (isEditing) {
                                            return (
                                                <form onSubmit={handleSaveEdit}>
                                                    <div className="p-3 border rounded">
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <h6>Edit Address</h6>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-secondary"
                                                                onClick={() => {
                                                                    setIsEditing(false);
                                                                    setEditedAddress(null);
                                                                }}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">Street</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="street"
                                                                value={editedAddress.street}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">City</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="city"
                                                                value={editedAddress.city}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">State</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="state"
                                                                value={editedAddress.state}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">ZIP Code</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="zipCode"
                                                                value={editedAddress.zipCode}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">Country</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="country"
                                                                value={editedAddress.country}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                        <button type="submit" className="btn btn-primary">
                                                            Save Changes
                                                        </button>
                                                    </div>
                                                </form>
                                            );
                                        }

                                        return (
                                            <div className="p-3 border rounded">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <h6>Address</h6>
                                                    <div>
                                                        {address.isDefault && (
                                                            <span className="badge bg-primary me-2">Default</span>
                                                        )}
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => handleEdit(address)}
                                                        >
                                                            <i className="fa fa-edit me-1"></i>
                                                            Edit
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="mb-2">
                                                    <strong>Street:</strong> {address.street}
                                                </div>
                                                <div className="mb-2">
                                                    <strong>City:</strong> {address.city}
                                                </div>
                                                <div className="mb-2">
                                                    <strong>State:</strong> {address.state}
                                                </div>
                                                <div className="mb-2">
                                                    <strong>ZIP Code:</strong> {address.zipCode}
                                                </div>
                                                <div className="mb-2">
                                                    <strong>Country:</strong> {address.country}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default UserProfile; 