export const getWalletlist = (pushWallet) => {
  console.debug(pushWallet,'wallet')
    const walletList = [];
    if (pushWallet) {
      Object.keys(pushWallet?.walletToEncDerivedKey || {}).forEach((wallet) => {
        let walletObj = {};
        if (wallet.includes("push")) {
          walletObj = {
            name: "Push Account",
            address: pushWallet?.signerAccount?.split(":")?.[2],
            isSelected: false,
            type: "push",
          };
        } else {
          walletObj = {
            name: "Metamask",
            address: wallet.split(":")[2],
            isSelected: false,
            type: "metamask",
          };
        }
        walletList.push(walletObj);
      });
    }
    return walletList; // Return the wallet list instead of null
  };