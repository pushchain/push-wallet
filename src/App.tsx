import './App.css'
import config from './config'
import ConnectWallet from './components/ConnectWallet'

function App() {
  return (
    <div className="App">
      <h1>{config.APP_NAME}</h1>
      <ConnectWallet />
    </div>
  )
}

export default App
