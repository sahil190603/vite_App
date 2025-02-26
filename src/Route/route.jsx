import React from "react";
import { Routes, Route } from "react-router-dom"; 
import Home from "../pages/Home";
import About from "../pages/About";
import Stock from "../pages/Stock";

function MainRoute () {
  return (
    <div >
      <Routes  >
        <Route path="/" element={<Home />} />
        <Route path="/Contact_us" element={<About/>} />
        <Route path="/Predict" element={<Stock />}></Route>
      </Routes>
    </div>
  );
};

export default MainRoute;
