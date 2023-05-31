import React from "react";
import { Link } from "react-router-dom";
import daily from "../assets/jpg/daily.jpg";
import salary from "../assets/jpg/salary.jpg";
import carosalImage1 from "../assets/jpg/carosal1.jpg";
import carosalImage2 from "../assets/jpg/carosal2.jpg";
import carosalImage3 from "../assets/jpg/carosal3.jpg";
import Card from "./Card";
import kaamdhanda from "../assets/jpg/Logo.png";
import plumberIcon from "../assets/png/plumber.png";
import carpenterIcon from "../assets/png/carpenter.png";
import painterIcon from "../assets/png/painter.png";
import constIcon from "../assets/png/const.png";
import kaamdhandaLogo from "../assets/svg/kaamdhandhaLogo.svg";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export default function Explore() {
  return (
    <>
      {/* logo */}
      <img src={kaamdhandaLogo} alt="kaamdhandha logo" className="kaamlogo" />
      {/* <img src={kaamdhanda} alt="kaamdhandha logo" className="kaamlogo" /> */}

      {/* slider */}
      <Carousel autoPlay interval={3000} infiniteLoop showThumbs={false} showStatus={false}>
        <div>
          <img src={carosalImage1} alt="img1" />
        </div>
        <div>
          <img src={carosalImage2} alt="img2" />
        </div>
        <div>
          <img src={carosalImage3} alt="img3" />
        </div>
      </Carousel>

      <div className="explore">
        {/* slogan */}
        <header>
          <p className=" slogan pageHeader">"Ab Kaam Dhundo Ghar Se"</p>
        </header>
        <main>
          {/* filter */}
          <p className="exploreCategoryHeading">Filters</p>
          <li className="categoryListing">
            {/* plumber */}
            <div>
              <Card>
                <div>
                  <Link to={`/filter-listings`} state={{ distance: "plumber" }}>
                    <img
                      src={plumberIcon}
                      alt="home"
                      className="your-element"
                    />
                  </Link>
                </div>
              </Card>
              <p className="txt-center">plumber</p>
            </div>

            {/* carpenter */}
            <div>
              <Card>
                <div>
                  <Link
                    to={`/filter-listings`}
                    state={{ distance: "carpenter" }}
                  >
                    <img
                      src={carpenterIcon}
                      alt="home"
                      className="your-element"
                    />
                  </Link>
                </div>
              </Card>
              <p className="txt-center">Carpenter</p>
            </div>

            {/* painter */}
            <div>
              <Card>
                <Link to={`/filter-listings`} state={{ distance: "painter" }}>
                  <img src={painterIcon} alt="home" className="your-element" />
                </Link>
              </Card>
              <p className="txt-center">Painter</p>
            </div>

            {/* mason */}
            <div>
              <Card>
                <Link to={`/filter-listings`} state={{ distance: "mistri" }}>
                  <img src={constIcon} alt="home" className="your-element" />
                </Link>
              </Card>
              <p className="txt-center">Mason</p>
            </div>
          </li>

          {/* categories */}
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
