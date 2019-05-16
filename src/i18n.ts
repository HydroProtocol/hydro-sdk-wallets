export let translations = {
  addFundsDesc:
    "There are multiple ways to add funds to your browser wallet. If you already have Ethereum or Wrapped Ethereum, simply transfer to your Hydro wallet's public address. If you do not already have Ethereum, you can purchase some from a variety of platforms. We've linked a few for your convenience.",
  done: "Done",
  recoveryPhrase: "Recovery Phrase",
  testingDesc:
    "Please enter the correct words into the fields below to verify that you have recorded your recovery phrase.",
  backupDesc:
    "If you ever lose your computer, forget your password, change browsers or clear browsing data, you will need this recovery phrase to recover your wallet. Additionally, this phrase can be used to export your wallet to other applications. We recommend writing this down in multiple locations. DO NOT lose this recovery phrase: without it you could completely lose access to your wallet and funds.",
  next: "Next",
  confirmDesc: "Please read and confirm the important terms above on using your browser wallet.",
  create: "Create",
  createConfirm: [
    "I understand that my funds are held securely on this browser and not by Hydro Wallet.",
    "I will make sure to back up this wallet's Password in combination with its Recovery Phrase.",
    "I understand that if I cleared my browsing data (browsing history, cookies, cached images and files, etc.), my local wallet would be deleted.",
    "I understand that if I delete my browser wallet, I will have to import my wallet using this wallet's Recovery Phrase to recover wallet."
  ],
  password: "Password",
  confirm: "Confirm",
  confirmErrorMsg: "Confirmation must match",
  createDesc:
    "Once you click the Next button you will be taken through the wallet creation process. ***Please complete all three steps, or your wallet will NOT be created.***",
  title: "Hydro SDK Wallet",
  subtitle: "",
  selectWallet: "Select Wallet",
  close: "Close",
  unlock: "Unlock",
  headsUp: "headsUp",
  deleteTip:
    "Before you proceed, please make sure you have backed up your wallet. If you haven’t, you will permanently lose access to this wallet and all funds within it. Once you click Delete, the deletion will occur.",
  deleteConfirm: "I understand that I will lose all my assets in my wallet if I haven’t backed up this wallet.",
  delete: "Delete",
  createWallet: "Create Wallet",
  importWallet: "Import Wallet",
  deleteWallet: "Delete Wallet",
  selectAddress: "Select Address",
  toggleButtonText: "Please Click to Select A Wallet",
  connectToLedger: "Connect to Ledger",
  currentWalletTypeNotSupported: "Current wallet type is not supported",
  noAvailableAddress: "No available address",
  pleaseSelectAddress: "Please select an address",
  selectPath: "Select Path",
  inputPath: "Input a path"
};

export const setTranslations = (translations: { [key: string]: string }) => {
  translations = translations;
};
