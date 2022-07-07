import React, { useState } from "react"
import { IonAlert } from "@ionic/react"
const Alert = ({ error, sucess }) => {
  return (
    <IonAlert
      isOpen={error || sucess}
      onDidDismiss={() => window.location.reload(false)}
      header={error ? "Error" : sucess ? "Success" : null}
      subHeader={
        error
          ? "Your request is invalid"
          : sucess
          ? "Your request is successful"
          : null
      }
      message={error ? "Please try again!" : sucess ? "Come back later!" : null}
      buttons={["OK"]}
    />
  )
}

export default Alert
