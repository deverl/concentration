import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import "./SettingsDlg.css";
import WordFileUploader from "./WordFileUploader";

function SettingsDlg({ onClose }) {
    const [playSounds, setPlaySounds] = useState(false);
    const [columns, setColumns] = useState(0);
    const [timeout, setTimeoutValue] = useState(2);
    const [filename, setFilename] = useState("words.txt");
    const [title, setTitle] = useState("");
    const [wordList, setWordList] = useState([]);

    useEffect(() => {
        setPlaySounds(localStorage.getItem("sounds") === "1");
        setColumns(parseInt(localStorage.getItem("columns") || "0", 10));
        setTimeoutValue(parseInt(localStorage.getItem("timeout") || "2", 10));
        setFilename(localStorage.getItem("file") || "words.txt");
        setTitle(localStorage.getItem("title") || "");
        const wordsValue = localStorage.getItem("words");
        if (wordsValue) {
            try {
                setWordList(JSON.parse(wordsValue));
            } catch (err) {
                console.error("Invalid words in localStorage", err);
            }
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = event => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const handleSave = () => {
        localStorage.setItem("sounds", playSounds ? "1" : "0");
        localStorage.setItem("columns", columns.toString());
        localStorage.setItem("timeout", timeout.toString());
        localStorage.setItem("file", filename);
        localStorage.setItem("title", title);
        localStorage.setItem("words", JSON.stringify(wordList));
        if (onClose) onClose();
    };

    const handleWordsLoaded = words => {
        setWordList(words);
    };

    const handleClearWords = () => {
        setWordList([]);
    };

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="dialog-container">
                <div className="dialog-title-row">
                    <div className="dialog-title">Concentration Configuration</div>
                </div>

                <div className="dialog-content" style={{ marginTop: "10px" }}>
                    <div>
                        <input
                            type="checkbox"
                            id="play_sounds"
                            checked={playSounds}
                            onChange={e => setPlaySounds(e.target.checked)}
                        />
                        <label htmlFor="play_sounds">Play Sounds</label>
                    </div>
                </div>

                <div className="dialog-content" style={{ marginTop: "10px" }}>
                    <div>
                        <input
                            type="number"
                            id="num_columns"
                            value={columns}
                            onChange={e => setColumns(Number(e.target.value))}
                            max={10}
                            min={0}
                            style={{ color: "#000", backgroundColor: "#f0f0f0" }}
                        />
                        <label htmlFor="num_columns"> Columns</label>
                    </div>
                </div>

                <div className="dialog-content" style={{ marginTop: "10px" }}>
                    <div>
                        <input
                            type="number"
                            id="timeout"
                            value={timeout}
                            onChange={e => setTimeoutValue(Number(e.target.value))}
                            max={10}
                            min={1}
                            style={{ color: "#000", backgroundColor: "#f0f0f0" }}
                        />
                        <label htmlFor="timeout"> Flip timeout</label>
                    </div>
                </div>

                <div className="dialog-content" style={{ marginTop: "10px" }}>
                    <div>
                        <input
                            type="text"
                            id="filename"
                            value={filename}
                            onChange={e => setFilename(e.target.value)}
                            style={{ color: "#000", backgroundColor: "#f0f0f0" }}
                        />
                        <label htmlFor="filename"> File name</label>
                    </div>
                </div>

                <div className="dialog-content" style={{ marginTop: "10px" }}>
                    <div>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            style={{ color: "#000", backgroundColor: "#f0f0f0" }}
                        />
                        <label htmlFor="title"> Title</label>
                    </div>
                </div>

                <div className="dialog-content" style={{ marginTop: "10px" }}>
                    <WordFileUploader onWordsLoaded={handleWordsLoaded} />
                </div>

                <div className="dialog-content" style={{ marginTop: "10px" }}>
                    {wordList.length > 0 && (
                        <>
                            <div style={{
                                marginTop: "10px",
                                maxHeight: "80px",
                                overflowY: "auto",
                                backgroundColor: "#f9f9f9",
                                border: "1px solid #ccc",
                                padding: "5px",
                                fontFamily: "monospace"
                            }}>
                                {wordList.map((word, index) => (
                                    <div key={index}>{word}</div>
                                ))}
                            </div>
                            <button
                                type="button"
                                style={{
                                    marginTop: "10px",
                                    marginLeft: "10px",
                                    height: "40px",
                                    backgroundColor: "#d9534f",
                                    color: "#fff",
                                    border: "none",
                                    padding: "6px 12px",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                                onClick={handleClearWords}
                            >
                                Clear Words
                            </button>
                        </>
                    )}
                </div>

                <div className="button-row">
                    <button
                        type="button"
                        className="ui button"
                        style={{ backgroundColor: "#5cb85c", color: "#fff" }}
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </form>
    );
}

SettingsDlg.propTypes = {
    onClose: PropTypes.func,
};

export default SettingsDlg;
