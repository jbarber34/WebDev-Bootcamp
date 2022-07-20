import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { canisterId, drizzo } from "../../../declarations/drizzo/index";
import { Principal } from "@dfinity/principal";
import { drizzo } from "../../../declarations/drizzo";
import Button from "./Button";

function Item(props) {

  // Create name, owner, and image to be used for NFT below
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();

  // Grab NFT id from prop
  const id = props.id;

  // Access the canister using HTTP command to fetch the canister on the blockchain (or local host)
  const localHost = "http://localhost:8080/";
  // Create http agent with JS initializers
  const agent = new HttpAgent({ host: localHost });
  // TODO: When deploying live, remove the next line of code
  // Fetch root key when operating locally
  agent.fetchRootKey();
  // Create NFTActor variable to be used later in loadNFT() function
  let NFTActor;

  // Use the agent to fetch the name, owner, and image
  async function loadNFT() {
    NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });

    // Grab pieces of data we want from nft canister
    // Get NFT name
    const name = await NFTActor.getName();
    setName(name);
    // Get NFT owner
    const owner = await NFTActor.getOwner();
    setOwner(owner.toText());
    // Get NFT image
    const imageData = await NFTActor.getAsset();
    const imageContent = new Uint8Array(imageData); // Convernt into correct format
    const image = URL.createObjectURL(new Blob([imageContent.buffer], { type: "image/png" })); // Turn image into actual URL
    setImage(image);
    // Set Button from Button.jsx
    setButton(<Button handleClick={handleSell} text={"Sell"} />);
  };

  // Set up so the above function only called the first time this is rendered
  useEffect(() => {
    loadNFT();
  }, [])

  // Set up handle function for setting price an NFT
  let price;
  function handleSell() {
    setPriceInput(<input
      placeholder="Price in LOKI"
      type="number"
      className="price-input"
      value={price}
      onChange={(e) => price = e.target.value}
    />
    );
    // Reset button text
    setButton(<Button handleClick={sellItem} text={"Confirm"} />);
  };

  // Create function to confirm sale of NFT
  async function sellItem() {
    // List item for sale
    const listingResult = await drizzo.listItem(props.id, Number(price));
    // If seller is confirmed, make the transfer of ownership of the NFT
    if (listingResult == "Success") {
      const dRizzoId = await drizzo.getDRizzoCanisterID();
      const transferResult = await NFTActor.transferOwnership(dRizzoId);
    };
  };

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"></span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
