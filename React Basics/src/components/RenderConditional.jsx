import Login from "./Login";
import Main from "./Main"

function RenderConditional(isLoggedIn) {
    return isLoggedIn ? <Main /> : <Login />
}

export default RenderConditional;