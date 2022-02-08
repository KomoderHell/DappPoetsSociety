import React, { useState, useContext } from "react";
import "./styles.css";
import logo from "./images/logo.png";
import networkMapping from "../chain-info/deployments/map.json";
import { ethers } from "ethers";
import DappPoetsSociety from "../chain-info/contracts/DappPoetsSociety.json";
import {
  TransactionContext,
  TransactionProvider,
} from "../context/TransactionContext";

declare var window: any;

const Header: React.FC = () => {
  const {
    connectWallet,
    currentAccount,
    registerUser,
    loginStatus,
    createPoem,
  } = useContext(TransactionContext);
  const handleLogin = async () => {
    connectWallet();
  };

  const [createPostMode, setCreatePostMode] = useState(false);
  const [createPoemPoem, setCreatePoemPoem] = useState("");
  const handleRegister = async () => {
    registerUser();
  };
  const handleCreatePost = () => {
    setCreatePostMode(true);
    console.log("post to be create!!");
  };
  const createPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(createPoemPoem);
    createPoem(createPoemPoem);
    setCreatePoemPoem("");
    setCreatePostMode(false);
  };
  return (
    <div>
      <div className="header">
        <div className="logo">
          <img className="logo__image" src={logo} />
        </div>
        <div className="title">Dapp Poet's Society</div>
        <div>
          {currentAccount ? (
            loginStatus ? (
              <button className="button__login" onClick={handleCreatePost}>
                write
              </button>
            ) : (
              <button className="button__login" onClick={handleRegister}>
                Register
              </button>
            )
          ) : (
            <button className="button__login" onClick={handleLogin}>
              Connect
            </button>
          )}
        </div>
      </div>
      <div
        className={createPostMode ? "create__post" : "create__post__invisible"}
      >
        <form onSubmit={(e) => createPost(e)}>
          <input
            className="create__post__input"
            type="text"
            onChange={(e) => setCreatePoemPoem(e.target.value)}
          />
          <button className="create__post__button" type="submit">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default Header;
