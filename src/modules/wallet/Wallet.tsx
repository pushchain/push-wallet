import { FC, useEffect, useState } from "react";
import { Box, Spinner } from "../../blocks";
import { BoxLayout, ContentLayout } from "../../common";
import { WalletProfile } from "./components/WalletProfile";
import { WalletTabs } from "./components/WalletTabs";
import api from "../../services/api";
import { PushWallet } from "../../services/pushWallet/pushWallet";
import { ENV } from "../../constants";
import secrets from "secrets.js-grempe";
import { useGlobalState } from "../../context/GlobalContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { CreateAccount } from "./components/CreateAccount";
import { getWalletlist } from "./Wallet.utils";
import { WalletListType } from "./Wallet.types";
import config from "../../config";
import { PushSigner } from "../../services/pushSigner/pushSigner";

export type WalletProps = {};

const Wallet: FC<WalletProps> = () => {
  const { state, dispatch } = useGlobalState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { primaryWallet } = useDynamicContext();
  const [pushWallet, setPushWallet] = useState<PushWallet | null>(null);
  const [attachedWallets, setAttachedWallets] = useState<string[]>([]);
  const walletList = getWalletlist(state?.wallet || null);
  const [selectedWallet, setSelectedWallet] = useState<WalletListType>(
    walletList[0]
  );
console.debug(walletList,state,'wwalletlist')
  const navigate = useNavigate();
  const location = useLocation();
  console.debug(state);
  // Function to extract state parameter from URL
  const extractStateFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get("state");
  };

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
      setPushWallet(instance);
      setAttachedWallets(Object.keys(instance.walletToEncDerivedKey));

      console.info("Wallet created and mnemonic split into shares", { userId });
    } catch (err) {
      console.error("Error creating wallet:", err);
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
      setPushWallet(instance);
      setAttachedWallets(Object.keys(instance.walletToEncDerivedKey));

      console.info("Wallet reconstructed successfully");
    } catch (err) {
      console.error("Error reconstructing wallet:", err);
      setError("Failed to reconstruct wallet. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchJwtUsingState = async (stateParam: string) => {
    try {
      setLoading(true);
      console.log("fetchJwtUsingState called with state:", stateParam);

      const response = await api.get("/auth/jwt", {
        params: { state: stateParam },
      });

      const { token } = response.data;
      if (!token) throw new Error("Token not found in response");

      dispatch({ type: "SET_JWT", payload: token });
      sessionStorage.setItem("jwt", token);

      await fetchUserProfile(token);
    } catch (err) {
      console.error("Error fetching JWT:", err);
      setError("Authentication failed. Please try logging in again.");
      navigate("/auth");
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
              console.debug("Share3 not available", {
                userId,
                error: (error as Error).message,
              });
            }
          }

          const hasAnyShare = share1 || share2 || share3;
          if (hasAnyShare) {
            const shouldCreate = window.confirm(
              "Unable to reconstruct your existing wallet. Would you like to create a new one? " +
                "Warning: This will make your old wallet inaccessible."
            );
            if (!shouldCreate) {
              setError("Wallet reconstruction failed. Please try again later.");
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

          await createWalletAndGenerateMnemonic(userId);
        } catch (error) {
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
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        setLoading(true);
        const stateParam = extractStateFromUrl();

        if (stateParam) {
          await fetchJwtUsingState(stateParam);

          // Clean up URL
          const url = new URL(window.location.href);
          url.searchParams.delete("state");
          window.history.replaceState({}, document.title, url.pathname);
        } else {
          const storedToken = sessionStorage.getItem("jwt");
          if (storedToken) {
            dispatch({ type: "SET_JWT", payload: storedToken });
            await fetchUserProfile(storedToken);
          } else {
            let pushWallet;
            const signer = await PushSigner.initialize(
              primaryWallet,
              "DYNAMIC"
            );
            pushWallet = await PushWallet.loginWithWallet(
              signer,
              config.APP_ENV as ENV
            );
            if (pushWallet)
              dispatch({ type: "INITIALIZE_WALLET", payload: pushWallet });
            else navigate("/auth");
          }
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
  }, []);
  console.debug(!state?.wallet && primaryWallet);
  return (
    <ContentLayout>
      <BoxLayout>
        {loading ? (
          <Spinner variant="primary" size="large" />
        ) : (
          <Box
            flexDirection="column"
            display="flex"
            width="376px"
            padding="spacing-md"
            gap="spacing-sm"
            position="relative"
          >
            <WalletProfile selectedWallet={selectedWallet} />
            <WalletTabs
              walletList={walletList}
              selectedWallet={selectedWallet}
              setSelectedWallet={setSelectedWallet}
            />
            {!state?.wallet && primaryWallet && <CreateAccount />}
          </Box>
        )}
      </BoxLayout>
    </ContentLayout>
  );
};

export { Wallet };
