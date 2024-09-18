import { UninitializedWallet } from '../components/UninitializedWallet'
import { InitializedWallet } from '../components/InitializedWallet'
import { useGlobalState } from '../context/GlobalContext'

export default function Home() {
  const { state } = useGlobalState()

  return (
    <>
      {state.wallet === null ? <UninitializedWallet /> : <InitializedWallet />}
    </>
  )
}
