import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { isCheckboxChecked, isTruthy } from "../utils/Utils";

import "./SettingsDlg.css";
import WordFileUploader from "./WordFileUploader";

function SettingsDlg({ onClose }) {
    const [wordList, setWordList] = useState([]);

    useEffect(() => {
        const soundsValue = localStorage.getItem("sounds");
        const soundsEl = document.getElementById("play_sounds");
        if (isTruthy(soundsValue)) {
            soundsEl.checked = true;
        } else {
            soundsEl.checked = false;
        }

        const columnsValue = localStorage.getItem("columns");
        const columnsEl = document.getElementById("num_columns");
        columnsEl.value = columnsValue !== null ? columnsValue : 0;

        const timeoutValue = localStorage.getItem("timeout");
        const timeoutEl = document.getElementById("timeout");
        timeoutEl.value = timeoutValue !== null ? timeoutValue : 2;

        const titleValue = localStorage.getItem("title");
        const titleEl = document.getElementById("title");
        titleEl.value = titleValue !== null ? titleValue : "";

        const filenameValue = localStorage.getItem("file");
        const filenameEl = document.getElementById("filename");
        filenameEl.value = filenameValue !== null ? filenameValue : "words.txt";

        // Load words
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
    }, []);

    const handleClose = () => {
        if (onClose) onClose();
    };

    const handleSoundsClick = () => {
        const isChecked = isCheckboxChecked("play_sounds");
        localStorage.setItem("sounds", isChecked ? "1" : "0");
    };

    const handleColumnsChange = () => {
        const el = document.getElementById("num_columns");
        localStorage.setItem("columns", el.value);
    };

    const handleTimeoutChange = () => {
        const el = document.getElementById("timeout");
        localStorage.setItem("timeout", el.value);
    };

    const handleFileChange = () => {
        const el = document.getElementById("filename");
        localStorage.setItem("file", el.value);
    };

    const handleTitleChange = () => {
        const el = document.getElementById("title");
        localStorage.setItem("title", el.value);
    };

    const handleWordsLoaded = words => {
        localStorage.setItem("words", JSON.stringify(words));
        setWordList(words);
    };

    const handleClearWords = () => {
        localStorage.removeItem("words");
        setWordList([]);
    };

    const handleSubmit = e => {
        e.preventDefault();
        e.stopPropagation();
        handleClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="dialog-container">
                <div className="dialog-title-row">
                    <div className="dialog-title">Concentration Configuration</div>
                    <div className="dialog-close-x" onClick={handleClose}>
                        <img src="/img/baseline-close-24px.svg" alt="close" />
                    </div>
                </div>

                <div className="dialog-content" id="play_sounds_container" onClick={handleSoundsClick}>
                    <div>
                        <input type="checkbox" id="play_sounds" name="play_sounds" />
                        <label htmlFor="play_sounds">Play Sounds</label>
                    </div>
                </div>

                <div className="dialog-content" id="columns_container" onChange={handleColumnsChange} style={{ marginTop: "10px" }}>
                    <div>
                        <input type="number" id="num_columns" name="num_columns" max={10} min={0} style={{ color: "#000", backgroundColor: "#f0f0f0" }} />
                        <label htmlFor="num_columns"> Columns</label>
                    </div>
                </div>

                <div className="dialog-content" id="timeout_container" onChange={handleTimeoutChange} style={{ marginTop: "10px" }}>
                    <div>
                        <input type="number" id="timeout" name="timeout" max={10} min={1} style={{ color: "#000", backgroundColor: "#f0f0f0" }} />
                        <label htmlFor="timeout"> Flip timeout</label>
                    </div>
                </div>

                <div className="dialog-content" id="filename_container" onChange={handleFileChange} style={{ marginTop: "10px" }}>
                    <div>
                        <input type="text" id="filename" name="filename" style={{ color: "#000", backgroundColor: "#f0f0f0" }} />
                        <label htmlFor="filename"> File name</label>
                    </div>
                </div>

                <div className="dialog-content" id="title_container" onChange={handleTitleChange} style={{ marginTop: "10px" }}>
                    <div>
                        <input type="text" id="title" name="title" style={{ color: "#000", backgroundColor: "#f0f0f0" }} />
                        <label htmlFor="title"> Title</label>
                    </div>
                </div>

                <div className="dialog-content" id="upload_container" style={{ marginTop: "10px" }}>
                    <WordFileUploader onWordsLoaded={handleWordsLoaded} />
                </div>

                <div className="dialog-content" id="words_container" style={{ marginTop: "10px" }}>
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
                    <button id="close_button" className="ui button" onClick={handleClose}>
                        Close
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
