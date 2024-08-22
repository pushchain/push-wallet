import { describe, it, expect, beforeEach } from 'vitest'
import { PushWallet } from './pushWallet'
import { createWalletClient, http, WalletClient } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import { ENV } from '../../constants'
import { sha256 } from '@noble/hashes/sha256'

describe('PushWallet', () => {
  let walletClient: WalletClient

  beforeEach(async () => {
    walletClient = createWalletClient({
      account: privateKeyToAccount(generatePrivateKey()),
      chain: sepolia,
      transport: http(),
    })
  })

  it('should initialize a PushWallet instance', async () => {
    const pushWalletInstance = await PushWallet.initialize(walletClient, {
      env: ENV.DEV,
    })
    expect(pushWalletInstance).toBeInstanceOf(PushWallet)
    expect(pushWalletInstance).toHaveProperty('did')
    expect(pushWalletInstance).toHaveProperty('account')
    expect(pushWalletInstance).toHaveProperty('derivedHDNode')
    expect(pushWalletInstance).toHaveProperty('mnemonic')
  })

  it('should sign data with wallet', async () => {
    const pushWalletInstance = await PushWallet.initialize(walletClient, {
      env: ENV.DEV,
    })
    const signature = pushWalletInstance.sign('Hello')
    expect(signature).toBeInstanceOf(Uint8Array)
  })
  it('should verify signed data with wallet', async () => {
    const pushWalletInstance = await PushWallet.initialize(walletClient, {
      env: ENV.DEV,
    })
    const signature = pushWalletInstance.sign('Hello')
    expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (pushWalletInstance as any).derivedHDNode.verify(
        sha256('Hello'),
        signature
      )
    ).toBe(true)
    expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (pushWalletInstance as any).derivedHDNode.verify(
        sha256('Helo'),
        signature
      )
    ).toBe(false)
  })
})
