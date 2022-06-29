import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from "@ionic/react"

import { useLocation } from "react-router-dom"
import {
  folderOutline,
  folderSharp,
  accessibilityOutline,
  accessibilitySharp,
  personCircleOutline,
  personCircleSharp,
} from "ionicons/icons"
import "./Menu.css"

const appPages = [
  {
    title: "My Policies",
    url: "/policies",
    iosIcon: folderOutline,
    mdIcon: folderSharp,
  },
  {
    title: "Beneficiaries",
    url: "/beneficiaries",
    iosIcon: accessibilityOutline,
    mdIcon: accessibilitySharp,
  },
  {
    title: "Profile",
    url: "/profile",
    iosIcon: personCircleOutline,
    mdIcon: personCircleSharp,
  },
]

// const labels = ["Family", "Friends", "Notes", "Work", "Travel", "Reminders"]

const Menu = () => {
  const location = useLocation()

  return (
    <IonMenu contentId='main' type='overlay'>
      <IonContent>
        <IonList id='inbox-list'>
          <IonListHeader>Menu</IonListHeader>
          {/* <IonNote>hi@ionicframework.com</IonNote> */}
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={appPage.url}
                  routerDirection='none'
                  lines='none'
                  detail={false}
                >
                  <IonIcon
                    slot='start'
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            )
          })}
        </IonList>

        {/* <IonList id='labels-list'>
          <IonListHeader>Labels</IonListHeader>
          {labels.map((label, index) => (
            <IonItem lines='none' key={index}>
              <IonIcon slot='start' icon={bookmarkOutline} />
              <IonLabel>{label}</IonLabel>
            </IonItem>
          ))}
        </IonList> */}
      </IonContent>
    </IonMenu>
  )
}

export default Menu
