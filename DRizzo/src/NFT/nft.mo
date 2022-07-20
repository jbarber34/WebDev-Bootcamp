import Debug "mo:base/Debug";
import Principal "mo:base/Principal";

// Add new actor class to programtically create actors
actor class NFT (name: Text, owner: Principal, content: [Nat8]) = this {

// Save inputs into variables
private let itemName = name;
private var nftOwner = owner;
private let imageBytes = content;

// Get ahold of captured information for each property
public query func getName() : async Text {
    return itemName;
};

public query func getOwner() : async Principal {
    return nftOwner;
};

public query func getAsset() : async [Nat8] {
    return imageBytes;
};

public query func getCanisterId() : async Principal {
    return Principal.fromActor(this);
};

public shared(msg) func transferOwnership(newOwner: Principal) : async Text {
    if (msg.caller == nftOwner){
        nftOwner := newOwner;
        return "Success";
    } else {
        return "Error: Not initiated by NFT Owner";
    }
};

};