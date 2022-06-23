import { IonApp } from "@ionic/react"
import Header from "../components/Header"

const Layout: React.FC<React.ReactNode> = ({ children }) => (
  <div>
    <IonApp>
      <Header />
      {children}
    </IonApp>
  </div>
)

export default Layout
