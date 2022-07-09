import { IonGrid, IonRow, IonButton, IonCol } from "@ionic/react"
import { useHistory } from "react-router"
import SVG from "../../assets/home.svg"
import "./landing.styles.css"

const Landing = () => {
  const history = useHistory()
  return (
    <IonGrid className='landing-root'>
      <IonRow className='svg-wrapper center'>
        <img src={SVG} alt='svg' />
      </IonRow>
      <IonRow className='header center'>
        <IonCol>
          Secure the best insurance plan that is right for you and your family
        </IonCol>
      </IonRow>
      <IonRow className='btn-wrapper center'>
        <IonButton
          color='tertiary'
          shape='round'
          className='btn'
          onClick={(e) => {
            e.preventDefault()
            history.push("/cform/WingBot")
          }}
        >
          Get Started
        </IonButton>
      </IonRow>
    </IonGrid>
  )
}

export default Landing
