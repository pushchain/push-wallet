import { PushWallet } from '../pushWallet/pushWallet'
import { ACTION } from './messageHandler.types'

export class PostMessageHandler {
  constructor(private pushWallet: PushWallet | undefined) {
    this.initializeListener()
  }

  private initializeListener(): void {
    window.addEventListener('message', async (event) => {
      const { action, data } = event.data

      // In case wallet not created or keys are encrypted
      if (this.pushWallet === undefined) {
        event.source?.postMessage({
          action: ACTION.ERROR,
          error: 'PushWallet Not Found',
        })
      } else {
        switch (action) {
          case ACTION.IS_CONNECTED: {
            const connectionStatus = this.pushWallet.ConnectionStatus(
              event.origin
            )
            event.source?.postMessage({
              action: ACTION.CONNECTION_STATUS,
              isPending: connectionStatus.isPending,
              isConnected: connectionStatus.isConnected,
            })
            break
          }
          case ACTION.REQ_TO_CONNECT: {
            this.pushWallet.requestToConnect(event.origin)
            const connectionStatus = this.pushWallet.ConnectionStatus(
              event.origin
            )
            event.source?.postMessage({
              action: ACTION.CONNECTION_STATUS,
              isPending: connectionStatus.isPending,
              isConnected: connectionStatus.isConnected,
            })
            break
          }
          case ACTION.REQ_TO_SIGN: {
            try {
              const signature = this.pushWallet.sign(data, event.origin)
              event.source?.postMessage({ action: ACTION.SIGNATURE, signature })
            } catch (err) {
              event.source?.postMessage({
                action: ACTION.ERROR,
                error: 'Origin Not Connected',
              })
            }
            break
          }
        }
      }
    })
  }
}
