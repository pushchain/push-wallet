import { describe, it, expect, beforeAll } from 'vitest'
import { WalletClient, createWalletClient, http } from 'viem'
import { PushSigner } from './pushSigner'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

describe('PushSigner', () => {
  let walletClient: WalletClient

  beforeAll(async () => {
    walletClient = createWalletClient({
      account: privateKeyToAccount(generatePrivateKey()),
      chain: sepolia,
      transport: http(),
    })
  })

  it('should initialize with a WalletClient and return a PushSignerType', async () => {
    const pushSigner = await PushSigner.initialize(walletClient)
    expect(pushSigner).toEqual({
      account: expect.any(String),
      signMessage: expect.any(Function),
    })

    // Validate account format
    const { account } = pushSigner
    expect(account).toMatch(/^eip155:\d+:\b0x[0-9a-fA-F]{40}\b$/)

    // Test the signMessage function
    const signedMessage = await pushSigner.signMessage('testMessage')
    expect(signedMessage).toBeInstanceOf(Uint8Array)
  })

  it('should correctly handle real WalletClient instance', async () => {
    const pushSigner = await PushSigner.initialize(walletClient)

    // Fetch addresses and chainId from the WalletClient
    const [account] = await walletClient.getAddresses()
    const chainId = await walletClient.getChainId()

    // Test the PushSignerType returned
    expect(pushSigner.account).toBe(`eip155:${chainId}:${account}`)
  })

  it('should throw an error if WalletClient is not provided', async () => {
    // Assuming initialize throws an error if no WalletClient is provided
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await expect(PushSigner.initialize(null as any)).rejects.toThrow(
      'Invalid WalletClient'
    )
  })
})
