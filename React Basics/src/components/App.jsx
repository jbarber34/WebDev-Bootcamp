import React from "react";
import contacts from "../contacts";
import Avatar from "./Avatar";
import createCard from "./CreateCard";

function App() {
  return (
    <div>
      <h1 className="heading">My Contacts</h1>

      <Avatar img="https://media-exp1.licdn.com/dms/image/C5603AQE1Fo7BKj-6bw/profile-displayphoto-shrink_800_800/0/1516904900067?e=1659571200&v=beta&t=8ggyF-4i4TB2IMY0PAPGc4KW5R8V1XZCcafzpgc56Ug" />

      {contacts.map(createCard)}

    </div>
  );
}

export default App;
