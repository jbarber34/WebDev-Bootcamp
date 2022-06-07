import { useState } from "react";
import contacts from "../contacts";
import Avatar from "./Avatar";
import createCard from "./CreateCard";

function Main(props) {

    const [isMousedOver, setMouseOver] = useState(false);

    return (
        <div>
            <h1 className="heading">My Contacts</h1>

            <Avatar img="https://cdn1.vectorstock.com/i/1000x1000/47/90/cartoon-programmer-writes-code-workspace-concept-vector-20874790.jpg" />

            {contacts.filter((contact) => {
                return contact.type === "personal";
            }).map((contact) => {
                return contact
            }).map(createCard)
            }
            <form>
                <button
                    style={{ backgroundColor: isMousedOver ? "black" : "#00cec9" }}
                    onMouseOver={() => { setMouseOver(true) }}
                    onMouseOut={() => { setMouseOver(false) }}
                    className="mainButton"
                    onClick={props.loggedIn}
                    type="submit">Logout</button>
            </form>

        </div>
    );
}

export default Main