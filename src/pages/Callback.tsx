import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalState } from '../context/GlobalContext'

export default function Callback() {
  const { isAuthenticated, isLoading, getAccessTokenSilently, user } = useAuth0()
  const navigate = useNavigate()
  const { dispatch } = useGlobalState()

  useEffect(() => {
    const handleCallback = async () => {
      if (isAuthenticated && user) {
        try {
          // Get the access token
          const token = await getAccessTokenSilently()
          
          // Store token in sessionStorage
          sessionStorage.setItem('jwt', token)
          
          // Update global state
          dispatch({ type: 'SET_JWT', payload: token })
          dispatch({ type: 'SET_USER', payload: user })
          dispatch({ type: 'SET_AUTHENTICATED', payload: true })
          
          // Redirect to profile
          navigate('/profile')
        } catch (error) {
          console.error('Error handling callback:', error)
          dispatch({ type: 'RESET_AUTHENTICATED' })
          dispatch({ type: 'RESET_USER' })
          navigate('/login')
        }
      }
    }

    if (!isLoading) {
      handleCallback()
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently, navigate, dispatch, user])

  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
    </div>
  )
}