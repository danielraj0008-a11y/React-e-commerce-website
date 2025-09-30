import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar, Footer } from "./components";
import {
    Home,
    About,
    Contact,
    Cart,
    Login,
    Register,
    Checkout,
    PageNotFound,
    Product,
    Products,
    Success,
    UserProfile,
    BillingDetails,
    ManageBilling
} from "./pages";

const App = () => {
    return (
        <Router>
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/product/:id" element={<Product />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/success" element={<Success />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/billing-details" element={<BillingDetails />} />
                        <Route path="/manage-billing" element={<ManageBilling />} />
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App; 