import React from 'react'

export default function CreateWorkerListingHindi() {
  return (
    <div>CreateWorkerListingHindi</div>
  )
}






// import React, { useEffect, useRef, useState } from "react";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import Select from "react-dropdown-select";
// import {
//   getStorage,
//   ref,
//   uploadBytesResumable,
//   getDownloadURL,
// } from "firebase/storage";

// import {
//   collection,
//   getDocs,
//   query,
//   where,
//   orderBy,
//   addDoc,
//   serverTimestamp,
//   limit,
//   startAfter,
// } from "firebase/firestore";
// import { db } from "../firebase.config";

// import { Link, useNavigate } from "react-router-dom";
// import Spinner from "../Components/Spinner";
// import { toast } from "react-toastify";
// import { v4 as uuidv4 } from "uuid";
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";
// import en from "../assets/language/english.json";
// import hi from "../assets/language/hindi.json";
// import ta from "../assets/language/tamil.json";
// import ur from "../assets/language/urdu.json";

// export default function CreateWorkerListingHindi() {
//   const {
//     transcript,
//     listening,
//     resetTranscript,
//     browserSupportsSpeechRecognition,
//   } = useSpeechRecognition();

//   const [geolocationEnabled, setGeolocationEnabled] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [role, setRole] = useState("");
//   const [result, setResult] = useState("");

//   const [authId, setAuthId] = useState("RYVrHoDFWmN3sDz2enxgVBuo1tx1");
//   const [wage, setWage] = useState(null);
//   const [lastFetchedListing, setLastFetchedListing] = useState(null);
//   const [language, setLanguage] = useState("en");
//   const labels = {
//     en,
//     hi,
//     ta,
//     ur,
//   };
//   const handleChangeLanguage = (event) => {
//     setLanguage(event.target.value);
//   };

//   const renderLabel = (field) => {
//     return labels[language][field];
//   };

//   const [minwage, setMinWage] = useState({
//     experience: 1,
//     gender: "",
//     city: "",
//     wage: 500,
//   });
//   let city;
//   const [formData, setFormData] = useState({
//     type: "salary",
//     name: "",
//     number: 1,
//     address: "",
//     experience: 1,
//     age: 1,
//     rate: "",

//     work: "",
//     value: "",
//     images: {},
//     aimages: {},
//     latitude: 0,
//     longitude: 0,
//   });

//   const {
//     type,
//     name,
//     number,
//     address,
//     experience,
//     age,
//     rate,
//     work,
//     value,

//     images,
//     aimages,
//     latitude,
//     longitude,
//   } = formData;

//   const auth = getAuth();
//   const navigate = useNavigate();
//   const isMounted = useRef(true);

//   const onChangeworktype = (e) => {
//     setRole(e.target.value);
//     console.log(role);
//   };
//   useEffect(() => {
//     if (isMounted) {
//       onAuthStateChanged(auth, (user) => {
//         if (user) {
//           setFormData({ ...formData, userRef: user.uid });
//         } else {
//           navigate("/sign-in");
//         }
//       });
//     }
//     console.log(aimages);

//     return () => {
//       isMounted.current = false;
//     };
//   }, [isMounted]);

//   const fetchListings = async () => {
//     setAuthId(auth.uid ? auth.uid : "");
//     try {
//       // get reference
//       const wageRef = collection(db, "minwage");

//       // create query

//       const q = query(wageRef, where("city", "==", "Gujrat"));

//       // execute query
//       const querySnap = await getDocs(q);

//       const lastVisible = querySnap.docs[querySnap.docs.length - 1];
//       setLastFetchedListing(lastVisible);

//       let listings = [];
//       querySnap.forEach((doc) => {
//         return listings.push({
//           id: doc.id,
//           data: doc.data(),
//         });
//       });
//       console.log(listings[0].data.wage);
//       setWage(listings[0].data.wage);
//       setWage(listings);
//       setLoading(false);
//     } catch (error) {
//       toast.error("Could not fetch listings");
//       console.log(error);
//     }
//   };

//   const getLocation = async (e) => {
//     // setLoading(true)
//     let geolocation = {};
//     let location;

//     const options = {
//       method: "GET",
//       headers: {
//         "X-RapidAPI-Key": `${process.env.REACT_APP_KEY}`,
//         "X-RapidAPI-Host": "address-from-to-latitude-longitude.p.rapidapi.com",
//       },
//     };

