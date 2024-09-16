export const Uninitialized = () => {
  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button onClick={() => console.log('Sign Up clicked')}>Sign Up</button>
      <button onClick={() => console.log('Login clicked')}>Login</button>
    </div>
  )
}
