import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";

// import Card from "../Components/Card";
import Spinner from "../Components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";
import Card from "./Card";

// import Rating from "rc-ratings";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setSetShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) return <Spinner />;

  // console.log(listing.imageUrls[0]);
  const ratingChanged = (newRating) => {
    console.log(newRating);
  };
  return (
    <main>
      <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {listing.imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${listing.imageUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
              className="swiperSlideDiv"
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setSetShareLinkCopied(true);
          setTimeout(() => {
            setSetShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="" />
       
      </div>
      {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}

    
      <div className="listingDetails">
        <div className="categoryListing">
          <img
            src={listing.imageUrls[0]}
            alt={listing.name}
            className="categoryListingImg"
          />

          <div className="categoryListingDetails">
            <p className="listingName">
              {listing.name} - ₹
              {listing.rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
            <p className="listingLocation">{listing.location} </p>

            <p className="listingType">
              {listing.type === "daily" ? "Daily" : "Salary"} Worker
            </p>
            <p className="listingType">{listing.work}</p>
            {listing.offer && (
              <p className="discountPrice">
                ${listing.regularPrice - listing.discountedPrice} discount
              </p>
            )}

            <div className="categoryListingDetails">
              <p className="categoryListingLocation">
                Ph No. : {listing.number}
              </p>
              <p className="categoryListingLocation">
                Experience : {listing.experience}
              </p>
              <p className="categoryListingLocation">Age : {listing.age}</p>
              <p>⭐⭐⭐⭐⭐</p>
            </div>
            <ul className="listingDetailsList">
              <li>{listing.parking && "Parking Spot"}</li>
              <li>{listing.furnished && "Furnished"}</li>
            </ul>
          </div>
        </div>

        <h2 className="listingLocationTitle">Feedback</h2>
        <Card>
       
          <p>
            "Great job on completing the project ahead of schedule, your hard
            work is much appreciated!"
          </p>
        </Card>
        <Card>
          <p>
            ""Your presentation was well-organized and engaging, you did a great
            job communicating the key points effectively."
          </p>
        </Card>

        {/* <Card>
          <div className="text-display">
            <h4>Ankush~</h4>
            <p>
              "I appreciated that you were on time for the job" or "I noticed
              that you forgot to clean up after finishing the work."
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-display">
            <h4>Akshay~</h4>
            <p>
              "Great job on that project! Your attention to detail and ability
              to work efficiently made a significant impact on the team's
              success."
            </p>
          </div>
        </Card>
      */}

        <p className="listingLocationTitle">Location</p>

        <div className="leafletContainer">
          <MapContainer
            style={{ height: "100%", width: "100%" }}
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
            />

            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className="primaryButton"
          >
            Contact Landlord
          </Link>
          
        )}
        
      </div>
    </main>
  );
}
