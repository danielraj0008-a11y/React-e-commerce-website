import React, { useState, useEffect } from "react";
import { Navbar, Footer } from "../components";
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const BillingDetails = () => {
    const [billingAddress, setBillingAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBillingAddress = async () => {
            try {
                const token = localStorage.getItem('userToken');
                if (!token) {
                    setError('Please login to view billing details');
                    setLoading(false);
                    navigate('/login');
                    return;
                }

                const response = await axios.get('/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.billingAddress) {
                    setBillingAddress(response.data.billingAddress);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching billing address:', err);
                if (err.response?.status === 401) {
                    setError('Your session has expired. Please login again.');
                    localStorage.removeItem('userToken');
                    navigate('/login');
                } else {
                    setError(err.response?.data?.message || 'Failed to fetch billing details');
                }
                setLoading(false);
            }
        };

        fetchBillingAddress();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBillingAddress(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('userToken');
            console.log('Token:', token);

            if (!token) {
                setError('Please login to save billing details');
                navigate('/login');
                return;
            }

            console.log('Sending billing data:', billingAddress);
            const response = await axios.put('/api/users/profile/billing', billingAddress, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Server response:', response.data);

            setSuccess('Billing details saved successfully!');
            setTimeout(() => {
                setSuccess('');
                navigate('/profile');
            }, 2000);
        } catch (err) {
            console.error('Error saving billing address:', err);
            console.error('Error response:', err.response);
            console.error('Error message:', err.message);
            console.error('Error status:', err.response?.status);
            console.error('Error data:', err.response?.data);

            if (err.response?.status === 401) {
                setError('Your session has expired. Please login again.');
                localStorage.removeItem('userToken');
                navigate('/login');
            } else {
                setError(err.response?.data?.message || 'Failed to save billing details. Please try again.');
            }
        }
    };

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

    return (
        <>
            <Navbar />
            <div className="container my-3 py-3">
                <h1 className="text-center">Billing Details</h1>
                <hr />
                <div className="row my-4 h-100">
                    <div className="col-md-6 col-lg-6 col-sm-8 mx-auto">
                        <div className="card">
                            <div className="card-body">
                                {error && (
                                    <div className="alert alert-danger">
                                        {error}
                                        {error.includes('session has expired') && (
                                            <div className="mt-2">
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => navigate('/login')}
                                                >
                                                    Go to Login
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {success && <div className="alert alert-success">{success}</div>}

                                <form onSubmit={handleSave}>
                                    <div className="mb-3">
                                        <label htmlFor="street" className="form-label">Street</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="street"
                                            name="street"
                                            value={billingAddress.street}
                                            onChange={handleInputChange}
                                            placeholder="Enter street address"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="city" className="form-label">City</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="city"
                                            name="city"
                                            value={billingAddress.city}
                                            onChange={handleInputChange}
                                            placeholder="Enter city"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="state" className="form-label">State</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="state"
                                            name="state"
                                            value={billingAddress.state}
                                            onChange={handleInputChange}
                                            placeholder="Enter state"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="zipCode" className="form-label">ZIP Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="zipCode"
                                            name="zipCode"
                                            value={billingAddress.zipCode}
                                            onChange={handleInputChange}
                                            placeholder="Enter ZIP code"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="country" className="form-label">Country</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="country"
                                            name="country"
                                            value={billingAddress.country}
                                            onChange={handleInputChange}
                                            placeholder="Enter country"
                                            required
                                        />
                                    </div>
                                    <div className="d-flex justify-content-between mt-4">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => navigate('/profile')}
                                        >
                                            <i className="fa fa-arrow-left me-2"></i>
                                            Back to Profile
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            <i className="fa fa-save me-2"></i>
                                            Save Billing Details
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

export default BillingDetails; 