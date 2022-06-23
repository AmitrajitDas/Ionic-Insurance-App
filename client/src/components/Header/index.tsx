import { IonHeader, IonTitle, IonToolbar } from "@ionic/react"
import "./header.styles.css"

const Header: React.FC = () => (
  <IonHeader>
    <IonToolbar color='tertiary'>
      <IonTitle className='ion-text-center header-title'>
        Wingsure Policies
      </IonTitle>
    </IonToolbar>
  </IonHeader>
)

export default Header
