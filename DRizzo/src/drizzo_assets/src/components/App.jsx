import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import Item from "./Item";
import Minter from "./Minter";

function App() {

  // Set NFT ID to be sent in as prop
  // const NFTID = "r7inp-6aaaa-aaaaa-aaabq-cai"

  return (
    <div className="App">
      <Header />
      {/* <Minter /> */}
      {/* <Item id={NFTID} /> */}
      <Footer />
    </div>
  );
}

export default App;
