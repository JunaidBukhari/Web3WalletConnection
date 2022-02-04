import Web3 from "web3";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
//abi
import abi from "./abi.json";
//web3
const web3 = new Web3(window.ethereum);
//contract
const contractAddress = "0x92BFAE825A2e658CAfBd5aB151A5B2cf79F15D2f";
const connect = async () => {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
  } else {
    document.getElementById("message").style.opacity = 100;
    document.getElementById("message").innerHTML = "INSTALL METAMASK";
    setTimeout(() => {
      document.getElementById("message").style.opacity = 0;
    }, 1500);
    console.log("INSTALL METAMASK FIRST");
  }
};

const connectContract = () => {
  const smartContract = new web3.eth.Contract(abi, contractAddress);
  console.log(web3);
  const getWalletAddress = async () => {
    if (await window.ethereum.selectedAddress) {
      const WalletAddress = await web3.eth.getAccounts();
      const adminWallet = await smartContract.methods.wallet().call();
      const weiRaised = await smartContract.methods.weiRaised().call();
      let ethRaised = web3.utils.fromWei(weiRaised);
      console.log("ADMIN WALLET ==============>", adminWallet);
      console.log("Wei Raised ==============>", ethRaised + "  ETH");

      await smartContract.methods.buyTokens(WalletAddress[0]).send({
        from: WalletAddress[0],
        value: 10000000000,
      });
    }
  };
  getWalletAddress();
  console.log(smartContract);
};

function App() {
  return (
    <div className="App p-5">
      <button className="btn btn-primary" onClick={connect}>
        CONNECT WALLET
      </button>
      <br />
      <button className="btn btn-success mt-5" onClick={connectContract}>
        CONNECT Contract and Buy
      </button>

      <div
        className="m-5 alert alert-primary"
        id="message"
        role="alert"
        style={{ opacity: "0" }}
      ></div>
    </div>
  );
}

export default App;
