import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import SeekerLanding from './pages/SeekerLanding'
import OwnerLanding from './pages/OwnerLanding'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<SeekerLanding />} />
          <Route path="/owners" element={<OwnerLanding />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
