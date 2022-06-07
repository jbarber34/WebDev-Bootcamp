import { useState } from "react";

function Login(props) {

    const [isMousedOver, setMouseOver] = useState(false);

    return (
        <div className="form-login">
            <h1>Please Log In</h1>
            <form className="loginForm">
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                {!props.registered && <input type="password" placeholder="Confirm Password" />}
                <button
                    style={{ backgroundColor: isMousedOver ? "black" : "white" }}
                    onMouseOver={() => { setMouseOver(true) }}
                    onMouseOut={() => { setMouseOver(false) }}
                    className="loginButton"
                    onClick={props.loggedIn}
                    type="submit">{props.registered ? "Login" : "Register"}</button>
            </form>
        </div>

    );
}

export default Login;