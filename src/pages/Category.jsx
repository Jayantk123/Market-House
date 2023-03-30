import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import Card from "./Card";

export default function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const [search, setSearch] = useState("");
  const [searchlisting, setSearchListing] = useState(null);
  

  const params = useParams();

  const onChange = (e) => {
    setSearch(e.target.value);
  };
  const abc = async (e) => {
    e.preventDefault();
    searchFilter(search);
  };
  const searchFilter = (search) => {
    console.log(listings);
    if (search === "") {
      toast.error("Please enter something");
    } else {
      const data = listings.filter(
        (listing) => listing.data.work.toLowerCase() === search.toLowerCase()
      );
      // console.log(data);
      if (data.length === 0) {
        toast.error("No result found");
      }
      console.log(data);
      setSearchListing(data);
      setSearch("");
      console.log(searchlisting);
      // setSearchListing(listings.filter((blog)=>
      //   blog.work.toLowerCase().includes(search.toLowerCase())
      // ))

      // console.log(searchlisting);
    }
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // get reference
        const listingsRef = collection(db, "listings");

        // create query

        const q = query(
          listingsRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        // execute query
        const querySnap = await getDocs(q);

        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);
        console.log(lastVisible);

        let listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);
        setLoading(false);
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
        where("type", "==", params.categoryName),
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

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === "daily"
            ? "Daily Workers"
            : "Salary Workers"}
        </p>
      </header>
      <Card>
            <div className="">
              <form onSubmit={abc}>
                <input
                  className="formInputName"
                  onChange={onChange}
                  placeholder="Search for worker here"
                  value={search}
                />
                <button type="submit" className="listingType ">
                  Search
                </button>
              </form>

              {/* clear funcion */}
              {/* <div>
           
              {searchlisting.length>0 &&( <button onClick={handleClear} className="listingType ">Clear</button>)}
            </div> */}
            </div>
          </Card>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            {searchlisting && searchlisting.length>0 ?(
             <ul className="categoryListings">
             {searchlisting.map((listing) => (
               // console.log(listing)

               <ListingItem
                 listing={listing.data}
                 id={listing.id}
                 key={listing.id}
               />
               
             ))}
             <hr />
           </ul>  
            ): <ul className="categoryListings">
            {listings.map((listing) => (
              // console.log(listing)

              <ListingItem
                listing={listing.data}
                id={listing.id}
                key={listing.id}
              />
              
            ))}
            <hr />
          </ul>}
           
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
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  );
}
