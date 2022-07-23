import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { canisterId, drizzo } from "../../../declarations/drizzo/index";
import { Principal } from "@dfinity/principal";
import { drizzo } from "../../../declarations/drizzo";
import Button from "./Button";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./PriceLabel";

function Item(props) {

  // Create name, owner, and image to be used for NFT below
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [blur, setBlur] = useState();
  const [sellStatus, setSellStatus] = useState("");
  const [priceLabel, setPriceLabel] = useState();

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

    // Conditional for either listed or owned page
    if (props.role == "collection") {

      // Track when NFT is listed and set owner and blue
      const nftIsListed = await drizzo.isListed(props.id);
      if (nftIsListed) {
        setOwner("DRizzo");
        setBlur({ filter: "blur(4px)" });
        setSellStatus("Listed");
      } else {
        // Set Button to handle the click and sell
        setButton(<Button handleClick={handleSell} text={"Sell"} />);
      }
    } else if (props.role == "discover") {
      // Check for original owner to ensure original owner can't buy what they just listed
      const originalOwner = await drizzo.getOriginalOwner(props.id);
      // Check if original owner is equal to the logged in user
      if (originalOwner.toText() != CURRENT_USER_ID.toText()) {
        // Set Button to handle the click and buy if original owner is NOT the current buyer
        setButton(<Button handleClick={handleBuy} text={"Buy"} />);
      }

      // Check price of NFT so we can list on the Discover page
      const price = await drizzo.getListedNFTPrice(props.id);
      setPriceLabel(<PriceLabel sellPrice={price.toString()} />);

    }
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
    // Blur image out when selling by adding css to styling
    setBlur({ filter: "blur(4px)" });
    // Show loader animation
    setLoaderHidden(false);
    // List item for sale
    const listingResult = await drizzo.listItem(props.id, Number(price));
    // If seller is confirmed, make the transfer of ownership of the NFT
    if (listingResult == "Success") {
      const dRizzoId = await drizzo.getDRizzoCanisterID();
      const transferResult = await NFTActor.transferOwnership(dRizzoId);
      // Hide loader again once transfer is a success
      if (transferResult == "Success") {
        setLoaderHidden(true);
        setButton();
        setPriceInput();
        setOwner("DRizzo");
        setSellStatus("Listed");
      };
    };
  };

  // Create function for buying NFT
  async function handleBuy() {

  };

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div hidden={loaderHidden} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}
            <span className="purple-text"> {sellStatus}</span>
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
