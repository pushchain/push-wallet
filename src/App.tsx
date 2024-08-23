import './App.css'
import { useConnectWallet } from '@web3-onboard/react'
import config from './config'

function App() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

  return (
    <div className="App">
      <h1>{config.APP_NAME}</h1>
      <button onClick={() => connect()}>connect</button>
    </div>
  )
}

export default App
