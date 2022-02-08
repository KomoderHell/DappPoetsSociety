import React, { useContext, useEffect, useState } from "react";
import { TransactionContext } from "../context/TransactionContext";
import logo from "./images/coin.png";

interface Props {
  poemId: number;
  poemString: string;
  poetAddress: string;
  earnedRewards: string;
}

const Poem = ({ poemId, poemString, poetAddress, earnedRewards }: Props) => {
  const { tipPoem } = useContext(TransactionContext);
  const [toTip, setToTip] = useState(0);

  useEffect(() => {
    console.log(String(toTip), poemString);
  }, [toTip]);

  const handleTip = async () => {
    if (toTip <= 0) {
      alert("You can only tip Positive amounts");
    } else {
      console.log("tipping poem ", poemId, toTip);
      tipPoem(poemId, toTip);
    }
  };

  return (
    <div className="single__poem">
      <span className="poet__address">Author: {poetAddress}</span>
      <span className="poem__string">{poemString}</span>
      <div className="tip__region">
        <div className="earned__rewards">
          Total Rewards Earned: {earnedRewards}
          <img className="coin__logo__small" src={logo} />
        </div>
        <input
          className="input__irshad"
          type="number"
          onChange={(e) => setToTip(Number(e.target.value))}
        ></input>
        <button className="button__tip" onClick={handleTip}>
          tip
        </button>
      </div>
    </div>
  );
};

export default Poem;
