import React, { useEffect, useRef, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db } from "../firebase.config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Spinner from "../Components/Spinner";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export default function CreateWorkerListing() {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "salary",
    name: "",
    number:1,
    address: "",
    experience:1,
    age:1,
    rate:1,
    work:"",
    images: {},
    aimages:{
    },
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    number,
    address,
    experience,
    age,
    rate,
    work,
    images,
    aimages,
    latitude,
    longitude,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/sign-in");
        }
      });
    }
    console.log(aimages);
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);


  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // if (age<20) {
    //   setLoading(false);
    //   toast.error("Age should be greater than 20");
    //   return;
    // }

    if (images.length > 1) {
      setLoading(false);
      toast.error("Max 1 image");
      return;
    }
    if (aimages.length > 2) {
      setLoading(false);
      toast.error("Max 2 image");
      return;
    }

    let geolocation = {};
    let location;

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": `${process.env.REACT_APP_KEY}`,
        "X-RapidAPI-Host": "address-from-to-latitude-longitude.p.rapidapi.com",
      },
    };

    if (geolocationEnabled) {
      const response = await fetch(
        `https://address-from-to-latitude-longitude.p.rapidapi.com/geolocationapi?address=${address}`,
        options
      );

      const data = await response.json();
      console.log(data);
      geolocation.lat =
        data.Results === undefined ? 0 : data.Results[0].latitude;
      geolocation.lng =
        data.Results === undefined ? 0 : data.Results[0].longitude;
      location =
        data.Results === undefined ? undefined : data.Results[0].address;

      if (location === undefined || location.includes("undefined")) {
        setLoading(false);
        toast.error("Please enter a correct address");
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
      location = address;
    }

    //store images in firebase

    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, "images/" + fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const aadharimageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });
    const formDataCopy = {
      ...formData,
      imageUrls,
    aadharimageUrls,
      geolocation,
      timestamp: serverTimestamp(),
    };

    delete formDataCopy.images;
    delete formDataCopy.aadharimages;
    delete formDataCopy.address;
    location && (formDataCopy.location = location);
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing saved");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    // files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    //text . booleans.. numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Create a Listing</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <label className="formLabel">Daily/Salary Wage</label>
          <div className="formButtons">
            <button
              type="button"
              className={type === "daily" ? "formButtonActive" : "formButton"}
              id="type"
              value="daily"
              onClick={onMutate}
            >
              Daily
            </button>

            <button
              type="button"
              className={type === "salary" ? "formButtonActive" : "formButton"}
              id="type"
              value="salary"
              onClick={onMutate}
            >
              Salary
            </button>
          </div>

          <label className="formLabel">Name</label>
          <input
            className="formInputName"
            type="text"
            id="name"
            value={name}
            onChange={onMutate}
            maxLength="32"
            minLength="5"
            required
          />

          <label className="formLabel">Contact No.</label>
          <input
            className="formInputNumber"
            type="number"
            id="number"
            value={number}
            onChange={onMutate}
            maxLength="10"
            minLength="10"
            required
          />

          <label className="formLabel">Address</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="address"
            value={address}
            onChange={onMutate}
            required
          />

      <label className="formLabel">Experience</label>
          <div className="formPriceDiv">
            <input
              className="formInputSmall"
              type="number"
              id="experience"
              value={experience}
              onChange={onMutate}
              min="1"
              max="750000000"
              required
            />
            
             </div>
            


            <label className="formLabel">Age</label>
          <div className="formPriceDiv">
            <input
              className="formInputSmall"
              type="number"
              id="age"
              value={age}
              onChange={onMutate}
              min="20"
              max="750000000"
              required
            />
              <p className="formPriceText">Min 20 Year</p>
           
          </div>
          <label className="formLabel">Rate</label>
          <div className="formPriceDiv">
            <input
              className="formInputSmall"
              type="number"
              id="rate"
              value={rate}
              onChange={onMutate}
              min="500"
              max="750000000"
              required
            />
            <p className="formPriceText">₹ / Month</p>
          </div>

          <label className="formLabel">Type of Work</label>
          <div>
            <select value={work} onChange={onMutate} className="formInputSmall">
              <option value="Plumber">Plumber</option>

              <option value="Carpenter">Carpenter</option>

              <option value="Painter">Painter</option>
              <option value="Electrician">Electrician</option>
              <option value="Mechanic">Mechanic</option>
              <option value="Mistri">Mistri</option>
            </select>
          </div>

         

     
{/* profile image */}
          <label className="formLabel">Upload Profile Image</label>
          <p className="imagesInfo">
            The first image will be the cover (max 1).
          </p>
          <input
            className="formInputFile"
            type="file"
            id="images"
            onChange={onMutate}
            max="1"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />


<label className="formLabel">Upload Aadhar Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max 2).
          </p>
          <input
            className="formInputFile"
            type="file"
            id="aimages"
            onChange={onMutate}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
          <button type="submit" className="primaryButton createListingButton">
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
}
