import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import SearchPage from './pages/SearchPage.tsx'
import SortPage from './pages/SortPage.tsx'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/sort" replace />} />
          <Route path="/sort" element={<SortPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<Navigate to="/sort" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
