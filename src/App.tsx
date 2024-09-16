import config from './config'
import Home from './pages/Home'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <h1 className="text-4xl font-bold mt-8 text-center">{config.APP_NAME}</h1>
      <div className="flex-1 flex items-center justify-center">
        <Home />
      </div>
    </div>
  )
}

export default App
