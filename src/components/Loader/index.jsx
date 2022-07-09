import React, { useState } from "react"
import { IonLoading } from "@ionic/react"

const Loader = ({ loading }) => {
  return (
    <IonLoading
      cssClass='my-custom-class'
      isOpen={loading}
      //   onDidDismiss={() => setShowLoading(false)}
      message={"Please wait..."}
    />
  )
}

export default Loader
