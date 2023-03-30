import React from 'react'
import { useGeolocated } from "react-geolocated";
import  { useEffect, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { useParams } from "react-router-dom";
import ReactSearchBox from "react-search-box";
import Card from "./Card";
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



export default function Location() {

    const params = useParams();
    const auth = getAuth();
  
    console.log(auth.currentUser);

    const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  const [authId, setAuthId]= useState('RYVrHoDFWmN3sDz2enxgVBuo1tx1')



 



  useEffect(() => {
    const fetchUserListings = async () => {
        setAuthId(auth?auth.uid:'')
      const listingsRef = collection(db, "listings");

      const q = query(
        listingsRef,
        where("userRef", "==", authId),
        orderBy("timestamp", "desc"),
        limit(10)
      );

      const querySnap = await getDocs(q);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchUserListings();
  }, []);

  console.log(listings)
    const calculateDistance=(lattitude1, longittude1,lattitude2,longittude2)=>
    {
        
    const toRadian = n => (n * Math.PI) / 180
    
        let lat2 = lattitude2
        let lon2 = longittude2
        let lat1 = lattitude1
        let lon1 = longittude1
    
        console.log(lat1, lon1+"==="+lat2, lon2)
        let R = 6371  // km
        let x1 = lat2 - lat1
        let dLat = toRadian(x1)
        let x2 = lon2 - lon1
        let dLon = toRadian(x2)
        let a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        let d = R * c
        console.log("distance==?",d)
       
          }

    const { coords, isGeolocationAvailable, isGeolocationEnabled } =  useGeolocated({
        positionOptions: {
            enableHighAccuracy: false,
        },
        userDecisionTimeout: 5000,
    });

  
    return !isGeolocationAvailable ? (
        <div></div>
    ) : !isGeolocationEnabled ? (
        <div></div>
    ) : coords ? (
        <>
        <table>
            <tbody>
                <tr>
                    <td>latitude</td>
                    <td>{coords.latitude}</td>
                </tr>
                <tr>
                    <td>longitude</td>
                    <td>{coords.longitude}</td>
                </tr>
              
            </tbody>
        </table>

        {/* <ul>
        {locations.filter(location => location !== selectedLocation).map(location => (
          <li key={location.name}>
            {location.name}: {calculateDistance(selectedLocation.latitude, selectedLocation.longitude, location.latitude, location.longitude).toFixed(2)} km
          </li>
        ))}
      </ul> */}
     
     {calculateDistance(coords.latitude,coords.longitude,coords.latitude,coords.longitude)
     
}
{listings && listings.map((listing) => (
                

                //  <h1 key={listing.id}>{listing.data.geolocation.lat}</h1>
               
                <h1> {calculateDistance(coords.latitude,coords.longitude,listing.data.geolocation.lat,listing.data.geolocation.lng)
     
                }</h1>
                ))}
        </>
    ) : (
        <div>Getting the location data&hellip; </div>
    );

   
  
}

