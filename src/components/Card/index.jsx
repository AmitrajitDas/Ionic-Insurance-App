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

const Card = ({
  policy,
  unboughtPolicy,
  beneficiaryID,
  userID,
  isSelected,
  isUnbought,
  setIsSelected,
  setSelectedPolicy,
  setIsUnbought,
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const bookingHandler = (e) => {
    e.preventDefault()
    if (!isSelected) {
      setIsSelected(true)
      setIsUnbought(false)
      setSelectedPolicy(policy)
    }

    // if (!isBooked) {
    //   setLoading(true)
    //   api
    //     .post(
    //       "/bookpolicy",
    //       JSON.stringify({
    //         beneficiaryID,
    //         userID,
    //         policyName: policy.policyName,
    //       })
    //     )
    //     .then((res) => {
    //       console.log("policy booked", res.data)
    //       setIsBooked(true)
    //       setBookedPolicy(policy)
    //     })
    //     .catch((err) => {
    //       setError(true)
    //       console.log(err)
    //     })
    //     .finally(() => setLoading(false))
    // }

    // return () => {
    //     setIsBooked(true) // cleanup
    // }
  }

  const unboughtHandler = (e) => {
    e.preventDefault()
    setIsUnbought(false)
    setSelectedPolicy(unboughtPolicy)
  }

  return (
    <>
      {loading && <Loader loading={loading} />}
      {error && <Alert error={error} />}
      <IonCard>
        <img src={InsuranceIMG} alt='insurance' />
        <IonCardHeader>
          <IonCardSubtitle style={{ fontFamily: "Merriweather Sans" }}>
            {isUnbought ? unboughtPolicy.location : policy.location}
          </IonCardSubtitle>
          <IonCardTitle
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div>
              {isUnbought ? unboughtPolicy.policyName : policy.policyName}
            </div>
            <div>
              ₹{isUnbought ? unboughtPolicy.basePrice : policy.basePrice}
            </div>
          </IonCardTitle>
        </IonCardHeader>

        <IonCardContent className='card-content'>
          <div>
            Availble for {isUnbought ? unboughtPolicy.gender : policy.gender}{" "}
            {isUnbought ? unboughtPolicy.occupation : policy.occupation}
          </div>
          <div>
            Valid for {isUnbought ? unboughtPolicy.period : policy.period} days
          </div>

          <IonButton
            slot='start'
            shape='round'
            color='tertiary'
            className='card-btn'
            onClick={isUnbought ? unboughtHandler : bookingHandler}
          >
            Pay Premium
          </IonButton>
        </IonCardContent>
      </IonCard>
    </>
  )
}

export default Card
