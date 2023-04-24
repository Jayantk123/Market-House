import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";
import mapIcon from "../assets/jpg/maplogo.jpeg";
import Card from "../pages/Card";


export default function AddToCart({ listing, id, dis, buy, onEdit, onDelete }) {
  const [isBought, setIsBought] = useState(false); // State to track if worker is bought



//   console.log("cart page");
console.log(buy);
  console.log(listing);

//   console.log(listing.location.split(",")[0]);

  if(listing.buy) {
    
console.log("true");
    return (

        <Card>
        <li className="categoryListing">
          <Link
            to={`/category/${listing.type}/${id}`}
            className="categoryListingLink"
            state={{ distance: dis }}
          >
            <img
              src={listing.imageUrls[0]}
              alt={listing.name}
              className="categoryListingImg"
            />
  
            <div className="categoryListingDetails">
              <p className="categoryListingName">
                {listing.name} 
                {/* <p className="listingType">{listing.rating}🌟</p> */}
              </p>
  
              {/* <p className="categoryListingLocation">Ph No. : { listing.number}</p> */}
              {/* <p className="categoryListingLocation">Experience : { listing.experience}</p> */}
              {/* <p className="categoryListingLocation">Age : { listing.age}</p> */}
              <p className="listingType">{listing.rating}🌟</p>
              <p className="starRating">{listing.work}</p>
              {/* <p className="starRating">3.5 🌟</p> */}
             
            
  
              <br />
               {/* {dis && <p className="starRating">{dis.toFixed(0)} km</p>} */}
              {/* <p className="categoryListingLocation">Experience : { listing.experience}</p> */}
  
              {/* <p className>{listing.work}</p> */}
              <div style={{ display: "flex", alignItems: "center" }}>
              {dis && <p className="starRating">{dis.toFixed(0)} km</p>}
                <img src={mapIcon} alt="" style={{ marginRight: "8px" }} />
                <p className="categoryListingLocation">
                  {" "}
                  {listing.location.split(",")[0] +
                    ", " +
                    listing.location.split(",")[1]}
                </p>
              </div>
  
              <p className="ListingPrice">
                ₹ {listing.rate === null ? 0 : listing.rate}{" "}
                {listing.type === "daily" ? "/day" : "/month"}
                {/* ₹{" "}
                {listing.rate===null?0:listing.rate
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                { " / Month"} */}
              </p>
              {/* <div className="categoryListingInfoDiv">
              <img src={bedIcon} alt="bed" />
              <p className="categoryListingInfoText">
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Bedrooms`
                  : "1 Bedroom"}
              </p>
              <img src={bathtubIcon} alt='bath' />
              <p className="categoryListingInfoText">
              {listing.bathrooms > 1
                  ? `${listing.bathrooms} Bathrooms`
                  : "1 Bathrooms"}
              </p>
            </div> */}
            </div>
          </Link>
         
          {onDelete && (
            <DeleteIcon
              className="removeIcon"
              fill="rgb(231,76,60)"
              onClick={() => onDelete(listing.id, listing.name)}
            />
          )}
          {onEdit && <EditIcon className="editIcon" onClick={() => onEdit(id)} />}
        </li>
      </Card>
    )
  }
  
}
