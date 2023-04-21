import React, { useEffect, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { useLocation, useParams } from "react-router-dom";
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
import { useGeolocated } from "react-geolocated";
import homeIcon from "../assets/svg/homeIcon.svg";
import plumberIcon from "../assets/png/plumber.png";
import carpenterIcon from "../assets/png/carpenter.png";
import painterIcon from "../assets/png/painter.png";
import distanceIcon from "../assets/png/dis.png";
import Loader from "../Components/Loader";

export default function FilterListing() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const [search, setSearch] = useState("");
  const [searchlisting, setSearchListing] = useState(null);
  const [authId, setAuthId] = useState("RYVrHoDFWmN3sDz2enxgVBuo1tx1");
  const [distData, setDistData] = useState(null);
  const params = useParams();
  const auth = getAuth();
  const location = useLocation();
  const currentDistance = location.state?.distance;
  useEffect(() => {
    const fetchListings = async () => {
      setAuthId(auth.uid ? auth.uid : "");
      try {
        // get reference
        const listingsRef = collection(db, "listings");

        // create query

        const q = query(
          listingsRef,
          where("userRef", "==", authId),
          //   where("work", "==", currentDistance),
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
          });
        });

        const data = listings.filter(
          (listing) =>
            listing.data.work.toLowerCase() === currentDistance.toLowerCase()
        );
        // console.log(data);
        if (data.length === 0) {
          toast.error("No result found");
        }

        setListings(data);
        setLoading(false);

        //

        // if (search === "") {
        //     toast.error("Please enter something");
        //   } else {
        //     // console.log(listings);
        //     const data = listings.filter(
        //       (listing) => listing.data.work.toLowerCase() === search.toLowerCase()
        //     );
        //     // console.log(data);
        //     if (data.length === 0) {
        //       toast.error("No result found");
        //     }
        //     setSearchListing(data);
        //     setSearch("");
        //     console.log(searchlisting);

        //
      } catch (error) {
        toast.error("Could not fetch listings");
      }
    };

    fetchListings();
  }, []);

  // pagination...load more
  const onFetchMoreListings = async () => {
    try {
      // get reference
      const listingsRef = collection(db, "listings");

      // create query

      const q = query(
        listingsRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(10)
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
        });
      });
      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch listings");
    }
  };

  const onChange = (e) => {
    setSearch(e.target.value);
  };

  const searchFilter = (search) => {
    if (search === "") {
      toast.error("Please enter something");
    } else {
      // console.log(listings);
      const data = listings.filter(
        (listing) => listing.data.work.toLowerCase() === search.toLowerCase()
      );
      // console.log(data);
      if (data.length === 0) {
        toast.error("No result found");
      }
      setSearchListing(data);
      setSearch("");
      console.log(searchlisting);
      // setSearchListing(listings.filter((blog)=>
      //   blog.work.toLowerCase().includes(search.toLowerCase())
      // ))

      // console.log(searchlisting);
    }
  };
  const abc = async (e) => {
    e.preventDefault();
    searchFilter(search);
  };

  const handleClear = async () => {};

  const calculateDistance = (
    lattitude1,
    longittude1,
    lattitude2,
    longittude2
  ) => {
    const toRadian = (n) => (n * Math.PI) / 180;

    let lat2 = lattitude2;
    let lon2 = longittude2;
    let lat1 = lattitude1;
    let lon1 = longittude1;

    // console.log(lat1, lon1 + "===" + lat2, lon2);
    let R = 6371; // km
    let x1 = lat2 - lat1;
    let dLat = toRadian(x1);
    let x2 = lon2 - lon1;
    let dLon = toRadian(x2);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadian(lat1)) *
        Math.cos(toRadian(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d;
    // console.log("distance==?", d);
  };

  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  const findNearWorkers = () => {
    if (!isGeolocationAvailable) {
      toast.error("Your browser does not support Geolocation");
    } else if (!isGeolocationEnabled) {
      toast.error("Geolocation is not enabled");
    } else if (coords) {
      // {listings && listings.map((listing) => (
      // const distance= calculateDistance(coords.latitude,coords.longitude,listing.data.geolocation.lat,listing.data.geolocation.lng)

      // ))}

      const newArray = listings.map((item, index) => {
        // console.log(item.data.geolocation.lat+"==="+coords.latitude);
        const distance = calculateDistance(
          coords.latitude,
          coords.longitude,
          item.data.geolocation.lat,
          item.data.geolocation.lng
        );
        //  console.log(distance);
        return {
          ...item,
          dis: distance,
        };
      });
      setDistData(newArray);
      setSearchListing(null);

      const lowdistance = newArray.filter((data) => data.dis < 100);
      lowdistance.map((content) => {
        console.log(content);
      });
      // console.log(lowdistance+"low dis");

      // setSearchListing(newArray)
      // console.log(newArray[0].dis);

      // console.log(coords.longitude + " " + coords.latitude);
    }
  };

  const shortCutSearch = (constsearch) => {
    if (constsearch === "distance") {
      findNearWorkers();

      console.log("distance");
    } else {
      console.log(constsearch);
      searchFilter(constsearch);
    }
    // const data = listings.filter(
    //   (listing) => listing.data.work.toLowerCase() === constsearch.toLowerCase()
    // );
    // // console.log(data);
    // if (data.length === 0) {
    //   toast.error("No result found");
    // }
    // console.log(data);
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="category">
      <header>
        <Card>Listings</Card>

        {/* <h2 className="listingTitle">Listings</h2> */}
        <div className="setstyle">
          {/* 
          <form onSubmit={handleSubmit}>
            <input
              onChange={onChange}
              placeholder="Search for worker here"
              value={search}
            />
            <button type="submit">Search</button>
          </form> */}
        </div>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            {searchlisting && searchlisting.length > 0 ? (
              <ul className="categoryListings">
                {searchlisting.map((listing) => (
                  // console.log(listing)

                  <ListingItem
                    listing={listing.data}
                    id={listing.id}
                    key={listing.id}
                  />
                ))}
              </ul>
            ) : distData && distData.length ? (
              <>
                {distData.map((listing) => (
                  // console.log(listing)

                  <ListingItem
                    listing={listing.data}
                    id={listing.id}
                    dis={listing.dis}
                    key={listing.id}
                  />
                ))}
              </>
            ) : (
              <ul className="categoryListings">
                {listings.map((listing) => (
                  // console.log(listing)

                  <ListingItem
                    listing={listing.data}
                    id={listing.id}
                    key={listing.id}
                  />
                ))}
              </ul>
            )}

            {/* <ul className="categoryListings">
              {listings.map((listing) => (
                // console.log(listing)

                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul> */}
          </main>
          <br />
          <br />
          {lastFetchedListing && (
            <p className="loadMore" onClick={onFetchMoreListings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>There are no current workers.</p>
      )}
    </div>
  );
}