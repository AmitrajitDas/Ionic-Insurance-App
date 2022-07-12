import React, { useState } from "react"
import { IonAlert } from "@ionic/react"
const Alert = ({ error, sucess, booked }) => {
  return (
    <IonAlert
      isOpen={error || sucess || booked}
      onDidDismiss={() => window.location.reload(false)}
      header={error ? "Error" : sucess ? "Success" : booked ? "Booked" : null}
      subHeader={
        error
          ? "Your request is invalid"
          : sucess
          ? "Transaction successful"
          : booked
          ? "Booking done"
          : null
      }
      message={
        error
          ? "Please try again!"
          : sucess
          ? "Thank you for the purchase!"
          : booked
          ? "Come back later when you want to purchase this premium"
          : null
      }
      buttons={["OK"]}
    />
  )
}

export default Alert
