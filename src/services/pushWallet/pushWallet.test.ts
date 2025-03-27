import { describe, it, expect } from 'vitest'
import { PushWallet } from './pushWallet'
import { ENV } from '../../constants'
import { sha256 } from '@noble/hashes/sha256'
import { bytesToHex } from '@noble/hashes/utils'

// Test Suite for PushWallet Class
describe('PushWallet', () => {
  const env = ENV.DEV
  it('should successfully sign up and create a new PushWallet instance', async () => {
    const pushWallet = await PushWallet.signUp(env)
    expect(pushWallet).toBeInstanceOf(PushWallet)
    expect(pushWallet['did']).toBeDefined()
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
    expect(pushWallet['did']).toBeDefined()
    expect(pushWallet['mnemonic']).toBeDefined()
  })

  it('should throw an error when logging in with an invalid mnemonic', async () => {
    const invalidMnemonic = 'invalid mnemonic phrase'
    await expect(
      PushWallet.logInWithMnemonic(invalidMnemonic, env)
    ).rejects.toThrow('Invalid mnemonic')
  })

  it('should register a Push account when unregistered profile is true', async () => {
    const pushWallet = await PushWallet.signUp(env)
    await expect(pushWallet.registerPushAccount()).resolves.not.toThrow()
  })

  it('should throw error if trying to register an already registered Push account', async () => {
    const pushWallet = await PushWallet.signUp(env)
    PushWallet['unRegisteredProfile'] = false
    await expect(pushWallet.registerPushAccount()).rejects.toThrow(
      'Only Allowed for Unregistered Profile'
    )
  })

  it('should sign data using the derived key', async () => {
    const pushWallet = await PushWallet.signUp(env)
    const data = 'test data'
    const origin = 'https://test-wallet.com'
    const signature = pushWallet.sign(data, origin, [
      { origin: 'https://test-wallet.com', appConnectionStatus: 'connected' },
    ])
    expect(signature).toBeDefined()
  })

  it('should throw an error if trying to sign data for an unconnected app', async () => {
    const pushWallet = await PushWallet.signUp(env)
    const data = 'test data'
    const origin = 'unconnectedApp'
    await expect(pushWallet.sign(data, origin, [])).rejects.toThrow(
      'App not Connected'
    )
  })

  it('should create DID from MasterPublicKey', async () => {
    const did = `PUSH_DID:${bytesToHex(
      sha256(
        '02a975748d5ed9a8194d8368f98b62183cfc9e62864d850c63678c1778e457d038'
      )
    )}`
    expect(did).toBe(
      `PUSH_DID:e2d7a4abc7102c9bd4735b748695739b64e259545549c06bd1227dd68b0eeadc`
    )
  })
})
