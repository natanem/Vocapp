import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useSettings } from './lib/hooks'
import Layout from './components/Layout'
import Home from './screens/Home'
import Welcome from './screens/Welcome'
import Placement from './screens/Placement'
import Learn from './screens/Learn'
import Review from './screens/Review'
import WordMap from './screens/WordMap'
import BandWords from './screens/BandWords'
import SettingsScreen from './screens/Settings'

function Routed() {
  const settings = useSettings()
  const location = useLocation()
  if (!settings) return null
  // Render onboarding in place rather than redirecting, so finishing it never
  // races the settings update and bounces back here.
  if (!settings.onboarded && location.pathname !== '/placement') return <Welcome />
  return (
    <Routes>
      <Route path="/placement" element={<Placement />} />
      <Route path="/learn" element={<Learn />} />
      <Route path="/review" element={<Review />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/words" element={<WordMap />} />
        <Route path="/words/:band" element={<BandWords />} />
        <Route path="/settings" element={<SettingsScreen />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routed />
    </HashRouter>
  )
}
