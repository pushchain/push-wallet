/* eslint-disable @typescript-eslint/no-explicit-any */
import { PushWallet } from "../pushWallet/pushWallet";
import { ACTION } from "./messageHandler.types";
import { PushSigner } from "../pushSigner/pushSigner";

export class PostMessageHandler {
  // Store the previous listener to remove it if needed
  private static messageListener: (event: MessageEvent) => void;
  //fix the wallet type
  constructor(
    private externalWallet: any | undefined,
    private pushWallet: PushWallet | undefined,
    private onConnectionRequest: () => void
  ) {
    this.initializeListener();
  }

  private initializeListener(): void {
    // Remove the previous event listener if it exists
    if (PostMessageHandler.messageListener) {
      window.removeEventListener("message", PostMessageHandler.messageListener);
    }

    // Define the new listener and assign it to the static variable
    PostMessageHandler.messageListener = async (event: MessageEvent) => {
      // Ignore messages sent by this handler itself
      if (event.origin === "http://localhost:5173") {
        return;
      }

      console.log("event", event);

      const { action, data } = event.data;

      console.log("action", action);
      const pushSigner = this.externalWallet
        ? await PushSigner.initialize(this.externalWallet, "DYNAMIC")
        : undefined;
      // In case wallet not created or keys are encrypted
      const formattedExternalWallet = pushSigner?.account;
      if (formattedExternalWallet) {
        switch (action) {
          case ACTION.REQ_WALLET_DETAILS: {
            const loggedInAddress = formattedExternalWallet;
            event.source?.postMessage(
              {
                action: ACTION.WALLET_DETAILS,
                address: loggedInAddress,
              },
              event.origin as any
            );
            break;
          }
          case ACTION.IS_CONNECTED: {
            event.source?.postMessage(
              {
                action: ACTION.CONNECTION_STATUS,
                isPending: false,
                isConnected: true,
              },
              event.origin as any
            );
            break;
          }
          case ACTION.REQ_TO_SIGN: {
            try {
              const signature = await pushSigner.signMessage(data);
              event.source?.postMessage(
                { action: ACTION.SIGNATURE, signature },
                event.origin as any
              );
            } catch (err) {
              event.source?.postMessage(
                {
                  action: ACTION.ERROR,
                  error: "Origin Not Connected",
                },
                event.origin as any
              );
            }
            break;
          }
        }
      } else if (this?.pushWallet) {
        switch (action) {
          case ACTION.REQ_WALLET_DETAILS: {
            const loggedInAddress = this.pushWallet.signerAccount;
            event.source?.postMessage(
              {
                action: ACTION.WALLET_DETAILS,
                address: loggedInAddress,
              },
              event.origin as any
            );
            break;
          }
          case ACTION.IS_CONNECTED: {
            const connectionStatus = this.pushWallet.checkAppConnectionStatus(
              event.origin
            );

            event.source?.postMessage(
              {
                action: ACTION.CONNECTION_STATUS,
                ...connectionStatus,
              },
              event.origin as any
            );
            break;
          }
          case ACTION.REQ_TO_CONNECT: {
            this.pushWallet.requestToConnect(
              event.origin,
              this.onConnectionRequest
            );
            const connectionStatus = this.pushWallet.checkAppConnectionStatus(
              event.origin
            );

            event.source?.postMessage(
              {
                action: ACTION.CONNECTION_STATUS,
                ...connectionStatus,
              },
              event.origin as any
            );
            break;
          }
          case ACTION.REQ_TO_SIGN: {
            try {
              const signature = await this.pushWallet.sign(data, event.origin);
              event.source?.postMessage(
                { action: ACTION.SIGNATURE, signature },
                event.origin as any
              );
            } catch (err) {
              event.source?.postMessage(
                {
                  action: ACTION.ERROR,
                  error: "Origin Not Connected",
                },
                event.origin as any
              );
            }
            break;
          }
        }
      } else {
        event.source?.postMessage(
          {
            action: ACTION.ERROR,
            error: "PushWallet Not Logged In",
            authStatus: "notLoggedIn",
          },
          event.origin as any
        );
        global.myEvent = event;
      }
    };

    // Add the new event listener
    window.addEventListener("message", PostMessageHandler.messageListener);
  }
}
