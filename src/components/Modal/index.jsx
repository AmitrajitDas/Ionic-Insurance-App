import React, { useState, useEffect } from "react"
import {
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
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
  const [isSelected, setIsSelected] = useState(!browsePolicies)
  const [isUnbought, setIsUnbought] = useState(browseUnboughtPolicies)
  const [savedPolicy, setSavedPolicy] = useState(false)
  const [selectedPolicy, setSelectedPolicy] = useState({})

  useEffect(() => {
    setLoading(true)
    if (browsePolicies) {
      api
        .get(`/getpoliciesforme/${beneficiaryID}`)
        .then((res) => {
          console.log("matched policies", res.data)
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

  const backHandler = (e) => {
    e.preventDefault()
    // if(!isSelected) {
    //   setIsOpen(false)
    // }
    if (isSelected && !isUnbought && !savedPolicy) setIsSelected(false)
    if (!isUnbought && savedPolicy) setIsUnbought(true)
  }

  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar color='tertiary'>
          {((isSelected && !isUnbought) || (!isSelected && isUnbought)) && (
            <IonButtons slot='start'>
              <IonButton onClick={backHandler}>Back</IonButton>
            </IonButtons>
          )}

          <IonTitle>Browse and Purchase</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        {loading && <Loader loading={loading} />}
        {error && <Alert error={error} />}
        {!isSelected ? (
          policies.map((policy, i) => (
            <Card
              key={i}
              policy={policy}
              beneficiaryID={beneficiaryID}
              userID={userID}
              isSelected={isSelected}
              setIsSelected={setIsSelected}
              setSelectedPolicy={setSelectedPolicy}
              setIsUnbought={setIsUnbought}
            />
          ))
        ) : isUnbought ? (
          unboughtPolicies.map((unboughtPolicy, i) => (
            <Card
              key={i}
              unboughtPolicy={unboughtPolicy} //
              beneficiaryID={beneficiaryID}
              userID={userID}
              isUnbought={isUnbought}
              setSelectedPolicy={setSelectedPolicy}
              setIsUnbought={setIsUnbought}
              setSavedPolicy={setSavedPolicy}
            />
          ))
        ) : (
          <Breakups
            selectedPolicy={selectedPolicy}
            beneficiaryID={
              savedPolicy ? selectedPolicy?.policyHolder_id : beneficiaryID
            }
            userID={userID}
            isSelected={isSelected}
            setIsSelected={setIsSelected}
            isUnbought={isUnbought}
            setIsUnbought={setIsUnbought}
            setIsOpen={setIsOpen}
            savedPolicy={savedPolicy}
          />
        )}
      </IonContent>
    </IonModal>
  )
}

export default Modal
