import React, { useState } from 'react';
import { Navbar, Footer } from '../components';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const ManageBilling = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            console.log('Form state updated:', newState); // Debug log
            return newState;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                navigate('/login');
                return;
            }

            if (!formData.address || !formData.city || !formData.state || !formData.zipCode || !formData.country) {
                setError('Please fill in all required fields');
                return;
            }

            const billingAddress = {
                street: formData.address.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                zipCode: formData.zipCode.trim(),
                country: formData.country.trim()
            };

            const response = await axios.put('/api/users/profile/billing', billingAddress, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data) {
                setSuccess('Billing details saved successfully!');
                setError('');
                setFormData({
                    address: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: ''
                });
                navigate('/profile');
            }
        } catch (err) {
            console.error('Error saving billing address:', err);
            if (err.response?.status === 401) {
                setError('Your session has expired. Please login again.');
                localStorage.removeItem('userToken');
                navigate('/login');
            } else {
                setError(err.response?.data?.message || 'Failed to save billing details. Please try again.');
            }
            setSuccess('');
        }
    };

    return (
        <>
            <Navbar />
            <div className="container my-3 py-3">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title text-center mb-4">Save Billing Details</h2>

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

                                {success && (
                                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                                        {success}
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setSuccess('')}
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="address" className="form-label">Street Address *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Enter street address"
                                            autoComplete="off"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="city" className="form-label">City *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Enter city"
                                            autoComplete="off"
                                        />
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="country" className="form-label">Country *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="country"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter country"
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="state" className="form-label">State *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="state"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter state"
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="zipCode" className="form-label">ZIP Code *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="zipCode"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Enter ZIP code"
                                            autoComplete="off"
                                        />
                                    </div>

                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-primary">
                                            Save Details
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ManageBilling; 