import React, { useState, useEffect } from "react"
import {
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
} from "@ionic/react"
import Card from "../Card"
import Breakups from "../Breakups"
import Loader from "../Loader/index"
import Alert from "../Alert"
import api from "../../api"

const Modal = ({
  modalOpen,
  browsePolicies,
  browseUnboughtPolicies,
  beneficiaryID,
  userID,
}) => {
  const [isOpen, setIsOpen] = useState(modalOpen)
  const [policies, setPolicies] = useState([])
  const [unboughtPolicies, setUnboughtPolicies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [isBooked, setIsBooked] = useState(!browsePolicies)
  const [isUnbought, setIsUnbought] = useState(browseUnboughtPolicies)
  const [bookedPolicy, setBookedPolicy] = useState({})

  useEffect(() => {
    setLoading(true)
    if (browsePolicies) {
      api
        .get(`/getpoliciesforme/${beneficiaryID}`)
        .then((res) => {
          setPolicies(res.data.policies)
        })
        .catch((err) => {
          setError(true)
          console.log(err)
        })
        .finally(() => setLoading(false))
    }

    if (browseUnboughtPolicies) {
      api
        .post("/getunboughtpolicies", JSON.stringify({ userID }))
        .then((res) => {
          setUnboughtPolicies(res.data.unboughtPolicies)
        })
        .catch((err) => {
          setError(true)
          console.log(err)
        })
        .finally(() => setLoading(false))
    }
  }, [beneficiaryID, browsePolicies, browseUnboughtPolicies, userID])

  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar color='tertiary'>
          <IonTitle>Browse and Purchase your suitable policies</IonTitle>
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
              userID={userID}
              isBooked={isBooked}
              setIsBooked={setIsBooked}
              setBookedPolicy={setBookedPolicy}
            />
          ))
        ) : isUnbought ? (
          unboughtPolicies.map((unboughtPolicy, i) => (
            <Card
              key={i}
              unboughtPolicy={unboughtPolicy}
              beneficiaryID={beneficiaryID}
              userID={userID}
              isUnbought={isUnbought}
              setBookedPolicy={setBookedPolicy}
              setIsUnbought={setIsUnbought}
            />
          ))
        ) : (
          <Breakups
            bookedPolicy={bookedPolicy}
            beneficiaryID={bookedPolicy.policyHolder_id}
            userID={userID}
          />
        )}
      </IonContent>
    </IonModal>
  )
}

export default Modal
