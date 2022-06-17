import Header from "./Header";
import Footer from "./Footer";
import { useState } from "react";
import CreateArea from "./CreateArea";
import Note from "./Note.jsx"


function App() {

    const [notes, setNote] = useState([]);

    function addNote(newNote) {
        setNote((prevItems) => {
            return [...prevItems, newNote]
        });
    }

    function deleteNote(id) {
        setNote(prevItems => {
            return prevItems.filter(
                (noteItem, index) => {
                    return index !== id;
                });
        });
    }

    return (
        <div>
            <Header />
            <CreateArea
                onAdd={addNote}
            />
            {notes.map((noteItem, i) => (
                <Note
                    key={i}
                    id={i}
                    title={noteItem.title}
                    content={noteItem.content}
                    onDelete={deleteNote}
                />
            ))}
            <Footer />
        </div>
    );
}

export default App;