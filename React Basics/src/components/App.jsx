import renderConditional from "./RenderConditional";

var isLoggedIn = false;
var userIsRegistered = false;


function App() {
  return (
    renderConditional(isLoggedIn, userIsRegistered)
  );
}

export default App;
