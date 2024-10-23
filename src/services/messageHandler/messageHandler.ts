/* eslint-disable @typescript-eslint/no-explicit-any */
import { PushWallet } from '../pushWallet/pushWallet'
import { ACTION } from './messageHandler.types'

export class PostMessageHandler {
  // Store the previous listener to remove it if needed
  private static messageListener: (event: MessageEvent) => void

  constructor(private pushWallet: PushWallet | undefined) {
    this.initializeListener()
  }

  private initializeListener(): void {
    // Remove the previous event listener if it exists
    if (PostMessageHandler.messageListener) {
      window.removeEventListener('message', PostMessageHandler.messageListener)
    }

    // Define the new listener and assign it to the static variable
    PostMessageHandler.messageListener = async (event: MessageEvent) => {
      // Ignore messages sent by this handler itself
      if (event.origin === 'http://localhost:5174') {
        return
      }

      const { action, data } = event.data

      // In case wallet not created or keys are encrypted
      if (this.pushWallet === undefined) {
        event.source?.postMessage(
          {
            action: ACTION.ERROR,
            error: 'PushWallet Not Logged In',
          },
          event.origin as any
        )
        global.myEvent = event
      } else {
        switch (action) {
          case ACTION.REQ_WALLET_DETAILS: {
            const loggedInAddress = this.pushWallet.signerAccount
            event.source?.postMessage(
              {
                action: ACTION.WALLET_DETAILS,
                address: loggedInAddress,
              },
              event.origin as any
            )
            break
          }
          case ACTION.IS_CONNECTED: {
            const connectionStatus = this.pushWallet.ConnectionStatus(
              event.origin
            )
            event.source?.postMessage(
              {
                action: ACTION.CONNECTION_STATUS,
                isPending: connectionStatus.isPending,
                isConnected: connectionStatus.isConnected,
              },
              event.origin as any
            )
            break
          }
          case ACTION.REQ_TO_CONNECT: {
            this.pushWallet.requestToConnect(event.origin)
            const connectionStatus = this.pushWallet.ConnectionStatus(
              event.origin
            )
            event.source?.postMessage(
              {
                action: ACTION.CONNECTION_STATUS,
                isPending: connectionStatus.isPending,
                isConnected: connectionStatus.isConnected,
              },
              event.origin as any
            )
            break
          }
          case ACTION.REQ_TO_SIGN: {
            try {
              const signature = await this.pushWallet.sign(data, event.origin)
              event.source?.postMessage(
                { action: ACTION.SIGNATURE, signature },
                event.origin as any
              )
            } catch (err) {
              event.source?.postMessage(
                {
                  action: ACTION.ERROR,
                  error: 'Origin Not Connected',
                },
                event.origin as any
              )
            }
            break
          }
        }
      }
    }

    // Add the new event listener
    window.addEventListener('message', PostMessageHandler.messageListener)
  }
}
