import { FC, useEffect, useState } from "react";
import { Box, Info } from "../../blocks";
import {
  BoxLayout,
  ContentLayout,
  PushWalletLoadingContent,
  WalletSkeletonScreen,
  WalletReconstructionErrorContent,
  DrawerWrapper,
  LoadingContent,
  ErrorContent,
  getAppParamValue,
} from "../../common";
import { WalletProfile } from "./components/WalletProfile";
import { WalletTabs } from "./components/WalletTabs";
import api from "../../services/api";
import { PushWallet } from "../../services/pushWallet/pushWallet";
import { APP_ROUTES, ENV } from "../../constants";
import secrets from "secrets.js-grempe";
import { useGlobalState } from "../../context/GlobalContext";
// import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { getWalletlist } from "./Wallet.utils";
import { WalletListType } from "./Wallet.types";
import { PushWalletAppConnection } from "../../common";
import { useLocation, useNavigate } from "react-router-dom";
import { usePersistedQuery } from "../../common/hooks/usePersistedQuery";
import { ConnectionSuccess } from "../../common/components/ConnectionSuccess";
import { CreateNewWallet } from "../../common/components/CreateNewWallet";
import { bytesToHex, stringToBytes } from "viem";

const Wallet: FC = () => {
  const { state, dispatch } = useGlobalState();
  const [createAccountLoading, setCreateAccountLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const externalOrigin = params.get("app");
  // const { primaryWallet } = useDynamicContext();
  const [showConnectionSuccess, setConnectionSuccess] =
    useState<boolean>(false);

  const [showCreateNewWalletModal, setShowCreateNewWalletModal] =
    useState(false);

  const [showReconstructionErrorModal, setShowReconstructionErrorModal] = useState(false);

  // TODO: This needs to go to a top level context
  const [selectedWallet, setSelectedWallet] = useState<WalletListType>();

  const navigate = useNavigate();
  const persistQuery = usePersistedQuery();

  const createWalletAndGenerateMnemonic = async (userId: string) => {
    try {
      setCreateAccountLoading(true);
      const instance = await PushWallet.signUp(
        import.meta.env.VITE_APP_ENV as ENV
      );

      const mnemonicHex = bytesToHex(stringToBytes(instance.mnemonic)).replace(/^0x/, "");
      console.log("mnemonic Hex", mnemonicHex);

      const shares = secrets.share(mnemonicHex, 3, 2);

      // First create the passkeys for storing shard 3
      await instance.storeMnemonicShareAsEncryptedTx(
        userId,
        shares[2],
      );

      await api.post(`/mnemonic-share`, { share: shares[0], type: 'TYPE1' });

      // Store shard in localstorage
      localStorage.setItem(`mnemonicShare2:${userId}`, shares[1]);

      dispatch({ type: "INITIALIZE_WALLET", payload: instance });
    } catch (err) {
      console.error("Error creating wallet:", err);
      throw err;
    } finally {
      setCreateAccountLoading(false);
    }
  };

  const reconstructWallet = async (share1: string, share2: string) => {
    try {
      setCreateAccountLoading(true);
      const mnemonicHex = secrets.combine([share1, share2]);
      const bytes = new Uint8Array(mnemonicHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
      const mnemonic = new TextDecoder().decode(bytes);

      const instance = await PushWallet.logInWithMnemonic(
        mnemonic,
        import.meta.env.VITE_APP_ENV as ENV
      );

      dispatch({ type: "INITIALIZE_WALLET", payload: instance });
    } catch (err) {
      console.error("Error reconstructing wallet:", err);
      setError("Failed to reconstruct wallet. Please try again.");
      throw err;
    } finally {
      setCreateAccountLoading(false);
    }
  };

  const fetchUserProfile = async (token: string) => {
    try {
      setCreateAccountLoading(true);
      const response = await api.get("/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userId = response.data.id;
      dispatch({ type: "SET_USER", payload: response.data });
      dispatch({ type: "SET_AUTHENTICATED", payload: true });

      if (!state.wallet) {
        let share3, share1

        const share2 = localStorage.getItem(`mnemonicShare2:${userId}`);

        try {
          const mnemonicShareResponse = await api.get(
            `/mnemonic-share`);

          const sharesArray = mnemonicShareResponse.data

          if (!sharesArray.length) {
            throw new Error('No shares Found')
          }

          share1 = sharesArray.find((share) => share.type === "TYPE1").share;

          if (share1 && share2) {
            await reconstructWallet(share1, share2);
            return;
          }

          // Find share3 if only single share is present
          if (!share1 || !share2) {
            try {
              share3 = sharesArray.find((share) => share.type === 'TYPE2').share;

              share3 = await PushWallet.retrieveMnemonicShareFromTx(
                import.meta.env.VITE_APP_ENV as ENV,
                userId,
                share3
              );

              if (share1 && share3) {
                await reconstructWallet(share1, share3);
                return;
              }

              if (share2 && share3) {
                await reconstructWallet(share2, share3);
                return;
              }
            } catch (error) {
              console.debug("Share3 not available", {
                userId,
                error: (error as Error).message,
              });
            }
          }


        } catch (error) {
          console.debug("Share1 not available", {
            userId,
            error: (error as Error).message,
          });
        }

        // Only single or no share is found directly ask user if they want to create a new wallet or go back
        const hasAnyShare = share1 || share2 || share3;

        if (hasAnyShare) {
          setShowReconstructionErrorModal(true);
          return;
        } else {
          // User has no share as them to create a new wallet.
          setShowCreateNewWalletModal(true);
        }

      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to fetch user profile. Please try again.");
      handleResetAndRedirectUser();
      throw err;
    } finally {
      setCreateAccountLoading(false);
    }
  };



  useEffect(() => {
    const initializeProfile = async () => {
      try {
        if (state.jwt) {
          setCreateAccountLoading(true);

          await fetchUserProfile(state.jwt);
        }
        // else if (!primaryWallet) {
        //   navigate(APP_ROUTES.AUTH);
        // }

        /* We don't need to fetch push user as of now when user continues with wallet
         This function fetches the already created push wallet */

        // let pushWallet;
        // const signer = await PushSigner.initialize(primaryWallet, "DYNAMIC");

        // pushWallet = await PushWallet.loginWithWallet(
        //   signer,
        //   config.APP_ENV as ENV
        // );

        // if (pushWallet)
        //   dispatch({ type: "INITIALIZE_WALLET", payload: pushWallet });
        // else {
        //   console.log(
        //     "Could not find user in wallet.tsx file after push wallet"
        //   );
        // }
      } catch (err) {
        console.error("Error initializing profile:", err);
        setError("Failed to initialize profile");
        handleResetAndRedirectUser();
      } finally {
        setCreateAccountLoading(false);
      }
    };

    initializeProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateNewWallet = async () => {
    try {
      await createWalletAndGenerateMnemonic(state.user.id);
    } catch (error) {
      handleResetAndRedirectUser();
    } finally {
      setShowCreateNewWalletModal(false);
      setShowReconstructionErrorModal(false);
    }
  };

  const handleResetAndRedirectUser = () => {
    sessionStorage.removeItem("jwt");
    dispatch({ type: "RESET_WALLET" });
    localStorage.removeItem('appConnections');
    const url = persistQuery(APP_ROUTES.AUTH);
    navigate(url);
  };

  useEffect(() => {
    if (state?.wallet?.universalSigner.account.address)
      setSelectedWallet(
        getWalletlist(state.wallet)[0]
      );
  }, [state?.wallet?.universalSigner]);

  useEffect(() => {
    if (
      externalOrigin &&
      state.externalWallet &&
      state.externalWalletAppConnectionStatus === "connected"
    )
      setConnectionSuccess(true);
  }, [externalOrigin, state?.externalWalletAppConnectionStatus, state.externalWallet]);

  if (createAccountLoading)
    return (
      <WalletSkeletonScreen content={<PushWalletLoadingContent />} />
      // <Button onClick={async () => {
      //   await fetchUserProfile(state.jwt);
      // }}>Create passkey</Button>
    );

  if (showReconstructionErrorModal)
    return (
      <WalletSkeletonScreen
        content={
          <WalletReconstructionErrorContent
            onSuccess={handleCreateNewWallet}
            onError={handleResetAndRedirectUser}
          />
        }
      />
    );

  if (showCreateNewWalletModal)
    return (
      <WalletSkeletonScreen
        content={
          <CreateNewWallet
            onSuccess={handleCreateNewWallet}
          />
        }
      />
    );

  return (
    <ContentLayout>
      <BoxLayout>
        <Box
          flexDirection="column"
          display="flex"
          width={{ initial: "376px", ml: "100%" }}
          padding="spacing-md"
          gap="spacing-sm"
          position="relative"
        >
          <PushWalletAppConnection selectedWallet={selectedWallet} />
          <WalletProfile selectedWallet={selectedWallet} />
          <WalletTabs
            walletList={getWalletlist(
              state.wallet
            )}
            selectedWallet={selectedWallet}
            setSelectedWallet={setSelectedWallet}
          />
          {/* {!state?.wallet && primaryWallet && (
            <CreateAccount
              isLoading={createAccountLoading}
              setIsLoading={setCreateAccountLoading}
            />
          )} */}
          {state.messageSignState === "loading" && (
            <DrawerWrapper>
              <LoadingContent
                title={"Processing Transaction"}
                subTitle={"Your transaction is being verified"}
              />
            </DrawerWrapper>
          )}

          {state.messageSignState === "rejected" && (
            <DrawerWrapper>
              <ErrorContent
                icon={<Info size={32} color="pw-int-error-primary-subtle-color" />}
                title="Could not verify"
                subTitle="Please try again"
                onClose={() =>
                  dispatch({ type: "SET_MESSAGE_SIGN_STATE", payload: "idle" })
                }
              />
            </DrawerWrapper>
          )}
          {showConnectionSuccess && getAppParamValue() && (
            <DrawerWrapper>
              <ConnectionSuccess
                onClose={() => {
                  setConnectionSuccess(false);
                }}
              />
            </DrawerWrapper>
          )}
        </Box>
      </BoxLayout>
    </ContentLayout>
  );
};

export { Wallet };
