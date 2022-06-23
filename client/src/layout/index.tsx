import { IonApp, IonRouterOutlet } from "@ionic/react"
import { IonReactRouter } from "@ionic/react-router"
import Header from "../components/Header"
import Routes from "../routes"

const Layout: React.FC<React.ReactNode> = ({ children }) => (
  <div>
    <IonApp>
      <Header />
      <IonReactRouter>
        <IonRouterOutlet>
          <Routes />
        </IonRouterOutlet>
      </IonReactRouter>
      {children}
    </IonApp>
  </div>
)

export default Layout
