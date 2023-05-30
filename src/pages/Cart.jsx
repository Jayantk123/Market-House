import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";
import mapIcon from "../assets/jpg/maplogo.jpeg";
import Card from "../pages/Card";
import React, { useEffect, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { useParams } from "react-router-dom";
import ReactSearchBox from "react-search-box";

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../Components/Spinner";
import ListingItem from "../Components/ListingItem";
import { useGeolocated } from "react-geolocated";
import homeIcon from "../assets/svg/homeIcon.svg";
import plumberIcon from "../assets/png/plumber.png";
import carpenterIcon from "../assets/png/carpenter.png";
import painterIcon from "../assets/png/painter.png";
import distanceIcon from "../assets/png/dis.png";
import starFilterIcon from "../assets/png/starfilter.png";
import incSalaryIcon from "../assets/png/incsalary.png";
import decSalaryIcon from "../assets/png/decsalary.png";
import AddToCart from "./AddToCart";
import CartIcon from "../Components/CartIcon";

export default function Cart() {
  const [isBought, setIsBought] = useState(false); // State to track if worker is bought
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const [search, setSearch] = useState("");
  const [searchlisting, setSearchListing] = useState(null);
  const [authId, setAuthId] = useState("");
  const [distData, setDistData] = useState(null);
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListings = async () => {
      setAuthId(auth.uid ? auth.uid : "");
      try {
        // get reference
        const listingsRef = collection(db, "listings");

        // create query

        const q = query(
          listingsRef,
          // where("userRef", "==", auth.currentUser.uid),

          orderBy("timestamp", "desc")
        );

        // execute query
        const querySnap = await getDocs(q);

        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

        let listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
            buy: doc.data().buy,
          });
        });
        setListing(listings);
        console.log(listings);

        setLoading(false);
      } catch (error) {
        toast.error("Please login first");
      }
    };

    fetchListings();
  }, []);

  let calc;
  //   console.log("cart page");

  console.log(listing);
  //   const trueBuyListings = listing.filter(item => item?.buy === true);
  //   const countTrueBuy = trueBuyListings.length;
  //   console.log(countTrueBuy);
  //   console.log(listing.location.split(",")[0]);
  let trueCount = 0;
  let totalwage = 0;
  // Iterate through the array and count objects with `buy` set to `true`
  for (let i = 0; i < listing?.length; i++) {
    if (listing[i].buy === true) {
      totalwage += parseInt(listing[i].data.rate);
      trueCount++;
    }
  }

  console.log(trueCount + " " + totalwage);

  if (loading) {
    return <Spinner />;
  }

  console.log(auth.currentUser);
  if (auth.currentUser === null) {
    return (
      <>
        <Card>
          <div className="">
            <Link to="/sign-in">Your cart is empty. Please login first.</Link>

            {/* clear funcion */}
            {/* <div>
           
              {searchlisting.length>0 &&( <button onClick={handleClear} className="listingType ">Clear</button>)}
            </div> */}
          </div>
        </Card>
      </>
    );
  }
  return (
    <>
  
      
    
      {!loading && listing?.length > 0 && (
        <>
        <Card>
          <div>
            <p className="cartHeadingText">Added Workers</p>
          </div>

          {/* <p>Your total wage is: {totalwage}</p> */}
          <div
            style={{ display: "flex", alignItems: "center" }}
            className="categoryListing"
          >
            <p className="cartWage">
              Your total wage is: <b>{totalwage}</b>
            </p>
            {/* <button>Make Payment</button> */}

            <button
              type="button"
              className={"paymentButton"}
              id="type"
              value="daily"
            >
              {" "}
              Make Payment
            </button>
          </div>
          </Card>
          {listing.map((listing) => (
            <AddToCart
              key={listing.id}
              listing={listing.data}
              id={listing.id}
              buy={listing.data.buy}
              // onDelete={() => onDelete(listing.id)}
              // onEdit={() => onEdit(listing.id)}
            />
          ))}
        </>
      )}
    </>
    //     <Card>
    //     <li className="categoryListing">
    //       <Link
    //         to={`/category/${listing.type}/${listing.id}`}
    //         className="categoryListingLink"
    //         state={{ distance: dis }}
    //       >
    //         <img
    //           src={listing.imageUrls[0]}
    //           alt={listing.name}
    //           className="categoryListingImg"
    //         />

    //         <div className="categoryListingDetails">
    //           <p className="categoryListingName">
    //             {listing.name}
    //             {/* <p className="listingType">{listing.rating}🌟</p> */}
    //           </p>

    //           {/* <p className="categoryListingLocation">Ph No. : { listing.number}</p> */}
    //           {/* <p className="categoryListingLocation">Experience : { listing.experience}</p> */}
    //           {/* <p className="categoryListingLocation">Age : { listing.age}</p> */}
    //           <p className="listingType">{listing.rating}🌟</p>
    //           <p className="starRating">{listing.work}</p>
    //           {/* <p className="starRating">3.5 🌟</p> */}

    //           <br />
    //            {/* {dis && <p className="starRating">{dis.toFixed(0)} km</p>} */}
    //           {/* <p className="categoryListingLocation">Experience : { listing.experience}</p> */}

    //           {/* <p className>{listing.work}</p> */}
    //           <div style={{ display: "flex", alignItems: "center" }}>
    //           {dis && <p className="starRating">{dis.toFixed(0)} km</p>}
    //             <img src={mapIcon} alt="" style={{ marginRight: "8px" }} />
    //             <p className="categoryListingLocation">
    //               {" "}
    //               {listing.location.split(",")[0] +
    //                 ", " +
    //                 listing.location.split(",")[1]}
    //             </p>
    //           </div>

    //           <p className="ListingPrice">
    //             ₹ {listing.rate === null ? 0 : listing.rate}{" "}
    //             {listing.type === "daily" ? "/day" : "/month"}
    //             {/* ₹{" "}
    //             {listing.rate===null?0:listing.rate
    //                   .toString()
    //                   .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    //             }
    //             { " / Month"} */}
    //           </p>
    //           {/* <div className="categoryListingInfoDiv">
    //           <img src={bedIcon} alt="bed" />
    //           <p className="categoryListingInfoText">
    //             {listing.bedrooms > 1
    //               ? `${listing.bedrooms} Bedrooms`
    //               : "1 Bedroom"}
    //           </p>
    //           <img src={bathtubIcon} alt='bath' />
    //           <p className="categoryListingInfoText">
    //           {listing.bathrooms > 1
    //               ? `${listing.bathrooms} Bathrooms`
    //               : "1 Bathrooms"}
    //           </p>
    //         </div> */}
    //         </div>
    //       </Link>

    //       {onDelete && (
    //         <DeleteIcon
    //           className="removeIcon"
    //           fill="rgb(231,76,60)"
    //           onClick={() => onDelete(listing.id, listing.name)}
    //         />
    //       )}
    //       {onEdit && <EditIcon className="editIcon" onClick={() => onEdit(id)} />}
    //     </li>
    //   </Card>
  );
}
