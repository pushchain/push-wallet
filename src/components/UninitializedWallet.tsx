import { useNavigate } from 'react-router-dom'

export const UninitializedWallet: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex gap-5">
      <button
        onClick={() => navigate('/signup')}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg w-44"
      >
        Sign Up
      </button>
      <button
        onClick={() => navigate('/login')}
        className="bg-green-600 text-white px-6 py-3 rounded-lg w-44"
      >
        Login
      </button>
    </div>
  )
}
