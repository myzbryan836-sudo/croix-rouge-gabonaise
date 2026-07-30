import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/shared/ProtectedRoute'
import LoadingSpinner from './components/shared/LoadingSpinner'
import Home from './pages/Home'

const Missions = lazy(() => import('./pages/Missions'))
const Actualites = lazy(() => import('./pages/Actualites'))
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'))
const Dons = lazy(() => import('./pages/Dons'))
const Benevoles = lazy(() => import('./pages/Benevoles'))
const APropos = lazy(() => import('./pages/APropos'))
const NosRessources = lazy(() => import('./pages/NosRessources'))
const Partenaires = lazy(() => import('./pages/Partenaires'))
const Galerie = lazy(() => import('./pages/Galerie'))
const CarteInterventions = lazy(() => import('./pages/CarteInterventions'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Admin = lazy(() => import('./pages/Admin'))
const Register = lazy(() => import('./pages/Register'))

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner full />}>
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
        <Route path="/inscription" element={<Register />} />
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
    </Suspense>
  )
}