import React, { useState, useEffect } from "react"
import {
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/react"
import { arrowBackOutline } from "ionicons/icons"
import { useHistory } from "react-router"
import Card from "../Card"
import Breakups from "../Breakups"
import Loader from "../Loader/index"
import Alert from "../Alert"
import api from "../../api"
import useAuth from "../../context/useAuth"

const Modal = ({
  modalOpen,
  browsePolicies,
  browseUnboughtPolicies,
  beneficiaryID,
  userID,
}) => {
  const history = useHistory()

  const [isOpen, setIsOpen] = useState(modalOpen)
  const [policies, setPolicies] = useState([])
  const [unboughtPolicies, setUnboughtPolicies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [isSelected, setIsSelected] = useState(!browsePolicies)
  const [isUnbought, setIsUnbought] = useState(browseUnboughtPolicies)
  const [savedPolicy, setSavedPolicy] = useState(false)
  const [selectedPolicy, setSelectedPolicy] = useState({})

  // const { modalOpen, openModal, closeModal } = useAuth()

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

    // for browsing
    if (!isSelected && !isUnbought) {
      setIsSelected(true)
      setIsOpen(false)
    }
    if (isSelected && !isUnbought && !savedPolicy) setIsSelected(false)

    // for unbought
    if (!isUnbought && savedPolicy) setIsUnbought(true)
    if (isSelected && isUnbought) {
      setIsUnbought(false)
      setIsOpen(false)
    }
    // if (isSelected && !isUnbought && !savedPolicy) setIsSelected(false)
    // if (!isUnbought && savedPolicy) setIsUnbought(true)
  }

  const homeRouteHandler = (e) => {
    e.preventDefault()
    setIsOpen(false)
  }

  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar color='tertiary'>
          <IonButtons slot='start'>
            <IonButton onClick={backHandler}>
              <IonIcon md={arrowBackOutline} />
            </IonButton>
          </IonButtons>

          <IonTitle>Browse and Purchase</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        {loading && <Loader loading={loading} />}
        {error && <Alert error={error} />}
        {policies.length === 0 && unboughtPolicies.length === 0 && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                fontFamily: "Merriweather Sans",
                fontSize: "15px",
                fontWeight: "400",
                color: "#202666",
              }}
            >
              No Policies available for you currently
            </div>
            <IonButton
              shape='round'
              color='tertiary'
              expand='full'
              className='card-btn'
              style={{
                display: "flex",
                justifyContent: "center",
              }}
              onClick={homeRouteHandler}
            >
              Go Back
            </IonButton>
          </>
        )}
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
            savedPolicy={savedPolicy}
            setIsOpen={setIsOpen}
          />
        )}
      </IonContent>
    </IonModal>
  )
}

export default Modal
