import React, { useEffect, useRef, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  collection,
  getDocs,
  query,
  where,
 addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../Components/Spinner";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import en from "../assets/language/english.json";
import hi from "../assets/language/hindi.json";
import ta from "../assets/language/tamil.json";
import ur from "../assets/language/urdu.json";
import gj from "../assets/language/gujrati.json";
import pu from "../assets/language/punjabi.json";
import Loader from "../Components/Loader";
import { render } from "@testing-library/react";

export default function CreateWorkerListing() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [wageloading, setWageLoading] = useState(false);
  const [webSpeech, setWebSpeech] = useState(false);

  const [role, setRole] = useState("");
  const [result, setResult] = useState("");

  const [authId, setAuthId] = useState("RYVrHoDFWmN3sDz2enxgVBuo1tx1");
  const [wage, setWage] = useState(null);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const [language, setLanguage] = useState("en");
  const labels = {
    en,
    hi,
    ta,
    ur,
    gj,
    pu,
  };
  const [buttonColor, setButtonColor] = useState("red");
  const speak = (text) => {
    const message = new SpeechSynthesisUtterance(text);
    message.lang = "hi-IN";
    window.speechSynthesis.speak(message);
  };
  const buttonStyle = {
    backgroundColor: buttonColor,
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  };

  const handleEnableSpeech = () => {
    if (!webSpeech) {
      setWebSpeech(true);
      speak("form input assistance enabled.");
    } else {
      setWebSpeech(false);
      speak("form input assistance disabled.");
    }
    setButtonColor(webSpeech ? "red" : "green");
  };

  const handleChangeLanguage = (event) => {
    setLanguage(event.target.value);
  };

  const renderLabel = (field) => {
    return labels[language][field];
  };

  const [minwage, setMinWage] = useState({
    experience: 1,
    gender: "",
    city: "",
    wage: 500,
  });
  let city;
  const [formData, setFormData] = useState({
    type: "salary",
    name: "",
    number: 1,
    address: "",
    experience: 1,
    age: 1,
    rate: "",
    rating: 2.5,
    work: "",
    value: "",
    images: {},
    aadharImages: {},
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
    aadharImages,
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
    const generateRandomValue = () => {
      const min = 2;
      const max = 5;
      const step = 0.5;
      const randomValue =
        Math.floor(Math.random() * ((max - min + step) / step)) * step + min;
      formData.rating = randomValue;
      console.log(formData.rating);
      return randomValue;
    };

    generateRandomValue();

    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/sign-in");
        }
      });
    }
    console.log(aadharImages);

    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  const fetchListings = async (newWage) => {
    setAuthId(auth.uid ? auth.uid : "");
    console.log(newWage);
    try {
      // get reference
      const wageRef = collection(db, "minwage");

      // create query

      const q = query(
        wageRef,
        where("city", "==", newWage.city),
        where("experience", ">=", newWage.experience)
      );

      // execute query
      const querySnap = await getDocs(q);

      console.log(querySnap);
      let listings = [];
      if (!querySnap.empty) {
        console.log("exist");
        const documentSnapshot = querySnap.docs[0];
        const wageData = documentSnapshot.data();
        console.log(wageData.wage);
        // setWage(wageData.wage);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        console.log(listings[0].data.wage);
        setWage(listings[0].data.wage);
        // setWage(listings);
        console.log(listings);
        setWageLoading(false);
        formData.rate = wageData.wage;
        setResult(wageData.wage);
      } else {
        // const docRef = await addDoc(collection(db, "minwage"), newWage);
        // setLoading(false);
        // console.log("success");
        // toast.success("Listing saved");
        await addDoc(wageRef, newWage);
        formData.rate = newWage.wage;
        setWageLoading(false);
        setResult(newWage.wage);
      }
    } catch (error) {
      toast.error("Could not fetch listings");
      console.log(error);
    }
  };

  const getLocation = async (e) => {
    // setLoading(true)
    let geolocation = {};
    let location;

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": `38e6ced8f4msh053ab94f10cb362p193a1fjsnb76192332123`,
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
      for (let i = 0; i < data.Results.length; i++) {
        if (data.Results !== undefined && data.Results[i].city !== undefined) {
          city = data.Results[i].city;
          break;
        }
      }
      //  city = data.Results === undefined ? "" : data.Results[0].city;

      console.log(city);
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

    let min_wage;

    if (experience < 2) {
      // 500-800
      min_wage = Math.floor(Math.random() * 4 + 5) * 100;
    } else if (experience >= 2 && experience < 4) {
      // 800-1000
      min_wage = Math.floor(Math.random() * 3 + 8) * 100;
    } else {
      // 1000-1200
      min_wage = Math.floor(Math.random() * 2 + 10) * 100;
    }

    const newWageDate = {
      city,
      experience,
      gender: "",
      wage: min_wage,
    };
    //  const docRef = await addDoc(collection(db, "minwage"), newWageDate);
    //  console.log(docRef);

    //  setLoading(false);
    //  toast.success("Listing saved");

    fetchListings(newWageDate);
  };

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
    if (aadharImages.length > 1) {
      setLoading(false);
      toast.error("Max 1 image");
      return;
    }

    let geolocation = {};
    let location;

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": `38e6ced8f4msh053ab94f10cb362p193a1fjsnb76192332123`,
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

    // setMinWage()
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
      [...aadharImages].map((image) => storeImage(image))
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
    delete formDataCopy.aadharImages;
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

    // profile image files
    if (e.target.files && e.target.id==="images") {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

     // aadhar image files
     if (e.target.files && e.target.id==="aadharImages") {
      setFormData((prevState) => ({
        ...prevState,
        aadharImages: e.target.files,
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

  if (loading || wageloading) {
    return <Loader />;
  }
  if (loading ) {
    return <Spinner />;
  }

  // const handleClick = async (event) => {
  //   event.preventDefault();
  //   console.log("jdhfhkskdf");
  //   event.preventDefault();

  //   const response = await fetch(`/predict`);
  //   const data = await response.json();
  //   console.log(response+" "+data);
  //   setResult(data.result);
  // };

  const handleCalculate = () => {
    if (!formData.experience || !formData.address) {
      toast.error("Please Enter Details");
      return;
    }

    let min_wage;
    setWageLoading(true);
    if (experience < 2) {
      // 500-800
      min_wage = Math.floor(Math.random() * 4 + 5) * 100;
    } else if (experience >= 2 && experience < 4) {
      // 800-1000
      min_wage = Math.floor(Math.random() * 3 + 8) * 100;
    } else {
      // 1000-1200
      min_wage = Math.floor(Math.random() * 2 + 10) * 100;
    }

    getLocation(address);
    // const newWageDate = {
    //   city,
    //   experience,
    //   gender: "",
    //   wage: min_wage,
    // };

    // console.log(newWageDate);

    // const filteredData = data.filter(
    //   (item) => item.state === address && item.experience <= Number(experience)
    // );
    // if (filteredData.length > 0) {
    //   // setResult(filteredData[0].minimumSalary);
    //   // formData.rate = result;
    //   // console.log(result);
    //   // console.log(formData.rate);
    // } else {
    //   setResult("Data not found");
    // }
  };
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  const handleStop = () => {
    SpeechRecognition.stopListening();
    if (transcript.includes("my name is")) {
      const name = transcript.replace("my name is", "").trim();
      console.log(name);
      //  setName(name)
    }

    if (transcript.includes("my email is")) {
      const email = transcript.replace("my email is", "").trim();
      console.log(email);
      // setEmail(email)
    }

    // setName(transcript)
    console.log(transcript);
  };
  return (
    <div className="profile">
      <div></div>
      <div className="categoryListing">
        <div>
          <p>Microphone: {listening ? "on" : "off"}</p>
          <button onClick={SpeechRecognition.startListening}>Start</button>
          <button onClick={handleStop} id="name">
            Stop
          </button>
          <button onClick={resetTranscript}>Reset</button>
          <p>{transcript}</p>
        </div>
        <button style={buttonStyle} onClick={handleEnableSpeech}>
          {webSpeech ? "Speech Enabled" : "Speech Disabled"}
        </button>
      </div>
      <header>
        <div className="categoryListing">
          <p className="pageHeader">{renderLabel("create a listing")}</p>
          {/* <Link to="/create-worker-listing-hindi">
            <button className="languageChangeButton">Change Language</button>
          </Link> */}

          {/* <h2>Select language:</h2> */}
          <select
            className="languageChangeButton"
            value={language}
            onChange={handleChangeLanguage}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ta">Tamil</option>
            <option value="ur">Urdu</option>
            <option value="gj">Gujrati</option>
            <option value="pu">Punjabi</option>
          </select>
        </div>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <label className="formLabel">
            {renderLabel("daily/salary wage")}
          </label>
          <div className="formButtons">
            <button
              type="button"
              className={type === "daily" ? "formButtonActive" : "formButton"}
              id="type"
              value="daily"
              onClick={onMutate}
              // onFocus={() => {
              //   if (webSpeech) {
              //     const message = new SpeechSynthesisUtterance("Please enter your name");
              //     window.speechSynthesis.speak(message);
              //   }
              // }}

              onFocus={() => {
                if (webSpeech) {
                  speak(renderLabel("dailywageselected"));
                }
              }}
            >
              {renderLabel("daily")}
            </button>
            <div>
              {/* <label>
          Enable speech:
          <input
            type="checkbox"
            checked={webSpeech}
            onChange={handleEnableSpeech}
          /> */}

              {/* </label> */}
            </div>
            <button
              type="button"
              className={type === "salary" ? "formButtonActive" : "formButton"}
              id="type"
              value="salary"
              onClick={onMutate}
              onFocus={() => {
                if (webSpeech) {
                  speak(renderLabel("salarywageselected"));
                }
              }}
            >
              {renderLabel("salary")}
            </button>
          </div>

          <label className="formLabel">{renderLabel("name")}</label>
          <input
            className="formInputName"
            type="text"
            id="name"
            value={name}
            onChange={onMutate}
            maxLength="32"
            minLength="5"
            required
            onFocus={() => {
              if (webSpeech) {
                speak(renderLabel("nameselected"));
              }
            }}
          />

          <label className="formLabel">{renderLabel("contact")}</label>
          <input
            className="formInputNumber"
            type="number"
            id="number"
            value={number}
            onChange={onMutate}
            maxLength="10"
            minLength="10"
            required
            onFocus={() => {
              if (webSpeech) {
                speak(renderLabel("contactselected"));
              }
            }}
          />

          <label className="formLabel">{renderLabel("address")}</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="address"
            value={address}
            onChange={onMutate}
            required
            onFocus={() => {
              if (webSpeech) {
                speak(renderLabel("addressselected"));
              }
            }}
          />

          <label className="formLabel">{renderLabel("experience")}</label>
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
              onFocus={() => {
                if (webSpeech) {
                  speak(renderLabel("experienceselected"));
                }
              }}
            />
          </div>

          <label className="formLabel">{renderLabel("age")}</label>
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
              onFocus={() => {
                if (webSpeech) {
                  speak(renderLabel("ageselected"));
                }
              }}
            />
            <p className="formPriceText">{renderLabel("min 20 year")}</p>
          </div>
          <label className="formLabel">{renderLabel("rate")}</label>
          <div className="formPriceDiv categoryListing">
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
                onFocus={() => {
                  if (webSpeech) {
                    speak(renderLabel("rateselected"));
                  }
                }}
              />
              <p className="formPriceText">{renderLabel("per month")}</p>
            </div>
            <button onClick={handleCalculate} className="languageChangeButton">
              {renderLabel("calculate")}
            </button>
          </div>
          <p>
            {renderLabel("min wage calculated")} {result}
          </p>
          {/* <input type="text" id="result" value={result} readOnly /> */}

          <label className="formLabel">{renderLabel("type of work")}</label>
          <div>
            <select
              value={role}
              onChange={onChangeworktype}
              className="formInputSmall"
              onFocus={() => {
                if (webSpeech) {
                  speak(renderLabel("workselected"));
                }
              }}
            >
              <option value="Plumber">{renderLabel("plumber")}</option>

              <option value="Carpenter">{renderLabel("carpenter")}</option>

              <option value="Painter">{renderLabel("painter")}</option>
              <option value="Electrician">{renderLabel("electrician")}</option>
              <option value="Mechanic">{renderLabel("mechanic")}</option>
              <option value="Mistri">{renderLabel("mistri")}</option>
            </select>
          </div>

          {/* profile image */}
          <label className="formLabel">
            {renderLabel("upload profile image")}
          </label>
          <p className="imagesInfo">{renderLabel("image label")}</p>
          <input
            className="formInputFile"
            type="file"
            id="images"
            onChange={onMutate}
            max="1"
            accept=".jpg,.png,.jpeg"
            multiple
            required
            onFocus={() => {
              if (webSpeech) {
                speak(renderLabel("profileselected"));
              }
            }}
          />

{/* aadhar images */}
          <label className="formLabel">{renderLabel("upload aadhar")}</label>
          <p className="imagesInfo">{renderLabel("aadhar label")}</p>
          <input
            className="formInputFile"
            type="file"
            id="aadharImages"
            onChange={onMutate}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
            onFocus={() => {
              if (webSpeech) {
                speak(renderLabel("aadharselectd"));
              }
            }}
          />
          <button type="submit" className="primaryButton createListingButton">
            {renderLabel("create listing button")}
          </button>
        </form>
      </main>
    </div>
  );
}
