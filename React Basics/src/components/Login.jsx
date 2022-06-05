import LoginInput from "./LoginInput";

function Login(props) {
    return (
        <div className="form-login">
            <h1>Please Log In</h1>
            <form className="form">
                <LoginInput type="text" placeholder="Username" />
                <LoginInput type="password" placeholder="Password" />
                {!props.registered && <LoginInput type="password" placeholder="Confirm Password" />}
                <button type="submit">{props.registered ? "Login" : "Register"}</button>
            </form>
        </div>

    );
}

export default Login;