//     if (geolocationEnabled) {
//       const response = await fetch(
//         `https://address-from-to-latitude-longitude.p.rapidapi.com/geolocationapi?address=${address}`,
//         options
//       );

//       const data = await response.json();
//       console.log(data);
//       geolocation.lat =
//         data.Results === undefined ? 0 : data.Results[0].latitude;
//       geolocation.lng =
//         data.Results === undefined ? 0 : data.Results[0].longitude;
//       location =
//         data.Results === undefined ? undefined : data.Results[0].address;
//       for (let i = 0; i < data.Results.length; i++) {
//         if (data.Results !== undefined && data.Results[i].city !== undefined) {
//           city = data.Results[i].city;
//           break;
//         }
//       }
//       //  city = data.Results === undefined ? "" : data.Results[0].city;

//       console.log(city);
//       if (location === undefined || location.includes("undefined")) {
//         setLoading(false);
//         toast.error("Please enter a correct address");
//         return;
//       }
//     } else {
//       geolocation.lat = latitude;
//       geolocation.lng = longitude;
//       location = address;
//     }

//     let min_wage;

//     if (experience < 2) {
//       // 500-800
//       min_wage = Math.floor(Math.random() * 4 + 5) * 100;
//     } else if (experience >= 2 && experience < 4) {
//       // 800-1000
//       min_wage = Math.floor(Math.random() * 3 + 8) * 100;
//     } else {
//       // 1000-1200
//       min_wage = Math.floor(Math.random() * 2 + 10) * 100;
//     }

//     const newWageDate = {
//       city,
//       experience,
//       gender: "",
//       wage: min_wage,
//     };
//     //  const docRef = await addDoc(collection(db, "minwage"), newWageDate);
//     //  console.log(docRef);

//     //  setLoading(false);
//     //  toast.success("Listing saved");

//     fetchListings();
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     setLoading(true);

//     // if (age<20) {
//     //   setLoading(false);
//     //   toast.error("Age should be greater than 20");
//     //   return;
//     // }

//     if (images.length > 1) {
//       setLoading(false);
//       toast.error("Max 1 image");
//       return;
//     }
//     if (aimages.length > 2) {
//       setLoading(false);
//       toast.error("Max 2 image");
//       return;
//     }

//     let geolocation = {};
//     let location;

//     const options = {
//       method: "GET",
//       headers: {
//         "X-RapidAPI-Key": `${process.env.REACT_APP_KEY}`,
//         "X-RapidAPI-Host": "address-from-to-latitude-longitude.p.rapidapi.com",
//       },
//     };

//     if (geolocationEnabled) {
//       const response = await fetch(
//         `https://address-from-to-latitude-longitude.p.rapidapi.com/geolocationapi?address=${address}`,
//         options
//       );

//       const data = await response.json();
//       console.log(data);
//       geolocation.lat =
//         data.Results === undefined ? 0 : data.Results[0].latitude;
//       geolocation.lng =
//         data.Results === undefined ? 0 : data.Results[0].longitude;
//       location =
//         data.Results === undefined ? undefined : data.Results[0].address;

//       if (location === undefined || location.includes("undefined")) {
//         setLoading(false);
//         toast.error("Please enter a correct address");
//         return;
//       }
//     } else {
//       geolocation.lat = latitude;
//       geolocation.lng = longitude;
//       location = address;
//     }

//     // setMinWage()
//     //store images in firebase

//     const storeImage = async (image) => {
//       return new Promise((resolve, reject) => {
//         const storage = getStorage();
//         const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

//         const storageRef = ref(storage, "images/" + fileName);
//         const uploadTask = uploadBytesResumable(storageRef, image);

//         uploadTask.on(
//           "state_changed",
//           (snapshot) => {
//             const progress =
//               (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             console.log("Upload is " + progress + "% done");
//             switch (snapshot.state) {
//               case "paused":
//                 console.log("Upload is paused");
//                 break;
//               case "running":
//                 console.log("Upload is running");
//                 break;
//             }
//           },
//           (error) => {
//             reject(error);
//           },
//           () => {
//             getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//               resolve(downloadURL);
//             });
//           }
//         );
//       });
//     };

//     const imageUrls = await Promise.all(
//       [...images].map((image) => storeImage(image))
//     ).catch(() => {
//       setLoading(false);
//       toast.error("Images not uploaded");
//       return;
//     });

