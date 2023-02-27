import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

export default function Contact() {
  const [message, setMessage] = useState("");
  const [landloard, setLandloard] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    const getLandloard = async () => {
      const docRef = doc(db, "users", params.landloardId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandloard(docSnap.data());
      } else {
        toast.error("Could not get Landloard data");
      }
    };

    getLandloard();
  }, [params.landloardId]);

  const onChange = (e) => setMessage(e.target.value);

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact Landloard</p>
      </header>

      {landloard !== null && (
        <main>
          <div className="contactLandloard">
            <p className="landlordName">Contact {landloard?.name}</p>
          </div>

          <form className="messageForm">
            <div className="messageDiv">
              <label className="messageLabel">Message</label>
              <textarea
                name="message"
                id="message"
                className="textarea"
                value={message}
                onChange={onChange}
              >
               
              </textarea>
              <a
                  href={`mailto:${landloard.email}?Subject=${searchParams.get(
                    "listingName"
                  )}&body=${message}`}
                >
                  <button type="submit" className="primaryButton">
                    {" "}
                    Send Message
                  </button>
                </a>
            </div>
          </form>
        </main>
      )}
    </div>
  );
}
