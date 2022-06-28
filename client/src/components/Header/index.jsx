import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react"
import { useParams } from "react-router"
import "./header.styles.css"

const Header = ({ children }) => {
  const { name } = useParams()

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color='tertiary'>
          <IonButtons slot='start'>
            <IonMenuButton />
          </IonButtons>
          <IonTitle className='header-title'>
            {name ? name : "Welcome to WingSurance"}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse='condense'></IonHeader>
        {children}
      </IonContent>
    </IonPage>
  )
}

export default Header
