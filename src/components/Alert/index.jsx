import React, { useState } from "react"
import { IonAlert } from "@ionic/react"
const Alert = ({ error, sucess, booked, removed, setIsOpen }) => {
  return (
    <IonAlert
      isOpen={error || sucess || booked || removed}
      onDidDismiss={() => setIsOpen(false)}
      header={
        error
          ? "Error"
          : sucess
          ? "Success"
          : booked
          ? "Booked"
          : removed
          ? "Removed"
          : null
      }
      subHeader={
        error
          ? "Your request is invalid"
          : sucess
          ? "Transaction successful"
          : booked
          ? "Booking done"
          : removed
          ? "Policy Removed"
          : null
      }
      message={
        error
          ? "Please try again!"
          : sucess
          ? "Thank you for the purchase!"
          : booked
          ? "Come back later when you want to purchase this premium"
          : removed
          ? "Your saved policy is removed successfully"
          : null
      }
      buttons={["OK"]}
    />
  )
}

export default Alert
