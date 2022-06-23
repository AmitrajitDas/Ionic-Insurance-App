import { IonGrid, IonRow, IonButton, IonCol } from "@ionic/react"
import SVG from "../../assets/home.svg"
import "./landing.styles.css"

const Landing: React.FC = () => (
  <IonGrid className='landing-root'>
    <IonRow className='svg-wrapper center'>
      <img src={SVG} alt='svg' />
    </IonRow>
    <IonRow className='header center'>
      <IonCol>
        Secure best insurance plan that is right for you and your family
      </IonCol>
    </IonRow>
    <IonRow className='btn-wrapper center'>
      <IonButton color='tertiary' shape='round' className='btn' mode='ios'>
        Get Started
      </IonButton>
    </IonRow>
  </IonGrid>
)

export default Landing
