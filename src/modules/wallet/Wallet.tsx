import { FC, useEffect, useState } from "react";
import { Box } from "../../blocks";
import { BoxLayout, ContentLayout, PushWalletLoadingContent, SkeletonWalletScreen } from "../../common";
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

  useEffect(() => {
    if (state?.wallet?.attachedAccounts.length)
      setSelectedWallet(getWalletlist(state?.wallet?.attachedAccounts)[0]);
  }, [state?.wallet?.attachedAccounts]);

  const showAppConnectionContainer = state?.wallet?.appConnections.some(
    (cx) => cx.isPending === true
  );

  return createAccountLoading ? (
    <SkeletonWalletScreen loadingPopup={<PushWalletLoadingContent />} />
  ) : (
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
