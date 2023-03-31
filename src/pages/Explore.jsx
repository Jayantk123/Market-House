import React from "react";
import { Link } from "react-router-dom";
import daily from "../assets/jpg/daily.jpg";
import salary from "../assets/jpg/salary.jpg";
import a from "../assets/jpg/1.jpg";
import carosalImage1 from "../assets/jpg/carosal1.jpg";
import carosalImage2 from "../assets/jpg/carosal2.jpg";
import carosalImage3 from "../assets/jpg/carosal3.jpg";
import b from "../assets/jpg/2.jpg";
import c from "../assets/jpg/3.jpg";
import sellCategoryImage from "../assets/jpg/sellCategoryImage.jpg";
import Card from "./Card";
import shareVideo from "../assets/jpg/rentCategoryImage.jpg";
import background from "../assets/jpg/rentCategoryImage.jpg";
import logo from "../assets/jpg/rentCategoryImage.jpg";
import kaamdhanda from "../assets/jpg/Logo.png";
import plumberIcon from "../assets/png/plumber.png";
import carpenterIcon from "../assets/png/carpenter.png";
import painterIcon from "../assets/png/painter.png";
import distanceIcon from "../assets/png/dis.png";
import mistriIcon from "../assets/png/mistri.png";
import constIcon from "../assets/png/const.png";

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
          <img src={carosalImage1} />
          {/* <p className="legend">Legend 1</p> */}
        </div>
        <div>
          <img src={carosalImage2} />
          {/* <p className="legend">Legend 2</p> */}
        </div>
        <div>
          <img src={carosalImage3} />
          {/* <p className="legend">Legend 3</p> */}
        </div>
      </Carousel>

      <div className="explore">
        <header>
          <p className=" slogan pageHeader">"Ab Kaam Dhundo Ghar Se"</p>
        </header>
        <main>
          {/* <Link to="/location" state={"aff"}>
              
              <p className="exploreCategoryName">Daily Wage Workers</p>
            </Link> */}
          {/* <div className="categoryListing">
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
          </div> */}

          {/* slider */}

          <li className="categoryListing">
            <div>
              <Card>
                <div>
                  <img
                    src={plumberIcon}
                    alt="home"
                    className="your-element"
                    // onClick={() => shortCutSearch("plumber")}
                  />
                </div>
              </Card>
              <p className="txt-center">plumber</p>
            </div>

            {/* <p
                className="listingType"
                onClick={() => shortCutSearch("plumber")}
              >
                Plumber
              </p> */}

            <div>
              <Card>
                <div>
                  <img
                    src={carpenterIcon}
                    alt="home"
                    className="your-element"
                    // onClick={() => shortCutSearch("carpenter")}
                  />

                  {/* <p
                className="listingType"
                onClick={() => shortCutSearch("carpenter")}
              >
                Carpenter
              </p> */}
                </div>
              </Card>
              <p className="txt-center">Carpenter</p>
            </div>

            <div>
              <Card>
                <img
                  src={painterIcon}
                  alt="home"
                  className="your-element"
                  // onClick={() => shortCutSearch("painter")}
                />
              </Card>
              <p className="txt-center">Painter</p>
            </div>
            {/* <p
                className="listingType"
                onClick={() => shortCutSearch("painter")}
              >
                Painter
              </p> */}

<div>
            <Card>
              <img
                src={constIcon}
                alt="home"
                className="your-element"
                // onClick={() => shortCutSearch("distance")}
              />
            

              {/* <p
                className="listingType"
                onClick={() => shortCutSearch("distance")}
              >
                Distance
              </p> */}
            </Card>
            <p className="txt-center">Mason</p>
            </div>
          </li>

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
