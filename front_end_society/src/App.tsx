import React from "react";
import Header from "./components/Header";
import Profile from "./components/Profile";
import PoemList from "./components/PoemList";
import "./components/styles.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <Header></Header>
      <Profile></Profile>
      <PoemList></PoemList>
    </div>
  );
};

export default App;
