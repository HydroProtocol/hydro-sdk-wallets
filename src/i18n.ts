export default {
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
  dialogTitle: "Hydro SDK Wallet",
  dialogSubtitle: "",
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
  currentWalletTypeNotSupported: "Current wallet type is not supported",
  noAvailableAddress: "No available address",
  pleaseSelectAddress: "Please select an address",
  selectPath: "Select Path",
  inputPath: "Load Path",
  installMetamask: "Install MetaMask",
  installMetamaskDesc:
    'MetaMask browser extension currently runs on Google Chrome, Firefox, Opera, and Brave browsers. For Safari users, please try other wallet options. Click <a target="_blank" rel="noopener noreferrer" href="https://support.ddex.io/hc/en-us/articles/115004408534">here</a> for MetaMask support.',
  connectHardwareWallet: {
    ledger: {
      title: "Connect Ledger",
      desc:
        'Ensure “Browser Support” and “Contract Data” is enabled within your device settings. <br/>Having issues still? Try reconnecting your Ledger or view Ledger Support.<a target="_blank" rel="noopener noreferrer" href="https://support.ddex.io/hc/en-us/articles/360001576533">Ledger Support</a>'
    },
    trezor: {
      title: "Connect Trezor",
      desc:
        'Having issues? Try reconnecting your Trezor or view Trezor Support.<a target="_blank" rel="noopener noreferrer" href="https://trezor.io/support/">Trezor Support</a>'
    }
  },
  connect: "Connect",
  disconnect: "Disconnect",
  walletDesc: {
    notConnect: {
      walletconnect: {
        title: "",
        desc: `Please use a mobile wallet that supports wallet connect to scan the qrcode. Supported apps include DDEX, Trust Wallet. If you have none of them installed, you can download the <a target="_blank" rel="noopener noreferrer" href="https://apps.apple.com/us/app/ddex-2-0-crypto-dex/id1455868174">DDEX 2.0 IOS</a > or <a target="_blank" rel="noopener noreferrer" href="https://play.google.com/store/apps/details?id=io.ddex.dwallet">DDEX 2.0 Android</a >.`
      },
      coinbase_wallet: {
        title: "",
        desc: `After clicking the Connect button, the qrcode window will pop up. Then scan it with Coinbase Wallet. If you have issues, please see the wallet link official <a target="_blank" rel="noopener noreferrer" href="https://github.com/walletlink/walletlink/wiki/Browser-Troubleshooting">trouble shooting</a > for more info.`
      },
      fortmatic: {
        title: "",
        desc:
          'Fortmatic is an SMS powered wallet. Click "Connect" below to create a new Fortmatic wallet or access your existing one.'
      }
    },
    connected: {
      walletconnect: {
        title: "",
        desc: `Please use a mobile wallet that supports wallet connect to scan the qrcode. Supported apps include DDEX, Trust Wallet. If you have none of them installed, you can download the <a target="_blank" rel="noopener noreferrer" href="https://apps.apple.com/us/app/ddex-2-0-crypto-dex/id1455868174">DDEX 2.0 IOS</a > or <a target="_blank" rel="noopener noreferrer" href="https://play.google.com/store/apps/details?id=io.ddex.dwallet">DDEX 2.0 Android</a >.`
      },
      coinbase_wallet: {
        title: "",
        desc: `After clicking the Connect button, the qrcode window will pop up. Then scan it with Coinbase Wallet. If you have issues, please see the wallet link official <a target="_blank" rel="noopener noreferrer" href="https://github.com/walletlink/walletlink/wiki/Browser-Troubleshooting">trouble shooting</a > for more info.`
      },
      fortmatic: {
        title: "",
        desc:
          'To add funds to your Fortmatic wallet, copy the public wallet address shown above and transfer funds from a different address.<br/>You can also fully manage your Fortmatic wallet through their website interface. Go to <a target="_blank" rel="noopener noreferrer" href="https://fortmatic.com">https://fortmatic.com</a> and click the "Account" button.'
      }
    }
  },
  loadAccounts: "Load Accounts",
  goToPage: "Go to page",
  extensionWallets: "Extension Wallets",
  usePhoneOrEmail: "Use Phone/Email",
  hardwareWallets: "Hardware Wallets",
  mobileWallets: "Mobile Wallets",
  oauth: "Google or Facebook OAuth",
  localWallets: "Local Wallets",
  poweredBy: "Powered by"
};
