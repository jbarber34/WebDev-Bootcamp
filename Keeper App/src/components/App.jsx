import Header from "./Header";
import Footer from "./Footer";
import notes from "../notes";
import createNote from "./CreateNote";

function App() {
    return (
        <div>
            <Header />
            {notes.map(createNote)}
            <Footer />
        </div>
    );
}

export default App;