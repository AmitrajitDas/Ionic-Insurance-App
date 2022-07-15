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
  setSavedPolicy,
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
  }

  const unboughtHandler = (e) => {
    e.preventDefault()
    setIsUnbought(false)
    setSelectedPolicy(unboughtPolicy)
    console.log(unboughtPolicy)
    setSavedPolicy(true)
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
          {isUnbought && (
            <div style={{ fontWeight: "600" }}>
              This premium is booked for your{" "}
              {unboughtPolicy.benificiaryRelation}, {unboughtPolicy.fullName}
            </div>
          )}

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