//     const aadharimageUrls = await Promise.all(
//       [...images].map((image) => storeImage(image))
//     ).catch(() => {
//       setLoading(false);
//       toast.error("Images not uploaded");
//       return;
//     });
//     const formDataCopy = {
//       ...formData,
//       imageUrls,
//       aadharimageUrls,
//       geolocation,
//       work: role,
//       timestamp: serverTimestamp(),
//     };

//     delete formDataCopy.images;
//     delete formDataCopy.aadharimages;
//     delete formDataCopy.address;
//     location && (formDataCopy.location = location);
//     !formDataCopy.offer && delete formDataCopy.discountedPrice;

//     const docRef = await addDoc(collection(db, "listings"), formDataCopy);
//     setLoading(false);
//     toast.success("Listing saved");
//     navigate(`/category/${formDataCopy.type}/${docRef.id}`);
//   };

//   const onMutate = (e) => {
//     let boolean = null;

//     if (e.target.value === "true") {
//       boolean = true;
//     }
//     if (e.target.value === "false") {
//       boolean = false;
//     }

//     // files
//     if (e.target.files) {
//       setFormData((prevState) => ({
//         ...prevState,
//         images: e.target.files,
//       }));
//     }

//     //text . booleans.. numbers
//     if (!e.target.files) {
//       setFormData((prevState) => ({
//         ...prevState,
//         [e.target.id]: boolean ?? e.target.value,
//       }));
//     }
//   };

//   if (loading) {
//     return <Spinner />;
//   }

//   // const handleClick = async (event) => {
//   //   event.preventDefault();
//   //   console.log("jdhfhkskdf");
//   //   event.preventDefault();

//   //   const response = await fetch(`/predict`);
//   //   const data = await response.json();
//   //   console.log(response+" "+data);
//   //   setResult(data.result);
//   // };

//   const handleCalculate = () => {
//     let min_wage;

//     if (experience < 2) {
//       // 500-800
//       min_wage = Math.floor(Math.random() * 4 + 5) * 100;
//     } else if (experience >= 2 && experience < 4) {
//       // 800-1000
//       min_wage = Math.floor(Math.random() * 3 + 8) * 100;
//     } else {
//       // 1000-1200
//       min_wage = Math.floor(Math.random() * 2 + 10) * 100;
//     }

//     getLocation(address);
//     const newWageDate = {
//       city,
//       experience,
//       gender: "",
//       wage: min_wage,
//     };

//     console.log(newWageDate);

//     const filteredData = data.filter(
//       (item) => item.state === address && item.experience <= Number(experience)
//     );
//     if (filteredData.length > 0) {
//       setResult(filteredData[0].minimumSalary);
//       formData.rate = result;
//       console.log(result);
//       console.log(formData.rate);
//     } else {
//       setResult("Data not found");
//     }
//   };
//   if (!browserSupportsSpeechRecognition) {
//     return <span>Browser doesn't support speech recognition.</span>;
//   }
//   const handleStop = () => {
//     SpeechRecognition.stopListening();
//     if (transcript.includes("my name is")) {
//       const name = transcript.replace("my name is", "").trim();
//       console.log(name);
//       //  setName(name)
//     }

//     if (transcript.includes("my email is")) {
//       const email = transcript.replace("my email is", "").trim();
//       console.log(email);
//       // setEmail(email)
//     }

//     // setName(transcript)
//     console.log(transcript);
//   };
//   return (
//     <div className="profile">
//       <div></div>
//       <div>
//         <p>Microphone: {listening ? "on" : "off"}</p>
//         <button onClick={SpeechRecognition.startListening}>Start</button>
//         <button onClick={handleStop} id="name">
//           Stop
//         </button>
//         <button onClick={resetTranscript}>Reset</button>
//         <p>{transcript}</p>
//       </div>
//       <header>
//         <div className="categoryListing">
//           <p className="pageHeader">{renderLabel("create a listing")}</p>
//           {/* <Link to="/create-worker-listing-hindi">
//             <button className="languageChangeButton">Change Language</button>
//           </Link> */}

