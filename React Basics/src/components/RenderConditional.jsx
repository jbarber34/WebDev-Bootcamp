import React from "react";
import contacts from "../contacts";
import Avatar from "./Avatar";
import createCard from "./CreateCard";

function renderConditional(isLoggedIn) {
    return isLoggedIn ? (
        <div>
            <h1 className="heading">My Contacts</h1>

            <Avatar img="https://cdn1.vectorstock.com/i/1000x1000/47/90/cartoon-programmer-writes-code-workspace-concept-vector-20874790.jpg" />

            {contacts.filter((contact) => {
                return contact.type === "personal";
            }).map((contact) => {
                return contact
            }).map(createCard)
            }

        </div>
    ) : (
        <div>
            <h1 className="form-login">Please Log In</h1>
            <form className="form">
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </div>

    );
}

export default renderConditional;