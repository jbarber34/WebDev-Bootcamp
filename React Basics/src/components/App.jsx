import renderConditional from "./RenderConditional";

var isLoggedIn = true;

function App() {
  return (
    renderConditional(isLoggedIn)
  );
}

export default App;
