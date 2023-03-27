import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";
// import Card from "./Card";
import bedIcon from "../assets/svg/bedIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";

export default function ListingItem({ listing, id , onEdit, onDelete }) {
  return (
    <li className="categoryListing">
      <Link
        to={`/category/${listing.type}/${id}`}
        className="categoryListingLink"
      >
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className="categoryListingImg"
        />
        <div className="categoryListingDetails">
          <p className="categoryListingLocation">{listing.location}</p>
          <p className="categoryListingName">{listing.name}</p>
          <p className="listingType">{listing.work}</p>
          <p className="categoryListingLocation">Ph No. : { listing.number}</p>
          <p className="categoryListingLocation">Experience : { listing.experience}</p>
          <p className="categoryListingLocation">Age : { listing.age}</p>
          <p className="categoryListingPrice">
            
          ₹{" "} {listing.rate===null?0:listing.rate}
        
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
        <DeleteIcon className="removeIcon" fill='rgb(231,76,60)' onClick={()=>onDelete(
            listing.id,listing.name)
        }/>
      )}
      {onEdit && (
        <EditIcon className="editIcon"
        onClick={()=> onEdit(id)}
        />
      )}
    </li>
  );
}
