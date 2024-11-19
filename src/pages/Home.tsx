import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UninitializedWallet } from '../components/UninitializedWallet'
import { InitializedWallet } from '../components/InitializedWallet'
import { useGlobalState } from '../context/GlobalContext'

export default function Home() {
  const { state } = useGlobalState()
  const navigate = useNavigate()

  useEffect(() => {
    // If the user is authenticated and has an initialized wallet, redirect to the profile page
    if (state.isAuthenticated) {
      navigate('/profile')
    }
  }, [state.isAuthenticated])


  return (
    <>
      {state.wallet === null ? <UninitializedWallet /> : <InitializedWallet />}
    </>
  )
}
