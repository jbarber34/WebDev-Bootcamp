import React, { useState } from "react";
import Login from "./Login";
import Main from "./Main"

function RenderConditional(userIsRegistered) {
    const [isLoggedIn, logIn] = useState(false);
    return isLoggedIn ? <Main loggedIn={() => logIn(isLoggedIn)} /> : <Login loggedIn={() => logIn(!isLoggedIn)} registered={userIsRegistered} />
}

export default RenderConditional;