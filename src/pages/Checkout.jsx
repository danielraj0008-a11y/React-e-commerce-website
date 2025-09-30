import React, { useRef, useState } from "react";
import { Footer, Navbar } from "../components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../utils/axios";

const Checkout = () => {
  const state = useSelector((state) => state.handleCart);
  const formRef = useRef(null);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData.entries());

    try {
      const orderData = {
        orderItems: state.map(item => ({
          name: item.title,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item.id
        })),
        shippingAddress: {
          address: data.address,
          city: data.city,
          state: data.state,
          postalCode: data.zip,
          country: data.country
        },
        paymentMethod: paymentMethod,
        itemsPrice: state.reduce((acc, item) => acc + (item.price * item.qty), 0),
        shippingPrice: 30.0,
        totalPrice: state.reduce((acc, item) => acc + (item.price * item.qty), 0) + 30.0
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        window.location.href = '/success';
      } else {
        throw new Error('Order submission failed');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to process your order. Please try again.');
    }
  };

  const handleSaveBillingDetails = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setSaveError('Please login to save billing details');
        return;
      }

      const formData = new FormData(formRef.current);
      const data = Object.fromEntries(formData.entries());

      if (!data.firstName || !data.lastName || !data.email || !data.address || !data.state || !data.zip) {
        setSaveError('Please fill in all required fields');
        return;
      }

      const billingDetails = {
        street: data.address.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        zipCode: data.zip.trim(),
        country: 'India'
      };

      const response = await axios.put('/api/users/profile/billing', billingDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        setSaveSuccess('Billing details saved successfully!');
        setSaveError('');
        setTimeout(() => {
          setSaveSuccess('');
        }, 3000);
      }
    } catch (err) {
      console.error('Error saving billing details:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);

      if (err.response?.status === 401) {
        setSaveError('Your session has expired. Please login again.');
        localStorage.removeItem('userToken');
      } else if (err.response?.data?.message) {
        setSaveError(err.response.data.message);
      } else {
        setSaveError('Failed to save billing details. Please try again.');
      }
      setSaveSuccess('');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Checkout</h1>
        <hr />
        {state.length ? (
          <div className="row my-4">
            <div className="col-md-12">
              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="firstName" className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        name="firstName"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="lastName" className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        name="lastName"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="city" className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        id="city"
                        name="city"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="state" className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        id="state"
                        name="state"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="zip" className="form-label">ZIP Code</label>
                      <input
                        type="text"
                        className="form-control"
                        id="zip"
                        name="zip"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  {saveSuccess && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                      {saveSuccess}
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setSaveSuccess('')}
                        aria-label="Close"
                      ></button>
                    </div>
                  )}
                  {saveError && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                      {saveError}
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setSaveError('')}
                        aria-label="Close"
                      ></button>
                    </div>
                  )}
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={handleSaveBillingDetails}
                  >
                    <i className="fa fa-save me-2"></i>
                    Save Details
                  </button>
                </div>

                <hr className="my-4" />

                <div className="mb-3">
                  <label className="form-label">Payment Method</label>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="creditCard"
                      name="paymentMethod"
                      value="creditCard"
                      checked={paymentMethod === 'creditCard'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="creditCard">
                      Credit Card
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="upi"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="upi">
                      UPI Payment
                    </label>
                  </div>
                </div>

                {paymentMethod === 'creditCard' && (
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="cardNumber" className="form-label">Card Number</label>
                        <input
                          type="text"
                          className="form-control"
                          id="cardNumber"
                          name="cardNumber"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="cardName" className="form-label">Name on Card</label>
                        <input
                          type="text"
                          className="form-control"
                          id="cardName"
                          name="cardName"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="expiry" className="form-label">Expiry Date</label>
                        <input
                          type="text"
                          className="form-control"
                          id="expiry"
                          name="expiry"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="cvv" className="form-label">CVV</label>
                        <input
                          type="text"
                          className="form-control"
                          id="cvv"
                          name="cvv"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="mb-3">
                    <label htmlFor="upiId" className="form-label">UPI ID</label>
                    <input
                      type="text"
                      className="form-control"
                      id="upiId"
                      name="upiId"
                      placeholder="username@upi"
                      required
                    />
                  </div>
                )}

                <button type="submit" className="btn btn-primary">
                  Place Order
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h4>No items in cart</h4>
            <Link to="/" className="btn btn-outline-dark">
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
