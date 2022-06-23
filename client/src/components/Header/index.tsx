import { useState } from "react"
import { IonHeader, IonIcon, IonTitle, IonToolbar } from "@ionic/react"
import Menu from "../Menu"
import { menu } from "ionicons/icons"
import "./header.styles.css"

type Anchor = "menu"

const Header: React.FC = () => {
  const [state, setState] = useState({
    menu: false,
  })

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return
      }

      setState({ ...state, [anchor]: open })
    }

  return (
    <IonHeader>
      <IonToolbar color='tertiary'>
        <div
          slot='start'
          style={{ marginLeft: "0.5rem" }}
          onClick={toggleDrawer("menu", true)}
        >
          <IonIcon icon={menu} size='large' />
          <Menu
            state={state}
            setState={setState}
            toggleDrawer={toggleDrawer}
            anchor='menu'
          />
        </div>
        <IonTitle className='ion-text-center header-title'>
          Wingsure Policies
        </IonTitle>
      </IonToolbar>
    </IonHeader>
  )
}

export default Header
