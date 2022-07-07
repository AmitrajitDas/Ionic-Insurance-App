import React, { useState, useEffect } from "react"
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  useIonLoading,
} from "@ionic/react"
import Card from "../Card"
import Breakups from "../Breakups"
import Loader from "../Loader/index"
import Alert from "../Alert"
import api from "../../api"

const Modal = ({ modalOpen, browse, beneficiaryID }) => {
  const [isOpen, setIsOpen] = useState(modalOpen)
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [isBooked, setIsBooked] = useState(!browse)
  const [bookedPolicy, setBookedPolicy] = useState({})
  const [present, dismiss] = useIonLoading()

  useEffect(() => {
    setLoading(true)
    api
      .get(`/getpoliciesforme/${beneficiaryID}`)
      .then((res) => {
        setPolicies(res.data.k)
      })
      .catch((err) => {
        setError(true)
        console.log(err)
      })
      .finally(() => setLoading(false))
  }, [beneficiaryID])

  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar color='tertiary'>
          <IonTitle>Modal</IonTitle>
          {/* <IonButtons slot='end'>
            <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
          </IonButtons> */}
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        {loading && <Loader loading={loading} />}
        {error && <Alert error={error} />}
        {!isBooked ? (
          policies.map((policy, i) => (
            <Card
              key={i}
              policy={policy}
              beneficiaryID={beneficiaryID}
              setIsBooked={setIsBooked}
              setBookedPolicy={setBookedPolicy}
            />
          ))
        ) : (
          <Breakups bookedPolicy={bookedPolicy} beneficiaryID={beneficiaryID} />
        )}
      </IonContent>
    </IonModal>
  )
}

export default Modal
