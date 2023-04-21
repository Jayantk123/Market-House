// import { useRef, useState } from "react";
// import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

// function SpeechInput() {
//   const { transcript, resetTranscript } = useSpeechRecognition();
//   const [isListening, setIsListening] = useState(false);
//   const microphoneRef = useRef(null);
//   const [formInput, setFormInput] = useState("");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");

//   if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
//     return (
//       <div className="microphone-container">
//         Browser is not Support Speech Recognition.
//       </div>
//     );
//   }

//   const handleListening = () => {
//     setIsListening(true);
//     microphoneRef.current.classList.add("listening");
//     SpeechRecognition.startListening({
//       continuous: true,
//     });
//   };

//   const stopHandle = (transcript) => {
//     setIsListening(false);
//     microphoneRef.current.classList.remove("listening");
//     SpeechRecognition.stopListening();
//     setFormInput(transcript); // Set form input with transcript





//     if (transcript.includes("name")) {
//         const nameIndex = transcript.indexOf("name");
//         const extractedName = transcript.substring(nameIndex + 4);
//         setName(extractedName.trim());
//       } else if (transcript.includes("email")) {
//         const emailIndex = transcript.indexOf("email");
//         const extractedEmail = transcript.substring(emailIndex + 5);
//         setEmail(extractedEmail.trim());
//       } else if (transcript.includes("phone")) {
//         const phoneIndex = transcript.indexOf("phone");
//         const extractedPhone = transcript.substring(phoneIndex + 5);
//         setPhone(extractedPhone.trim());
//       }
//   };

//   const handleReset = () => {
//     stopHandle();
//     resetTranscript();
//   };
//   const handleSpeechInput = (transcript) => {
//     console.log(transcript);
//     if (transcript.includes("name")) {
//       const nameIndex = transcript.indexOf("name");
//       const extractedName = transcript.substring(nameIndex + 4);
//       setName(extractedName.trim());
//     } else if (transcript.includes("email")) {
//       const emailIndex = transcript.indexOf("email");
//       const extractedEmail = transcript.substring(emailIndex + 5);
//       setEmail(extractedEmail.trim());
//     } else if (transcript.includes("phone")) {
//       const phoneIndex = transcript.indexOf("phone");
//       const extractedPhone = transcript.substring(phoneIndex + 5);
//       setPhone(extractedPhone.trim());
//     }
//   };
//   return (
//   <div className="microphone-wrapper">
//     <div className="microphone-container">
//       <div
//         className="microphone-icon-container"
//         ref={microphoneRef}
//         onClick={handleListening}
//       >
//         <p>start</p>
//       </div>
//       <div className="microphone-status">
//         {isListening ? "Listening........." : "Click to start Listening"}
//       </div>
//       {isListening && (
//         <button className="microphone-stop btn" onClick={stopHandle}>
//           Stop
//         </button>
//       )}
//     </div>
//     <div className="form-input-container">
//       <label htmlFor="formInput">Speech Input:</label>
//       <input type="text" id="formInput" value={formInput} />
//     </div>
//     <div className="form-input-container">
//       <label htmlFor="emailInput">Email:</label>
//       <input type="email" id="emailInput" value={formInput} />
//     </div>
//     <div className="form-input-container">
//       <label htmlFor="phoneInput">Phone Number:</label>
//       <input type="tel" id="phoneInput" value={formInput} />
//     </div>
    


//     {/* <SpeechRecognition onResult={handleSpeechInput} /> */}
    
//     {transcript && (
//       <div className="microphone-result-container">
//         <div className="microphone-result-text">{transcript}</div>
//         <button className="microphone-reset btn" onClick={handleReset}>
//           Reset
//         </button>
//       </div>
//     )}
    
//   </div>
  
// );

//     }

// export default SpeechInput;

import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const SpeechInput = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleStop = ()=>{
    SpeechRecognition.stopListening();
    if (transcript.includes('my name is')) {
        const name = transcript.replace('my name is', '').trim();
       console.log(name);
       setName(name)
      }

      if (transcript.includes('my email is')) {
        const email = transcript.replace('my email is', '').trim();
        console.log(email);
        setEmail(email)
      }
    
  

    // setName(transcript)
    console.log(transcript);
  }
  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={SpeechRecognition.startListening}>Start</button>
      <button onClick={handleStop} id='name' >Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>{transcript}</p>



      <div className="form-input-container">
        <label htmlFor="nameInput">Name:</label>
        <input type="text" id="nameInput" value={name} onChange={(e) => setEmail(e.target.value)}/>
      </div>
      <div className="form-input-container">
        <label htmlFor="emailInput">Email:</label>
        <input type="email" id="emailInput" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-input-container">
        <label htmlFor="phoneInput">Phone Number:</label>
        <input type="tel" id="phoneInput" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
    </div>
  );
};
export default SpeechInput;