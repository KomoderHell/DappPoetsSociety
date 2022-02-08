import React, { useContext, useEffect } from "react";
import { TransactionContext } from "../context/TransactionContext";
import Poem from "./Poem";

const PoemList = () => {
  const { getPoems, poems } = useContext(TransactionContext);

  return (
    <div className="poem__home">
      <button className="button__refresh" onClick={getPoems}>
        refresh
      </button>
      <div className="peom__list">
        {poems.map((poem: any, index: number) => (
          <Poem
            poemId={index}
            poemString={String(poem.poem)}
            poetAddress={String(poem.poetAddress)}
            earnedRewards={String(poem.earnedRewards)}
          />
        ))}
      </div>
    </div>
  );
};

export default PoemList;
