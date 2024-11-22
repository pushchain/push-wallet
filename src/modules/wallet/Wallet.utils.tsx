export const getWalletlist = (attachedAccounts:string[]) => {
    const walletList = [];
    if (attachedAccounts?.length) {
       attachedAccounts?.forEach((account,index) => {
        let walletObj = {};
        if (account.includes("push")) {
          walletObj = {
            name: "Push Account",
            address: account,
            fullAddress:account,
            isSelected: false,
            type: "push",
          };
        } else {
          walletObj = {
            name:`Account ${index+1}`,
            address: account.split(':')[2],
            fullAddress:account,
            isSelected: false,
            //TODO:change the type as per backend later
            type: "metamask",
          };
        }
        walletList.push(walletObj);
      });
    }
    walletList.reverse();
    return walletList; // Return the wallet list instead of null
  };