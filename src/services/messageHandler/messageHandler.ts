/* eslint-disable @typescript-eslint/no-explicit-any */
import { PushWallet } from "../pushWallet/pushWallet";
import { ACTION } from "./messageHandler.types";
import { PushSigner } from "../pushSigner/pushSigner";
import { GlobalAction } from "../../context/GlobalContext";

export class PostMessageHandler {
  // Store the previous listener to remove it if needed
  private static messageListener: (event: MessageEvent) => void;
  constructor(
    private externalWallet: any | undefined,
    private pushWallet: PushWallet | undefined,
    private onConnectionRequest: () => void,
    private dispatch: React.Dispatch<GlobalAction>
  ) {
    this.initializeListener();
  }

  private initializeListener(): void {
    console.log("Listener called");

    // Remove the previous event listener if it exists
    if (PostMessageHandler.messageListener) {
      window.removeEventListener("message", PostMessageHandler.messageListener);
    }

    // Define the new listener and assign it to the static variable
    PostMessageHandler.messageListener = async (event: MessageEvent) => {
      console.log("Listener called 2");
      // Ignore messages sent by this handler itself
      const origin = window.location.origin;
      if (event.origin === origin) {
        return;
      }

      console.log("Listener called 3", event);

      const { action, data } = event.data;
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
            this.dispatch({
              type: "SET_EXTERNAL_WALLET_APP_CONNECTION_STATUS",
              payload: "connected",
            });
            event.source?.postMessage(
              {
                action: ACTION.CONNECTION_STATUS,
                appConnectionStatus: "connected",
                authStatus: "loggedIn",
              },
              event.origin as any
            );
            break;
          }
          case ACTION.REQ_TO_SIGN: {
            try {
              this.dispatch({ type: "SET_MESSAGE_SIGN_LOAD_STATE" });
              const signature = await pushSigner.signMessage(data);
              event.source?.postMessage(
                { action: ACTION.SIGNATURE, signature },
                event.origin as any
              );
              this.dispatch({ type: "RESET_MESSAGE_SIGN" });
            } catch (err) {
              this.dispatch({ type: "SET_MESSAGE_SIGN_REJECT_STATE" });
              event.source?.postMessage(
                {
                  action: ACTION.ERROR,
                  error: err?.message,
                },
                event.origin as any
              );
            }
            break;
          }
        }
      } else if (this.pushWallet) {
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
          case ACTION.AUTH_STATUS: {
            try {
              console.log("This.push Wallet", this.pushWallet);
              event.source?.postMessage(
                { action: ACTION.AUTH_STATUS, data: "connected" },
                event.origin as any
              );
            } catch (error) {
              event.source?.postMessage(
                {
                  action: ACTION.ERROR,
                  error: error?.message,
                },
                event.origin as any
              );
            }
            break;
          }
          case ACTION.REQ_TO_SIGN: {
            try {
              this.dispatch({ type: "SET_MESSAGE_SIGN_LOAD_STATE" });
              const signature = await this.pushWallet.sign(data, event.origin);
              event.source?.postMessage(
                { action: ACTION.SIGNATURE, signature },
                event.origin as any
              );
              setTimeout(() => {
                this.dispatch({ type: "RESET_MESSAGE_SIGN" });
              }, 2000);
            } catch (err) {
              this.dispatch({ type: "SET_MESSAGE_SIGN_REJECT_STATE" });
              event.source?.postMessage(
                {
                  action: ACTION.ERROR,
                  error: err?.message,
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
