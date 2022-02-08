import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import DappPoetsSociety from "../chain-info/contracts/DappPoetsSociety.json";
import IrshadToken from "../chain-info/contracts/IrshadToken.json";
import networkMapping from "../chain-info/deployments/map.json";
import Web3 from "web3";

const defaultValue: any = null;

export const TransactionContext = React.createContext(defaultValue);

// declare var window: any;

const ethereum = (window as any).ethereum;
const provider = new ethers.providers.Web3Provider(ethereum);

const getEthereumContract = () => {
  const signer = provider.getSigner();
  const { abi } = DappPoetsSociety;
  const dappPoetsSocietyAddress = networkMapping["4"]["DappPoetsSociety"][0];
  const dappPoetsSocietyContract = new ethers.Contract(
    dappPoetsSocietyAddress,
    abi,
    signer
  );

  return dappPoetsSocietyContract;
};

export const TransactionProvider = ({ children }: any) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);
  const [poems, setPoems] = useState([]);

  const [poetInfo, setPoetInfo] = useState({
    account: "",
    totalRewardEarned: 0,
    poems: 0,
  });

  const checkIfWalletIsConnected = async () => {
    if (!ethereum) return alert("Please install metamask");

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length >= 0) {
      setCurrentAccount(accounts[0]);
      console.log(accounts[0]);
      console.log(currentAccount);
      getPoems();
      checkIfAlreadyUser();
    } else {
      console.log("no accounts found");
    }

    console.log(ethereum && ethereum.isMetaMask);
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      console.log("calling for account details");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts);
      console.log("account connected");
      setCurrentAccount(accounts[0]);
      checkIfAlreadyUser();
      getPoems();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object.");
    }
  };

  const registerUser = async () => {
    const dappPoetsSocietyContract = getEthereumContract();
    console.log("registering now");
    const transactionRegister = await dappPoetsSocietyContract.register(
      currentAccount
    );

    await transactionRegister.wait();
    console.log("registered");
    getPoetInfo();
  };

  const createPoem = async (poemString: string) => {
    const dappPoetsSocietyContract = getEthereumContract();
    const transactionCreatePost = await dappPoetsSocietyContract.createPost(
      poemString
    );
    await transactionCreatePost.wait();

    console.log("poem created");
    getPoems();
    getPoetInfo();
  };

  const checkIfAlreadyUser = async () => {
    const accounts = await ethereum.request({ method: "eth_accounts" });

    const dappPoetsSocietyContract = getEthereumContract();
    const checkIfAlreadyUserTransaction =
      dappPoetsSocietyContract.checkIfAlreadyUser(accounts[0]);

    checkIfAlreadyUserTransaction.then(function (result: any) {
      if (result === true) {
        getPoetInfo();
      }
    });
  };

  const getPoetInfo = async () => {
    const accounts = await ethereum.request({ method: "eth_accounts" });

    const dappPoetsSocietyContract = getEthereumContract();
    const currentPoet = await dappPoetsSocietyContract.getPoetInfo(accounts[0]);
    const structuredPoet = {
      account: String(currentPoet.account),
      totalRewardEarned: Number(currentPoet.totalRewardEarned),
      poems: Number(currentPoet.poems),
    };
    setPoetInfo(structuredPoet);
    setLoginStatus(true);
  };

  const getPoems = async () => {
    console.log("calling for poems");

    const dappPoetsSocietyContract = getEthereumContract();

    const availablePoems = dappPoetsSocietyContract.getPoems();

    // const structuredPoems = availablePoems.map((poem: any) => ({
    //   poem: poem.poem,
    //   poetAddress: poem.poetAddress,
    //   earnedRewards: poem.earnedRewards,
    // }));

    availablePoems.then(function (result: any) {
      setPoems(result);
    });
  };

  const tipPoem = async (poemIndex: number, tipAmount: number) => {
    const signer = provider.getSigner();
    const { abi } = IrshadToken;
    const irshadTokenAddress = networkMapping["4"]["IrshadToken"][0];
    const irshadTokenContract = new ethers.Contract(
      irshadTokenAddress,
      abi,
      signer
    );

    const parsedAmount = ethers.utils.parseEther(String(tipAmount));

    const dappPoetsSocietyContract = getEthereumContract();

    const approveTransaction = await irshadTokenContract.approve(
      dappPoetsSocietyContract.address,
      parsedAmount
    );
    await approveTransaction.wait();

    console.log("approved");

    const tipPoemTransaction = await dappPoetsSocietyContract.tipPoem(
      poemIndex,
      tipAmount
    );
    await tipPoemTransaction.wait();

    console.log(tipPoemTransaction);

    getPoems();
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        registerUser,
        poetInfo,
        loginStatus,
        createPoem,
        poems,
        tipPoem,
        getPoems,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
