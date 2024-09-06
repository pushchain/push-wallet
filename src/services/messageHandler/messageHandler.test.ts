import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PostMessageHandler } from './messageHandler'
import { PushWallet } from '../pushWallet/pushWallet'
import { ACTION } from './messageHandler.types'
import { createWalletClient, http } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import { ENV } from '../../constants'
describe('PostMessageHandler', () => {
  let pushWallet: PushWallet

  beforeEach(async () => {
    const walletClient = createWalletClient({
      account: privateKeyToAccount(generatePrivateKey()),
      chain: sepolia,
      transport: http(),
    })
    pushWallet = await PushWallet.initialize(walletClient, {
      env: ENV.DEV,
    })
  })

  it('should handle ERROR case when pushWallet is undefined', () => {
    new PostMessageHandler(undefined)
    const postMessageSpy = vi.fn()
    const event = {
      data: { action: ACTION.IS_CONNECTED, data: null },
      source: { postMessage: postMessageSpy },
      origin: 'http://example.com',
    } as unknown as MessageEventInit

    // Trigger the message event
    window.dispatchEvent(new MessageEvent('message', event))

    // Verify the postMessage call for error
    expect(postMessageSpy).toHaveBeenCalledWith({
      action: ACTION.ERROR,
      error: 'PushWallet Not Found',
    })
  })

  it('should handle REQ_TO_CONNECT action and update connection status', () => {
    new PostMessageHandler(pushWallet)
    const postMessageSpy = vi.fn()
    const event = {
      data: { action: ACTION.REQ_TO_CONNECT, data: null },
      source: { postMessage: postMessageSpy },
      origin: 'http://example.com',
    } as unknown as MessageEventInit

    // Trigger the message event
    window.dispatchEvent(new MessageEvent('message', event))

    // Verify the postMessage call for connection status
    expect(postMessageSpy).toHaveBeenCalledWith({
      action: ACTION.CONNECTION_STATUS,
      isPending: true,
      isConnected: false,
    })
  })

  it('should handle REQ_TO_CONNECT action for already connected app', () => {
    new PostMessageHandler(pushWallet)
    const postMessageSpy = vi.fn()
    const event = {
      data: { action: ACTION.REQ_TO_CONNECT, data: null },
      source: { postMessage: postMessageSpy },
      origin: 'http://example.com',
    } as unknown as MessageEventInit

    // Trigger the message event
    window.dispatchEvent(new MessageEvent('message', event))
    pushWallet.acceptConnectionReq(event.origin || '')

    // Trigger the message event
    window.dispatchEvent(new MessageEvent('message', event))

    // Verify the postMessage call for connection status
    expect(postMessageSpy).toHaveBeenCalledWith({
      action: ACTION.CONNECTION_STATUS,
      isPending: false,
      isConnected: true,
    })
  })

  it('should handle IS_CONNECTED action when pushWallet is defined', async () => {
    new PostMessageHandler(pushWallet)
    const postMessageSpy = vi.fn()
    const connectionEvent = {
      data: { action: ACTION.IS_CONNECTED, data: null },
      source: { postMessage: postMessageSpy },
      origin: 'http://example.com',
    } as unknown as MessageEventInit

    // Trigger the message event
    window.dispatchEvent(new MessageEvent('message', connectionEvent))

    // Verify the postMessage call
    expect(postMessageSpy).toHaveBeenCalledWith({
      action: ACTION.CONNECTION_STATUS,
      isPending: false,
      isConnected: false,
    })

    const reqConnectEvent = {
      data: { action: ACTION.REQ_TO_CONNECT, data: null },
      source: { postMessage: postMessageSpy },
      origin: 'http://example.com',
    } as unknown as MessageEventInit

    // Trigger the message event
    window.dispatchEvent(new MessageEvent('message', reqConnectEvent))

    // Verify the postMessage call
    expect(postMessageSpy).toHaveBeenCalledWith({
      action: ACTION.CONNECTION_STATUS,
      isPending: true,
      isConnected: false,
    })

    pushWallet.acceptConnectionReq(connectionEvent.origin || '')

    // Trigger the message event
    window.dispatchEvent(new MessageEvent('message', connectionEvent))

    // Verify the postMessage call
    expect(postMessageSpy).toHaveBeenCalledWith({
      action: ACTION.CONNECTION_STATUS,
      isPending: false,
      isConnected: true,
    })
  })

  it('should handle REQ_TO_SIGN action with an error if the origin is not connected', () => {
    new PostMessageHandler(pushWallet)

    const postMessageSpy = vi.fn()
    const event = {
      data: { action: ACTION.REQ_TO_SIGN, data: 'test-data' },
      source: { postMessage: postMessageSpy },
      origin: 'http://not-connected-origin.com',
    } as unknown as MessageEventInit

    // Trigger the message event
    window.dispatchEvent(new MessageEvent('message', event))

    // Verify the postMessage call for error
    expect(postMessageSpy).toHaveBeenCalledWith({
      action: ACTION.ERROR,
      error: 'Origin Not Connected',
    })
  })

  it('should handle REQ_TO_SIGN action and return a signature', () => {
    new PostMessageHandler(pushWallet)
    const reqToConnectEvent = {
      data: { action: ACTION.REQ_TO_CONNECT, data: null },
      origin: 'http://example.com',
    } as unknown as MessageEventInit

    // Trigger the message event
    window.dispatchEvent(new MessageEvent('message', reqToConnectEvent))
    pushWallet.acceptConnectionReq(reqToConnectEvent.origin || '')

    const postMessageSpy = vi.fn()
    const event = {
      data: { action: ACTION.REQ_TO_SIGN, data: 'test-data' },
      source: { postMessage: postMessageSpy },
      origin: 'http://example.com',
    } as unknown as MessageEventInit

    // Trigger the message event
    window.dispatchEvent(new MessageEvent('message', event))

    // Verify the postMessage call for signature
    expect(postMessageSpy).toHaveBeenCalledWith({
      action: ACTION.SIGNATURE,
      signature: pushWallet.sign('test-data'),
    })
  })
})
