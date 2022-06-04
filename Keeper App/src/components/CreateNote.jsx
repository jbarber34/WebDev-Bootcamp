import Note from "./Note"

function CreateNote(note) {
    return (
        <Note
            key={note.id}
            title={note.title}
            content={note.content}
        />
    );
}

export default CreateNote