//           {/* <h2>Select language:</h2> */}
//           <select
//             className="languageChangeButton"
//             value={language}
//             onChange={handleChangeLanguage}
//           >
//             <option value="en">English</option>
//             <option value="hi">Hindi</option>
//             <option value="ta">Tamil</option>
//             <option value="ur">Urdu</option>
//           </select>
//         </div>
//       </header>
//       <main>
//         <form onSubmit={onSubmit}>
//           <label className="formLabel">
//             {renderLabel("daily/salary wage")}
//           </label>
//           <div className="formButtons">
//             <button
//               type="button"
//               className={type === "daily" ? "formButtonActive" : "formButton"}
//               id="type"
//               value="daily"
//               onClick={onMutate}
//             >
//               {renderLabel("daily")}
//             </button>

//             <button
//               type="button"
//               className={type === "salary" ? "formButtonActive" : "formButton"}
//               id="type"
//               value="salary"
//               onClick={onMutate}
//             >
//               {renderLabel("salary")}
//             </button>
//           </div>

//           <label className="formLabel">{renderLabel("name")}</label>
//           <input
//             className="formInputName"
//             type="text"
//             id="name"
//             value={name}
//             onChange={onMutate}
//             maxLength="32"
//             minLength="5"
//             required
//           />

//           <label className="formLabel">{renderLabel("contact")}</label>
//           <input
//             className="formInputNumber"
//             type="number"
//             id="number"
//             value={number}
//             onChange={onMutate}
//             maxLength="10"
//             minLength="10"
//             required
//           />

//           <label className="formLabel">{renderLabel("address")}</label>
//           <textarea
//             className="formInputAddress"
//             type="text"
//             id="address"
//             value={address}
//             onChange={onMutate}
//             required
//           />

//           <label className="formLabel">{renderLabel("experience")}</label>
//           <div className="formPriceDiv">
//             <input
//               className="formInputSmall"
//               type="number"
//               id="experience"
//               value={experience}
//               onChange={onMutate}
//               min="1"
//               max="750000000"
//               required
//             />
//           </div>

//           <label className="formLabel">{renderLabel("age")}</label>
//           <div className="formPriceDiv">
//             <input
//               className="formInputSmall"
//               type="number"
//               id="age"
//               value={age}
//               onChange={onMutate}
//               min="20"
//               max="750000000"
//               required
//             />
//             <p className="formPriceText">{renderLabel("min 20 year")}</p>
//           </div>
//           <label className="formLabel">{renderLabel("rate")}</label>
//           <div className="formPriceDiv">
//             <input
//               className="formInputSmall"
//               type="number"
//               id="rate"
//               value={rate}
//               onChange={onMutate}
//               min="500"
//               max="750000000"
//               required
//             />
//             <p className="formPriceText">{renderLabel("per month")}</p>
//             <button onClick={handleCalculate}>
//               {renderLabel("calculate")}
//             </button>
//           </div>
//           <p>
//             {renderLabel("min wage calculated")} {result}
//           </p>
//           {/* <input type="text" id="result" value={result} readOnly /> */}

//           <label className="formLabel">{renderLabel("type of work")}</label>
//           <div>
//             <select
//               value={role}
//               onChange={onChangeworktype}
//               className="formInputSmall"
//             >
//               <option value="Plumber">{renderLabel("plumber")}</option>

//               <option value="Carpenter">{renderLabel("carpenter")}</option>

//               <option value="Painter">{renderLabel("painter")}</option>
//               <option value="Electrician">{renderLabel("electrician")}</option>
//               <option value="Mechanic">{renderLabel("mechanic")}</option>
//               <option value="Mistri">{renderLabel("mistri")}</option>
//             </select>
//           </div>

//           {/* profile image */}
//           <label className="formLabel">
//             {renderLabel("upload profile image")}
//           </label>
//           <p className="imagesInfo">{renderLabel("image label")}</p>
//           <input
//             className="formInputFile"
//             type="file"
//             id="images"
//             onChange={onMutate}
//             max="1"
//             accept=".jpg,.png,.jpeg"
//             multiple
//             required
//           />

//           <label className="formLabel">{renderLabel("upload aadhar")}</label>
//           <p className="imagesInfo">{renderLabel("aadhar label")}</p>
//           <input
//             className="formInputFile"
//             type="file"
//             id="aimages"
//             onChange={onMutate}
//             max="6"
//             accept=".jpg,.png,.jpeg"
//             multiple
//             required
//           />
//           <button type="submit" className="primaryButton createListingButton">
//             {renderLabel("create listing button")}
//           </button>
//         </form>
//       </main>
//     </div>
//   );
// }
