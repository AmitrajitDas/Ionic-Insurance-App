import {
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
} from "@ionic/react"

const Landing: React.FC = () => (
  <IonGrid>
    <IonRow>
      <IonCol>
        <IonItem>
          <IonLabel position='floating'>Input Currency</IonLabel>
          <IonInput></IonInput>
        </IonItem>
      </IonCol>
    </IonRow>
    <IonRow>
      <IonCol>
        <IonItem>
          <IonLabel position='floating'>Input Currency</IonLabel>
          <IonInput></IonInput>
        </IonItem>
      </IonCol>
    </IonRow>
  </IonGrid>
)

export default Landing
