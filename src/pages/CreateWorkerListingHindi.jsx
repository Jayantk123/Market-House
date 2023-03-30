import React, { useEffect, useRef, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Select from "react-dropdown-select";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db } from "../firebase.config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../Components/Spinner";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";


export default function CreateWorkerListingHindi() {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");

  const [formData, setFormData] = useState({
    type: "salary",
    name: "",
    number: 1,
    address: "",
    experience: 1,
    age: 1,
    rate: 1,

    work: "",
    value: "",
    images: {},
    aimages: {},
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
    value,

    images,
    aimages,
    latitude,
    longitude,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  const onChangeworktype = (e) => {
    setRole(e.target.value);
    console.log(role);
  };
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
      work: role,
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
        <div className="categoryListing">
        <p className="pageHeader">एक सूची बनाएँ</p>
        <Link to="/create-worker-listing">
        <button className="languageChangeButton">भाषा बदलें</button>
        </Link>
        </div>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <label className="formLabel">दैनिक/वेतन मजदूरी</label>
          <div className="formButtons">
            <button
              type="button"
              className={type === "daily" ? "formButtonActive" : "formButton"}
              id="type"
              value="daily"
              onClick={onMutate}
            >
             दैनिक
            </button>

            <button
              type="button"
              className={type === "salary" ? "formButtonActive" : "formButton"}
              id="type"
              value="salary"
              onClick={onMutate}
            >
              वेतन
            </button>
          </div>

          <label className="formLabel">नाम</label>
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

          <label className="formLabel">संपर्क नंबर</label>
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

          <label className="formLabel">पता</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="address"
            value={address}
            onChange={onMutate}
            required
          />

          <label className="formLabel">अनुभव</label>
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

          <label className="formLabel">आयु</label>
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
            <p className="formPriceText">न्यूनतम 20 वर्ष</p>
          </div>
          <label className="formLabel">दर</label>
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
             <p className="formPriceText">डिफ़ॉल्ट वेतन 700 है</p>
            <p className="formPriceText">₹ / महीना</p>
          </div>

          <label className="formLabel">
काम के प्रकार</label>
          <div>
            <select
              value={role}
              onChange={onChangeworktype}
              className="formInputSmall"
            >
               <option value=""></option>
              <option value="Plumber">प्लंबर</option>

              <option value="Carpenter">बढ़ई</option>

              <option value="Painter">चित्रकार</option>
              <option value="Electrician">बिजली मिस्त्री
</option>
              <option value="Mechanic">मैकेनिक</option>
              <option value="Mistri">मिस्त्री</option>
            </select>
          </div>

          {/* profile image */}
          <label className="formLabel">प्रोफ़ाइल छवि अपलोड करें</label>
          <p className="imagesInfo">
          पहली छवि कवर होगी (अधिकतम 1).
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

          <label className="formLabel">आधार अपलोड करें</label>
          <p className="imagesInfo">
          पहली छवि कवर (अधिकतम 2) होगी।
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
          लिस्टिंग बनाएँ
          </button>
        </form>
      </main>
    </div>
  );
}
