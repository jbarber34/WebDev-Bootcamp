import { useState } from "react";
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';

function CreateArea(props) {

    const [note, setNote] = useState({
        title: "",
        content: ""
    });

    const [isExpanded, setExpanded] = useState({
        expanded: false,
        rows: 1
    });

    function handleChange(event) {
        const { name, value } = event.target
        setNote(prevNote => {
            return {
                ...prevNote,
                [name]: value
            }
        });
    }

    function expand(event) {
        setExpanded({
            expanded: true,
            rows: 3
        });
    }

    function submitNote(event) {
        props.onAdd(note);
        setNote({
            title: "",
            content: ""
        });
        event.preventDefault();
    }

    return (
        <div>
            <form className="create-note">
                {isExpanded.expanded && (
                    <input
                        onChange={handleChange}
                        name="title"
                        placeholder="Title"
                        value={note.title}
                        autoFocus
                    />
                )}
                <textarea
                    onChange={handleChange}
                    onClick={expand}
                    name="content"
                    placeholder="Take a note..."
                    rows={isExpanded.rows}
                    value={note.content} />
                <Zoom in={isExpanded.expanded}>
                    <Fab onClick={submitNote}>
                        <AddIcon />
                    </Fab>
                </Zoom>
            </form>
        </div >
    );
}

export default CreateArea;