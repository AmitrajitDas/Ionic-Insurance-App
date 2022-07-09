import React, { useState, useEffect } from "react"
import {
  IonButton,
  IonCard,
  IonItem,
  IonIcon,
  IonLabel,
  IonCardContent,
} from "@ionic/react"
import api from "../../api"
import Alert from "../Alert"
import Loader from "../Loader/index"
import InsuranceIMG from "../../assets/insurance.jpg"
import { cardOutline } from "ionicons/icons"

const Breakups = ({ bookedPolicy, beneficiaryID, userID }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [purchased, setPurchased] = useState(false)

  const price = bookedPolicy.basePrice
  const gstprice = (price * bookedPolicy.gst) / 100
  const taxprice = (price * bookedPolicy.otherTax) / 100
  const compdis = (price * bookedPolicy.companyDiscount) / 100
  const govdis = (price * bookedPolicy.govDiscount) / 100

  const amount = price + gstprice + taxprice - (compdis + govdis)

  const purchaseHandler = (e) => {
    e.preventDefault()
    setLoading(true)
    api
      .post(
        "/buypolicy",
        JSON.stringify({
          beneficiaryID,
          userID,
          policyName: bookedPolicy.policyName,
        })
      )
      .then((res) => {
        console.log("policy bought", res.data)
        setPurchased(true)
      })
      .catch((err) => {
        setError(true)
        console.log(err)
      })
      .finally(() => setLoading(false))
  }

  return (
    <>
      {loading && <Loader loading={loading} />}
      {error && <Alert error={error} />}
      {purchased && <Alert sucess={purchased} />}
      <IonCard>
        <img src={InsuranceIMG} alt='insurance' />
        <IonItem className='ion-activated'>
          <IonLabel>PolicyID</IonLabel>
          <IonLabel slot='end'>{bookedPolicy.policyID}</IonLabel>
        </IonItem>

        <IonItem className='ion-activated'>
          <IonLabel>Policyname</IonLabel>
          <IonLabel slot='end'>{bookedPolicy.policyName}</IonLabel>
        </IonItem>

        <IonItem className='ion-activated'>
          <IonLabel>Location</IonLabel>
          <IonLabel slot='end'>{bookedPolicy.location}</IonLabel>
        </IonItem>

        <IonItem className='ion-activated'>
          <IonLabel>Occupation</IonLabel>
          <IonLabel slot='end'>{bookedPolicy.occupation}</IonLabel>
        </IonItem>

        <IonItem className='ion-activated'>
          <IonLabel>Period</IonLabel>
          <IonLabel slot='end'>{bookedPolicy.period}</IonLabel>
        </IonItem>

        <IonItem className='ion-activated'>
          <IonLabel>Minimum Age</IonLabel>
          <IonLabel slot='end'>{bookedPolicy.minAge}</IonLabel>
        </IonItem>

        <IonItem className='ion-activated'>
          <IonLabel>Maximum Age</IonLabel>
          <IonLabel slot='end'>{bookedPolicy.maxAge}</IonLabel>
        </IonItem>

        <IonItem className='ion-activated'>
          <IonLabel>Gender</IonLabel>
          <IonLabel slot='end'>{bookedPolicy.gender}</IonLabel>
        </IonItem>

        <IonItem>
          <IonLabel>Base Price</IonLabel>
          <IonLabel slot='end'>₹{bookedPolicy.basePrice}</IonLabel>
        </IonItem>

        <IonItem className='ion-activated'>
          <IonLabel>GST</IonLabel>
          <IonLabel slot='end'>{bookedPolicy.gst}%</IonLabel>
        </IonItem>

        <IonItem className='ion-activated'>
          <IonLabel>Other Taxes</IonLabel>
          <IonLabel slot='end'>{bookedPolicy.otherTax}%</IonLabel>
        </IonItem>

        <IonItem className='ion-activated'>
          <IonLabel>Govt. Discount</IonLabel>
          <IonLabel slot='end'>{bookedPolicy.govDiscount}%</IonLabel>
        </IonItem>

        <IonItem className='ion-activated'>
          <IonLabel>Company Discount</IonLabel>
          <IonLabel slot='end'>{bookedPolicy.companyDiscount}%</IonLabel>
        </IonItem>

        <IonItem className='ion-activated'>
          <IonIcon icon={cardOutline} slot='start' />
          <IonLabel>Total Price</IonLabel>
          <IonLabel slot='end'>₹{amount}</IonLabel>
        </IonItem>

        <IonCardContent>
          <IonButton
            slot='start'
            shape='round'
            color='tertiary'
            expand='full'
            className='card-btn'
            onClick={purchaseHandler}
          >
            Buy Premium
          </IonButton>
        </IonCardContent>
      </IonCard>
    </>
  )
}

export default Breakups
