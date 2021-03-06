import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import NFTActorClass "../nft/nft";
import HashMap "mo:base/HashMap";
import List "mo:base/List";

actor DRizzo {

    // Set up data storage - Map of NFTs and Owners
    var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
    var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);

    // Connect backend to frontend
    public shared(msg) func mint(imgData: [Nat8], name: Text) : async Principal {
        let owner : Principal = msg.caller;
        
        // Allocate cycles for when this is pushed to the internet computer
        // Cycles.add(100_500_000_000); // Only use if on internet computer
        
        // Initialize new NFT
        let newNFT = await NFTActorClass.NFT(name, owner, imgData);
        // Get Principal ID for the container
        let newNFTPrincipal = await newNFT.getCanisterId();

        // Add to NFT hash each time
        mapOfNFTs.put(newNFTPrincipal, newNFT);
        addToOwnershipMap(owner, newNFTPrincipal);

        return newNFTPrincipal
    };

    // Create private function to add owners to a list of all owners
    private func addToOwnershipMap(owner: Principal, nftId: Principal){
        // Get ahold of the NFTs the user owns
        var ownedNFTs : List.List<Principal> = switch (mapOfOwners.get(owner)) {
            case null List.nil<Principal>();
            case (?result) result;
        };

        // Push newly minted NFT to the list
        ownedNFTs := List.push(nftId, ownedNFTs);
        mapOfOwners.put(owner, ownedNFTs);
    };

    // Create method to bring this backend info to the front end
    public query func getOwnedNFTs(user:Principal) : async [Principal] {
        var userNFTs : List.List<Principal> = switch (mapOfOwners.get(user)){
            case null List.nil<Principal>();
            case (?result) result;
        };

        return List.toArray(userNFTs);
    };

};
