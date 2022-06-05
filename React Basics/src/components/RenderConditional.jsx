import Login from "./Login";
import Main from "./Main"

function RenderConditional(isLoggedIn, userIsRegistered) {
    return isLoggedIn ? <Main /> : <Login registered={userIsRegistered} />
}

export default RenderConditional;