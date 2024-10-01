import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PostMessageHandler } from './messageHandler'
import { PushWallet } from '../pushWallet/pushWallet'
import { ACTION } from './messageHandler.types'
import { ENV } from '../../constants'
describe('PostMessageHandler', () => {
  let pushWallet: PushWallet
  const env = ENV.DEV

  beforeEach(async () => {
    pushWallet = await PushWallet.signUp(env)
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
    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        action: ACTION.ERROR,
        error: 'PushWallet Not Logged In',
      },
      event.origin
    )
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
    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        action: ACTION.CONNECTION_STATUS,
        isPending: true,
        isConnected: false,
      },
      event.origin
    )
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
    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        action: ACTION.CONNECTION_STATUS,
        isPending: false,
        isConnected: true,
      },
      event.origin
    )
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
    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        action: ACTION.CONNECTION_STATUS,
        isPending: false,
        isConnected: false,
      },
      connectionEvent.origin
    )

    const reqConnectEvent = {
      data: { action: ACTION.REQ_TO_CONNECT, data: null },
      source: { postMessage: postMessageSpy },
      origin: 'http://example.com',
    } as unknown as MessageEventInit

    // Trigger the message event
    window.dispatchEvent(new MessageEvent('message', reqConnectEvent))

    // Verify the postMessage call
    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        action: ACTION.CONNECTION_STATUS,
        isPending: true,
        isConnected: false,
      },
      reqConnectEvent.origin
    )

    pushWallet.acceptConnectionReq(connectionEvent.origin || '')

    // Trigger the message event
    window.dispatchEvent(new MessageEvent('message', connectionEvent))

    // Verify the postMessage call
    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        action: ACTION.CONNECTION_STATUS,
        isPending: false,
        isConnected: true,
      },
      connectionEvent.origin
    )
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
    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        action: ACTION.ERROR,
        error: 'Origin Not Connected',
      },
      event.origin
    )
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
    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        action: ACTION.SIGNATURE,
        signature: pushWallet.sign('test-data', event.origin || ''),
      },
      event.origin
    )
  })
})
