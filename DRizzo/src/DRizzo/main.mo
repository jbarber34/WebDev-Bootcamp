import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import NFTActorClass "../nft/nft";

actor DRizzo {
    // Connect backend to frontend
    public shared(msg) func mint(imgData: [Nat8], name: Text) : async Principal {
        let owner : Principal = msg.caller;
        // Allocate cycles for when this is pushed to the internet computer
        // Cycles.add(100_500_000_000); // Only use if on internet computer
        // Initialize new NFT
        let newNFT = await NFTActorClass.NFT(name, owner, imgData);
        // Get Principal ID for the container
        let newNFTPrincipal = await newNFT.getCanisterId();

        return newNFTPrincipal
    }
};
