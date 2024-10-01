import { describe, it, expect } from 'vitest'
import { PushWallet } from './pushWallet'
import { ENV } from '../../constants'
import { createWalletClient, http } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

// Test Suite for PushWallet Class
describe('PushWallet', () => {
  const env = ENV.DEV
  it('should successfully sign up and create a new PushWallet instance', async () => {
    const pushWallet = await PushWallet.signUp(env)
    expect(pushWallet).toBeInstanceOf(PushWallet)
    expect(pushWallet.did).toBeDefined()
    expect(pushWallet.account).toBeDefined()
    expect(pushWallet['derivedHDNode']).toBeDefined()
    expect(pushWallet['mnemonic']).toBeDefined()
  })

  // TODO : Unskip after registration is fixed
  it.skip('should log in with mnemonic and return a PushWallet instance', async () => {
    const pW = await PushWallet.signUp(env)
    await pW.registerPushAccount()
    const pushWallet = await PushWallet.logInWithMnemonic(
      pW['mnemonic'] as string,
      env
    )
    expect(pushWallet).toBeInstanceOf(PushWallet)
    expect(pushWallet.did).toBeDefined()
    expect(pushWallet.account).toBeDefined()
    expect(pushWallet['derivedHDNode']).toBeDefined()
    expect(pushWallet['mnemonic']).toBeDefined()
  })

  it('should throw an error when logging in with an invalid mnemonic', async () => {
    const invalidMnemonic = 'invalid mnemonic phrase'
    await expect(
      PushWallet.logInWithMnemonic(invalidMnemonic, env)
    ).rejects.toThrow('Invalid mnemonic')
  })

  it('should reject when logging in with a wallet if Push account is not found', async () => {
    const walletClient = createWalletClient({
      account: privateKeyToAccount(generatePrivateKey()),
      chain: sepolia,
      transport: http(),
    })
    await expect(PushWallet.loginWithWallet(walletClient, env)).rejects.toThrow(
      'Push Account Not Found!'
    )
  })

  it('should connect a wallet with an unregistered profile', async () => {
    const pushWallet = await PushWallet.signUp(env)
    const walletClient = createWalletClient({
      account: privateKeyToAccount(generatePrivateKey()),
      chain: sepolia,
      transport: http(),
    })
    await expect(
      pushWallet.connectWalletWithAccount(walletClient)
    ).resolves.not.toThrow()
  })

  // TODO : Unskip after registration is fixed
  it.skip('should throw an error if trying to connect wallet without unregistered profile', async () => {
    const pW = await PushWallet.signUp(env)
    await pW.registerPushAccount()
    const pushWallet = await PushWallet.logInWithMnemonic(
      pW['mnemonic'] as string,
      env
    )
    const walletClient = createWalletClient({
      account: privateKeyToAccount(generatePrivateKey()),
      chain: sepolia,
      transport: http(),
    })
    await expect(
      pushWallet.connectWalletWithAccount(walletClient)
    ).rejects.toThrow('Only Allowed for Unregistered Profile')
  })

  // TODO : Unskip after registration is fixed
  it.skip('should register a Push account when unregistered profile is true', async () => {
    const pushWallet = await PushWallet.signUp(env)
    await expect(pushWallet.registerPushAccount()).resolves.not.toThrow()
  })

  // TODO : Unskip after registration is fixed
  it.skip('should throw error if trying to register an already registered Push account', async () => {
    const pushWallet = await PushWallet.signUp(env)
    await pushWallet.registerPushAccount()
    await expect(pushWallet.registerPushAccount()).rejects.toThrow(
      'Only Allowed for Unregistered Profile'
    )
  })

  it('should sign data using the derived key', async () => {
    const pushWallet = await PushWallet.signUp(env)
    const data = 'test data'
    const origin = 'https://test-wallet.com'
    pushWallet.requestToConnect(origin)
    pushWallet.acceptConnectionReq(origin)
    const signature = pushWallet.sign(data, origin)
    expect(signature).toBeDefined()
  })

  it('should throw an error if trying to sign data for an unconnected app', async () => {
    const pushWallet = await PushWallet.signUp(env)
    const data = 'test data'
    const origin = 'unconnectedApp'
    await expect(() => pushWallet.sign(data, origin)).toThrow(
      'App not Connected'
    )
  })

  it('should return connection status for a connected app', async () => {
    const pushWallet = await PushWallet.signUp(env)
    const origin = 'app1'
    pushWallet.requestToConnect(origin)
    const statusBefore = pushWallet.ConnectionStatus(origin)
    expect(statusBefore.isPending).toBe(true)
    pushWallet.acceptConnectionReq(origin)
    const statusAfter = pushWallet.ConnectionStatus(origin)
    expect(statusAfter.isConnected).toBe(true)
    expect(statusAfter.isPending).toBe(false)
  })

  it('should handle rejecting connection requests', async () => {
    const pushWallet = await PushWallet.signUp(env)
    const origin = 'app1'
    pushWallet.requestToConnect(origin)
    pushWallet.rejectConnectionReq(origin)
    const status = pushWallet.ConnectionStatus(origin)
    expect(status.isConnected).toBe(false)
    expect(status.isPending).toBe(false)
  })

  it('should generate random session keys', async () => {
    const pushWallet = await PushWallet.signUp(env)
    const sessionKey = pushWallet['generateRandomSessionKey']()
    expect(sessionKey).toBeDefined()
    expect(sessionKey.privateKey).toBeDefined()
    expect(sessionKey.publicKey).toBeDefined()
  })
})
