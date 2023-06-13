import React, {Suspense} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Explore from "./pages/Explore";
import Offers from "./pages/Offers";
import ChatBot from 'react-simple-chatbot';
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Category from "./pages/Category";
import Navbar from "./Components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PrivateRoute } from "./Components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import Contact from "./pages/Contact";
import EditListing from "./pages/EditListing";
import CreateWorkerListing from "./pages/CreateWorkerListing";
import CreateWorkerListingHindi from "./pages/CreateWorkerListingHindi";
import Location from "./pages/Location";
import SpeechInput from "./pages/SpeechInput";
import FilterListing from "./pages/FilterListing";
import Cart from "./pages/Cart"





export default function App() {
  return (
    <>
      <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/speech" element={<SpeechInput />} />
          <Route path="/filter-listings" element={<FilterListing />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* <Route path="/create-listing" element={<CreateListing />} /> */}
          <Route path="/create-worker-listing-hindi" element={<CreateWorkerListingHindi />} />
          <Route path="/create-worker-listing" element={<CreateWorkerListing />} />
          <Route path='/edit-listing/:listingId' element={<EditListing />} />         
           <Route
            path="/category/:categoryName/:listingId"
            element={<Listing />}
          />
          <Route path="/contact/:landloardId/" element={<Contact />} />
          <Route path="/location" element={<Location />} />
          <Route path="/cart" element={<Cart/>} />
        
          
        
          
        </Routes>

    
      </Router>
      <ToastContainer />
      <Suspense/>
    </>
  );
}
