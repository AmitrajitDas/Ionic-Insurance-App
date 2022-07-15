import React, { useState } from "react"
import { IonLoading } from "@ionic/react"

const Loader = ({ loading, formloader }) => {
  return (
    <IonLoading
      cssClass='my-custom-class'
      isOpen={loading || formloader}
      //   onDidDismiss={() => setShowLoading(false)}
      message={"Please wait..."}
    />
  )
}

export default Loader
