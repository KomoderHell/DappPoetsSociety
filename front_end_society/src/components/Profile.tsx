import React, { useState, useContext, useEffect } from "react";
import {
  TransactionContext,
  TransactionProvider,
} from "../context/TransactionContext";
import coin from "./images/coin.png";
const Profile = () => {
  const { poetInfo } = useContext(TransactionContext);

  var account = poetInfo.account;
  var rewards = poetInfo.totalRewardEarned;
  var poems = poetInfo.poems;
  useEffect(() => {
    account = poetInfo.account;
    rewards = poetInfo.totalRewardEarned;
    poems = poetInfo.poems;
  }, [poetInfo]);

  return (
    <div className="profile">
      <div className="name__name">
        <div>Account:</div>
        <div>{account}</div>
      </div>
      <div className="name__name">
        <div>No of Poems: </div>
        <div>{poems} </div>
      </div>
      <div className="name__name">
        <div>
          <div>Rewards: </div>
          {rewards}
          <img className="coin__logo__big" src={coin} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
