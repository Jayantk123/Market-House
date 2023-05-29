import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import { useLocation } from "react-router-dom";
import schemeData from "../assets/govSchemes/govSchemesData.json";

// import Card from "../Components/Card";
import Spinner from "../Components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";
import Card from "./Card";
import { toast } from "react-toastify";
import CartIcon from "../Components/CartIcon";

// modal
import Modal from "react-modal";
Modal.setAppElement("#root");

// import Rating from "rc-ratings"; 
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setSetShareLinkCopied] = useState(false);
  const [buy, setBuy] = useState(false);
  const [eligibleScheme, setEligibleScheme] = useState(" ");

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const auth = getAuth();
  let eligibleSchemes;

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setBuy(docSnap.data().buy);
        // console.log(docSnap.data());
        setLoading(false);
      }
    };

    fetchListing();

    // Handle the eligible schemes as needed (e.g., display them on the page)
  }, [navigate, params.listingId]);

  console.log(listing);
  console.log(buy);
  if (loading) return <Spinner />;

  const eligibleGovSchemes = (e) => {
    console.log(listing);
    const { age } = listing;
    eligibleSchemes = schemeData.filter((scheme) => {
      return (
        scheme.eligibilityAge <= age &&
        scheme.workType.toLowerCase() === listing.work.toLowerCase()
      );
    });
    setEligibleScheme(eligibleSchemes);
    console.log(eligibleSchemes);
    openModal();
  };
  const limitedgovSchemes = Object.values(eligibleScheme).slice(0, 5);

  const ratingChanged = (newRating) => {
    console.log(newRating);
  };

  const currentDistance = location.state?.distance;
  // const {form}=Listing.state
  console.log(currentDistance);

  const handleBuyClick = async () => {
    const docRef = doc(db, "listings", params.listingId);
    await updateDoc(docRef, {
      buy: true,
    });
    setBuy(true);

    toast.success("Added to Card");
  };
  const handleRemoveClick = async () => {
    const confirmResult = window.confirm(
      "Are you sure you want to remove this item?"
    );
    if (confirmResult) {
      const docRef = doc(db, "listings", params.listingId);
      await updateDoc(docRef, {
        buy: false,
      });
      setBuy(false);

      toast.success("Removed from cart");
    }
  };
  console.log(eligibleSchemes);
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
              <div className="samerow">
                <p className="categoryListingLocation">Age : {listing.age}</p>
                {currentDistance && (
                  <p className="categoryListingLocation">
                    {currentDistance.toFixed(0)} Km
                  </p>
                )}
              </div>
              <p className="listingStar">⭐⭐⭐⭐⭐</p>
              {/* //////////////////////////////////////////////// */}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
          }}
        >
          {!buy ? (
            <button className="formButtonActive" onClick={handleBuyClick}>
              buy
            </button>
          ) : (
            <button
              className="formButtonActiveRemove"
              onClick={handleRemoveClick}
            >
              remove
            </button>
          )}
          <button className="govSchemes" onClick={eligibleGovSchemes}>
            GovSchemes
          </button>
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="New Page"
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        <div className="modal-header">
          <h2>You are eligible for these schemes.</h2>
          <button className="close-button" onClick={closeModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          {Object.values(limitedgovSchemes).map((schemes, key) => (
            <p>
              <b>{schemes.schemeName}</b>: {schemes.description}
            </p>
          ))}
          <p>{eligibleSchemes}</p>
        </div>
      </Modal>
    </main>
  );
}
