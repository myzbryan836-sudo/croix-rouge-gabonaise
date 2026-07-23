import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/shared/ProtectedRoute'
import Home from './pages/Home'
import Missions from './pages/Missions'
import Actualites from './pages/Actualites'
import ArticleDetail from './pages/ArticleDetail'
import Dons from './pages/Dons'
import Benevoles from './pages/Benevoles'
import APropos from './pages/APropos'
import NosRessources from './pages/NosRessources'
import Partenaires from './pages/Partenaires'
import Galerie from './pages/Galerie'
import CarteInterventions from './pages/CarteInterventions'
import Contact from './pages/Contact'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/actualites" element={<Actualites />} />
        <Route path="/actualites/:id" element={<ArticleDetail />} />
        <Route path="/dons" element={<Dons />} />
        <Route path="/benevoles" element={<Benevoles />} />
        <Route path="/qui-sommes-nous" element={<APropos />} />
        <Route path="/nos-ressources" element={<NosRessources />} />
        <Route path="/partenaires" element={<Partenaires />} />
        <Route path="/galerie" element={<Galerie />} />
        <Route path="/carte-interventions" element={<CarteInterventions />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/connexion" element={<Login />} />
      <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <Admin />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}