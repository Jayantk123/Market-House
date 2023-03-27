import React from "react";
import { Link } from "react-router-dom";
import daily from "../assets/jpg/daily.jpg";
import salary from "../assets/jpg/salary.jpg";
import a from "../assets/jpg/1.jpg";
import b from "../assets/jpg/2.jpg";
import c from "../assets/jpg/3.jpg";
import sellCategoryImage from "../assets/jpg/sellCategoryImage.jpg";
import Card from "./Card";
import shareVideo from "../assets/jpg/rentCategoryImage.jpg";
import background from "../assets/jpg/rentCategoryImage.jpg";
import logo from "../assets/jpg/rentCategoryImage.jpg";
import kaamdhanda from "../assets/jpg/Logo.png";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

export default function Explore() {
  return (
    <>
      <img
        src={kaamdhanda}
        alt="ffdsf"
        className="kaamlogo 
    "
      />

      <Carousel>
        <div>
          <img src={a} />
          {/* <p className="legend">Legend 1</p> */}
        </div>
        <div>
          <img src={b} />
          {/* <p className="legend">Legend 2</p> */}
        </div>
        <div>
          <img src={c} />
          {/* <p className="legend">Legend 3</p> */}
        </div>
      </Carousel>

      <div className="explore">
        <header>
          <p className="pageHeader">"Ab Kaam Dhundo Ghar Pe"</p>
        </header>
        <main>
          <div className="categoryListing">
            <label className="formLabel">Select Location</label>
            <div>
              <select className="formInputSmall">
                <option value="India">India</option>

                <option value="Banglore">Banglore</option>

                <option value="Nepal">Nepal</option>
                <option value="America">America</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>

          {/* slider */}
          <p className="exploreCategoryHeading">Categories</p>
          <div className="exploreCategories">
            <Link to="/category/daily">
              <img src={daily} alt="daily" className="exploredailysalaryImg" />
              <p className="exploreCategoryName">Daily Wage Workers</p>
            </Link>
            <Link to="/category/salary">
              <img
                src={salary}
                alt="salary"
                className="exploredailysalaryImg"
              />
              <p className="exploreCategoryName">Salary Wage Workers</p>
            </Link>
          </div>
         <br />
         <br />
         <br />
         <br />
        
         
        </main>
      </div>
    </>
  );
}
