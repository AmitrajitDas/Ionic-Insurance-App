import React, { useState, useEffect } from "react"
import {
  IonButton,
  IonCard,
  IonItem,
  IonIcon,
  IonLabel,
  IonCardContent,
} from "@ionic/react"
import { useHistory } from "react-router"
import api from "../../api"
import Alert from "../Alert"
import Loader from "../Loader/index"
import InsuranceIMG from "../../assets/insurance.jpg"
import { cardOutline } from "ionicons/icons"

const Breakups = ({
  selectedPolicy,
  beneficiaryID,
  userID,
  isSelected,
  isUnbought,
  setIsSelected,
  setIsUnbought,
  setIsOpen,
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [purchased, setPurchased] = useState(false)
  const [booked, setBooked] = useState(false)

  const history = useHistory()

  const price = selectedPolicy.basePrice
  const gstprice = (price * selectedPolicy.gst) / 100
  const taxprice = (price * selectedPolicy.otherTax) / 100
  const compdis = (price * selectedPolicy.companyDiscount) / 100
  const govdis = (price * selectedPolicy.govDiscount) / 100

  const amount = price + gstprice + taxprice - (compdis + govdis)

  const purchaseHandler = (e) => {
    e.preventDefault()
    setLoading(true)
    api
      .post(
        "/buypolicy",
        JSON.stringify({
          beneficiaryID,
          policyName: selectedPolicy.policyName,
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

  const saveHandler = (e) => {
    e.preventDefault()

    setLoading(true)
    api
      .post(
        "/bookpolicy",
        JSON.stringify({
          beneficiaryID,
          policyName: selectedPolicy.policyName,
        })
      )
      .then((res) => {
        console.log("policy booked", res.data)
        setBooked(true)
      })
      .catch((err) => {
        setError(true)
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const leaveHandler = (e) => {
    e.preventDefault()
    setIsSelected(true)
    setIsUnbought(false)
    setIsOpen(false)
  }

  return (
    <>
      {loading && <Loader loading={loading} />}
      {error && <Alert error={error} />}
      {purchased && <Alert sucess={purchased} />}
      {booked && <Alert booked={booked} />}
      <IonCard>
        <img src={InsuranceIMG} alt='insurance' />
        <IonItem className='ion-activated'>
          <IonLabel>PolicyID</IonLabel>
          <IonLabel slot='end'>{selectedPolicy.policyID}</IonLabel>
        </IonItem>

        <IonItem className='ion-activated'>
          <IonLabel>Policyname</IonLabel>
          <IonLabel slot='end'>{selectedPolicy.policyName}</IonLabel>
        </IonItem>

        <IonItem className='ion-activated'>
          <IonLabel>Location</IonLabel>
          <IonLabel slot='end'>{selectedPolicy.location}</IonLabel>
        </IonItem>

        <IonItem className='ion-activated'>
          <IonLabel>Occupation</IonLabel>
          <IonLabel slot='end'>{selectedPolicy.occupation}</IonLabel>
        </IonItem>

        <IonItem className='ion-activated'>
          <IonLabel>Period</IonLabel>
          <IonLabel slot='end'>{selectedPolicy.period}</IonLabel>
        </IonItem>

        <IonItem className='ion-activated'>
          <IonLabel>Minimum Age</IonLabel>
          <IonLabel slot='end'>{selectedPolicy.minAge}</IonLabel>
        </IonItem>

        <IonItem className='ion-activated'>
          <IonLabel>Maximum Age</IonLabel>
          <IonLabel slot='end'>{selectedPolicy.maxAge}</IonLabel>
        </IonItem>

        <IonItem className='ion-activated'>
          <IonLabel>Gender</IonLabel>
          <IonLabel slot='end'>{selectedPolicy.gender}</IonLabel>
        </IonItem>

        <IonItem>
          <IonLabel>Base Price</IonLabel>
          <IonLabel slot='end'>₹{selectedPolicy.basePrice}</IonLabel>
        </IonItem>

        <IonItem className='ion-activated'>
          <IonLabel>GST</IonLabel>
          <IonLabel slot='end'>{selectedPolicy.gst}%</IonLabel>
        </IonItem>

        <IonItem className='ion-activated'>
          <IonLabel>Other Taxes</IonLabel>
          <IonLabel slot='end'>{selectedPolicy.otherTax}%</IonLabel>
        </IonItem>

        <IonItem className='ion-activated'>
          <IonLabel>Govt. Discount</IonLabel>
          <IonLabel slot='end'>{selectedPolicy.govDiscount}%</IonLabel>
        </IonItem>

        <IonItem className='ion-activated'>
          <IonLabel>Company Discount</IonLabel>
          <IonLabel slot='end'>{selectedPolicy.companyDiscount}%</IonLabel>
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
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <IonButton
              slot='start'
              shape='round'
              color='tertiary'
              expand='full'
              className='card-btn'
              onClick={saveHandler}
            >
              Save
            </IonButton>
            <IonButton
              slot='start'
              shape='round'
              color='tertiary'
              expand='full'
              className='card-btn'
              onClick={leaveHandler}
            >
              Leave
            </IonButton>
          </div>
        </IonCardContent>
      </IonCard>
    </>
  )
}

export default Breakups
