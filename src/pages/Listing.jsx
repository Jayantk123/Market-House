import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {getDoc,doc} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import { db } from '../firebase.config'
import Spinner from '../Components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
export default function Listing() {

const [listing,setListing]=useState(null)
const [loading,setLoading]=useState(true)
const [shareLinkCopied,setSetShareLinkCopied]=useState(false)


const navigate = useNavigate()
const params = useParams()
const auth = getAuth()

useEffect(()=>{

    const fetchListing = async()=>{
        const docRef = doc(db,'listings',params.listingId)
        const docSnap = await getDoc(docRef)

        if(docSnap.exists()){
            setListing(docSnap.data())
            setLoading(false)
        }
    }

    fetchListing()
},[navigate,params.listingId])
  return (
    <div>Listing</div>
  )
}
