import LoginInput from "./LoginInput";

function Login() {
    return (
        <div className="form-login">
            <h1>Please Log In</h1>
            <form className="form">
                <LoginInput type="text" placeholder="Username" />
                <LoginInput type="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </div>

    );
}

export default Login;