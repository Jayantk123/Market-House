import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";
import mapIcon from "../assets/jpg/maplogo.jpeg";
import Card from "../pages/Card";

export default function ListingItem({ listing, id, dis, onEdit, onDelete }) {
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
            <p className="categoryListingName">{listing.name}</p>

            <p className="listingType">{listing.rating}🌟</p>
            <p className="starRating">{listing.work}</p>

            <br />

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
            </p>
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
  );
}
