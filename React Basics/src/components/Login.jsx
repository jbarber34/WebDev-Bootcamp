function Login(props) {
    return (
        <div className="form-login">
            <h1>Please Log In</h1>
            <form className="loginForm">
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                {!props.registered && <input type="password" placeholder="Confirm Password" />}
                <button className="loginButton" onClick={props.loggedIn} type="submit">{props.registered ? "Login" : "Register"}</button>
            </form>
        </div>

    );
}

export default Login;