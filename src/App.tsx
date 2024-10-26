import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { Home, Login, Signup, Profile } from './pages'
import config from './config'
import { GlobalProvider, useGlobalState } from './context/GlobalContext'

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { state } = useGlobalState()
  return state.isAuthenticated ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <GlobalProvider>
      <div className="min-h-screen flex flex-col">
        <h1 className="text-4xl font-bold mt-8 text-center">
          {config.APP_NAME}
        </h1>
        <div className="flex-1 flex items-center justify-center">
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="profile" element={<Profile />} />
              {/* Redirect to home if route is not found */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </div>
      </div>
    </GlobalProvider>
  )
}
