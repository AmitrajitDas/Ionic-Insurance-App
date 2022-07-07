import React, { useState, useEffect } from "react"
import {
  IonCard,
  IonButton,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react"
import Alert from "../Alert"
import Loader from "../Loader/index"
import api from "../../api"
import InsuranceIMG from "../../assets/insurance.jpg"
import "./card.styles.css"

// import { pin, wifi, wine, warning, walk } from 'ionicons/icons';

const Card = ({ policy, beneficiaryID, setIsBooked, setBookedPolicy }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const bookingHandler = (e) => {
    e.preventDefault()
    setLoading(true)
    api
      .post(
        "/bookpolicy",
        JSON.stringify({
          beneficiaryID,
          policyName: policy.policyName,
        })
      )
      .then((res) => {
        console.log("policy booked", res.data)
        setIsBooked(true)
        setBookedPolicy(policy)
      })
      .catch((err) => {
        setError(true)
        console.log(err)
      })
      .finally(() => setLoading(false))

    // return () => {
    //     setIsBooked(true) // cleanup
    // }
  }

  return (
    <>
      {loading && <Loader loading={loading} />}
      {error && <Alert error={error} />}
      <IonCard>
        <img src={InsuranceIMG} alt='insurance' />
        <IonCardHeader>
          <IonCardSubtitle style={{ fontFamily: "Merriweather Sans" }}>
            {policy.location}
          </IonCardSubtitle>
          <IonCardTitle
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div>{policy.policyName}</div>
            <div>{policy.basePrice}</div>
          </IonCardTitle>
        </IonCardHeader>

        <IonCardContent className='card-content'>
          <div>
            Availble for {policy.gender} {policy.occupation}
          </div>
          <div>Valid for {policy.period}</div>

          <IonButton
            slot='start'
            shape='round'
            color='tertiary'
            className='card-btn'
            onClick={bookingHandler}
          >
            Book Premium
          </IonButton>
        </IonCardContent>
      </IonCard>
    </>
  )
}

export default Card
