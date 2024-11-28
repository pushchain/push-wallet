import { FC, useEffect, useState } from "react";
import { Box } from "../../blocks";
import { BoxLayout, ContentLayout } from "../../common";
import { WalletProfile } from "./components/WalletProfile";
import { WalletTabs } from "./components/WalletTabs";
import api from "../../services/api";
import { PushWallet } from "../../services/pushWallet/pushWallet";
import { APP_ROUTES, ENV } from "../../constants";
import secrets from "secrets.js-grempe";
import { useGlobalState } from "../../context/GlobalContext";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { CreateAccount } from "./components/CreateAccount";
import { getWalletlist } from "./Wallet.utils";
import { WalletListType } from "./Wallet.types";
import config from "../../config";
import { PushSigner } from "../../services/pushSigner/pushSigner";
import { AppConnections } from "../../common/components/AppConnections";
import { useNavigate } from "react-router-dom";
import { LoadingPage } from "../../pages/LoadingPage";

export type WalletProps = {};

const Wallet: FC<WalletProps> = () => {
  const { state, dispatch } = useGlobalState();
  const [loading, setLoading] = useState(true);
  const [createAccountLoading, setCreateAccountLoading] = useState(false);
  const [error, setError] = useState("");
  const { primaryWallet } = useDynamicContext();

  const [selectedWallet, setSelectedWallet] = useState<WalletListType>();

  const navigate = useNavigate();

  const createWalletAndGenerateMnemonic = async (userId: string) => {
    try {
      setLoading(true);
      const instance = await PushWallet.signUp(
        import.meta.env.VITE_APP_ENV as ENV
      );

      const mnemonicHex = Buffer.from(instance.mnemonic).toString("hex");
      const shares = secrets.share(mnemonicHex, 3, 2);

      await api.post(`/mnemonic-share/${userId}`, { share: shares[0] });
      localStorage.setItem(`mnemonicShare2:${userId}`, shares[1]);
      await instance.storeMnemonicShareAsEncryptedTx(
        userId,
        shares[2],
        instance.mnemonic
      );
      await instance.registerPushAccount();

      dispatch({ type: "INITIALIZE_WALLET", payload: instance });

      console.info("Wallet created and mnemonic split into shares", { userId });
    } catch (err) {
      console.error("Error creating wallet:", err);
      // TODO: handle the error logic when the user asked for creating a new wallet but then api fails
      setError("Failed to create wallet. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reconstructWallet = async (share1: string, share2: string) => {
    try {
      setLoading(true);
      const mnemonicHex = secrets.combine([share1, share2]);
      const mnemonic = Buffer.from(mnemonicHex, "hex").toString();
      const instance = await PushWallet.logInWithMnemonic(
        mnemonic,
        import.meta.env.VITE_APP_ENV as ENV
      );

      dispatch({ type: "INITIALIZE_WALLET", payload: instance });

      console.info("Wallet reconstructed successfully");
    } catch (err) {
      console.error("Error reconstructing wallet:", err);
      // TODO: Here we will give user an option to either recreate or move back to auth page
      setError("Failed to reconstruct wallet. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (token: string) => {
    try {
      setLoading(true);
      const response = await api.get("/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userId = response.data.id;
      dispatch({ type: "SET_USER", payload: response.data });
      dispatch({ type: "SET_AUTHENTICATED", payload: true });

      if (!state.wallet) {
        try {
          let share1, share2, share3;

          // Try share1 + share2 combination first
          try {
            const mnemonicShareResponse = await api.get(
              `/mnemonic-share/${userId}`
            );
            share1 = mnemonicShareResponse.data.share;
            share2 = localStorage.getItem(`mnemonicShare2:${userId}`);

            if (share1 && share2) {
              console.info("Reconstructing wallet with share1 and share2", {
                userId,
              });
              await reconstructWallet(share1, share2);
              return;
            }
          } catch (error) {
            // TODO: Handle this case properly
            console.debug("Share1 not available", {
              userId,
              error: (error as Error).message,
            });
          }

          // Try combinations with share3 if needed
          if (!share1 || !share2) {
            try {
              share3 = await PushWallet.retrieveMnemonicShareFromTx(
                import.meta.env.VITE_APP_ENV as ENV,
                userId
              );

              if (share1 && share3) {
                console.info("Reconstructing wallet with share1 and share3", {
                  userId,
                });
                await reconstructWallet(share1, share3);
                return;
              }

              if (share2 && share3) {
                console.info("Reconstructing wallet with share2 and share3", {
                  userId,
                });
                await reconstructWallet(share2, share3);
                return;
              }
            } catch (error) {
              // TODO: Handle this case properly
              console.debug("Share3 not available", {
                userId,
                error: (error as Error).message,
              });
            }
          }

          const hasAnyShare = share1 || share2 || share3;
          // TODO: Error case when only one share is available and user needs to decide either create a new wallet or not
          if (hasAnyShare) {
            const shouldCreate = window.confirm(
              "Unable to reconstruct your existing wallet. Would you like to create a new one? " +
                "Warning: This will make your old wallet inaccessible."
            );
            if (!shouldCreate) {
              setError("Wallet reconstruction failed. Please try again later.");

              navigate(APP_ROUTES.AUTH);
              return;
            }
          }

          console.info("Creating new wallet", {
            userId,
            availableShares: {
              share1: !!share1,
              share2: !!share2,
              share3: !!share3,
            },
          });

          // If no share is present then it will directly create a new wallet
          await createWalletAndGenerateMnemonic(userId);
        } catch (error) {
          // TODO: Handle this case properly
          console.error("Error during wallet reconstruction/creation", {
            userId,
            error: (error as Error).message,
          });
          throw error;
        }
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to fetch user profile. Please try again.");

      navigate(APP_ROUTES.AUTH);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        setLoading(true);

        if (state.jwt) {
          await fetchUserProfile(state.jwt);
        } else if (primaryWallet) {
          let pushWallet;
          const signer = await PushSigner.initialize(primaryWallet, "DYNAMIC");

          pushWallet = await PushWallet.loginWithWallet(
            signer,
            config.APP_ENV as ENV
          );

          if (pushWallet)
            dispatch({ type: "INITIALIZE_WALLET", payload: pushWallet });
          else {
            console.log(
              "Could not find user in wallet.tsx file after push wallet"
            );
          }
        } else {
          navigate(APP_ROUTES.AUTH);
        }
      } catch (err) {
        console.error("Error initializing profile:", err);
        setError("Failed to initialize profile");
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryWallet]);

  useEffect(() => {
    if (state?.wallet?.attachedAccounts.length)
      setSelectedWallet(getWalletlist(state?.wallet?.attachedAccounts)[0]);
  }, [state?.wallet?.attachedAccounts]);

  const showAppConnectionContainer = state?.wallet?.appConnections.some(
    (cx) => cx.isPending === true
  );

  return (
    <ContentLayout>
      <BoxLayout>
        <Box
          flexDirection="column"
          display="flex"
          width="376px"
          padding="spacing-md"
          gap="spacing-sm"
          position="relative"
        >
          {createAccountLoading && (
            <LoadingPage
              isLoading={createAccountLoading}
              title={"Creating Push Wallet"}
            />
          )}

          {showAppConnectionContainer && (
            <AppConnections
              selectedWallet={selectedWallet}
              appConnection={
                state.wallet.appConnections[
                  state.wallet.appConnections.length - 1
                ]
              }
            />
          )}
          <WalletProfile selectedWallet={selectedWallet} isLoading={loading} />
          <WalletTabs
            walletList={getWalletlist(state?.wallet?.attachedAccounts)}
            selectedWallet={selectedWallet}
            setSelectedWallet={setSelectedWallet}
            isLoading={loading}
          />
          {!state?.wallet && primaryWallet && (
            <CreateAccount
              isLoading={createAccountLoading}
              setIsLoading={setCreateAccountLoading}
            />
          )}
        </Box>
      </BoxLayout>
    </ContentLayout>
  );
};

export { Wallet };
