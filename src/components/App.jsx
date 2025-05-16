import { useState, useEffect } from "react";
import axios from "axios";
import { arrayShuffle, areSoundsEnabled } from "../utils/Utils.js";
import "./App.css";
import Card from "./Card.jsx";
import SettingsDlg from "./SettingsDlg.jsx";

let timer = null;
let audio = null;
let file = "";
const defaultTimeout = 2; // 2 seconds

function App() {
    const [title, setTitle] = useState("Concentration");
    const [words, setWords] = useState([]);
    const [solvedState, setsolvedState] = useState([]);
    const [tileState, setTileState] = useState([]);
    const [rows, setRows] = useState(2);
    const [cols, setCols] = useState(2);
    const [inSettings, setInSettings] = useState(false);

    function handleWordsLoaded(newWords) {
        let wordArray = [...newWords, ...newWords];

        const numWords = wordArray.length;
        const { numRows, numCols } = calculateRowsAndCols(numWords);

        wordArray = arrayShuffle(wordArray);

        const theTileState = new Array(numWords).fill(false);

        const solvedArray = new Array(numWords).fill(false);

        setRows(numRows);
        setCols(numCols);
        setWords(wordArray);
        setsolvedState(solvedArray);
        setTileState(theTileState);
    }

    useEffect(() => {
        let wordsString = localStorage.getItem("words");
        let wordsArray = [];
        if (wordsString) {
            try {
                wordsArray = JSON.parse(wordsString);
            }
            catch (err) {
                console.error("Invalid words in localStorage", err);
                wordsArray = [];
            }
        }

        if (wordsArray.length > 0) {
            handleWordsLoaded(wordsArray);
        } else {
            file = localStorage.getItem("file");
            if (file === null) {
                file = "/words.txt";
            }
            axios.get(file).then(response => {
                let wordArray = response.data.split("\n");
                handleWordsLoaded(wordArray);
            });
        }
    }, []);

    useEffect(() => {
        audio = document.getElementById("tada_audio");
    }, []);

    useEffect(() => {
        const titlePrefix = localStorage.getItem("title");
        if (titlePrefix) {
            setTitle(titlePrefix + " - Concentration");
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = event => {
            const isMac = navigator.platform.toUpperCase().includes("MAC");
            if (
                (isMac && event.metaKey && event.key === ",") ||
                (!isMac && event.ctrlKey && event.key === ",")
            ) {
                event.preventDefault();
                setInSettings(true);
            }
        };
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const calculateRowsAndCols = numWords => {
        let numCols = localStorage.getItem("columns");
        if (numCols === null || numCols === "0") {
            numCols = Math.ceil(Math.sqrt(numWords));
        }
        const colsHi = numCols + 5;
        const colsLo = numCols - 5;
        while (numCols < colsHi) {
            if (numWords % numCols === 0) {
                break;
            }
            numCols++;
        }
        while (numCols > colsLo && numCols > 0) {
            if (numWords % numCols === 0) {
                break;
            }
            numCols--;
        }
        const numRows = Math.ceil(numWords / numCols);
        return { numRows, numCols };
    };

    const playTada = () => {
        if (areSoundsEnabled()) {
            audio.play();
        }
    };

    const getSelectedWords = newTileState => {
        const selected = [];
        newTileState.forEach((value, index) => {
            if (value) {
                selected.push({ index, word: words[index] });
            }
        });
        return selected;
    };

    const handleClick = idx => {
        if (timer) {
            return;
        }
        let newTileState = [...tileState];
        newTileState[idx] = !tileState[idx];
        setTileState(newTileState);
        if (newTileState.filter(Boolean).length === 2) {
            const selectedWords = getSelectedWords(newTileState);
            if (selectedWords[0].word === selectedWords[1].word) {
                playTada();
                const solvedArray = [...solvedState];
                solvedArray[selectedWords[0].index] = true;
                solvedArray[selectedWords[1].index] = true;
                newTileState = new Array(words).fill(false);
                setTileState(newTileState);
                setsolvedState(solvedArray);
                clearTimeout(timer);
                timer = null;
                return;
            }

            let timeout = localStorage.getItem("timeout") || defaultTimeout;

            timer = setTimeout(() => {
                let a = new Array(tileState.length).fill(false);
                setTileState(a);
                timer = null;
            }, timeout * 1000);
        }
    };

    const getLayout = () => {
        if (words.length === 0) {
            return <h1>Loading...</h1>;
        }
        let numCards = 0;
        let layout = [];
        for (let i = 0; i < rows; i++) {
            let row = [];
            for (let j = 0; j < cols && numCards < words.length; j++) {
                let index = i * cols + j;
                if (index < words.length) {
                    const turned = tileState[index];
                    const solved = solvedState[index];
                    if (turned && !solvedState) {
                        setTimeout(() => {
                            let a = [...tileState];
                            a[index] = false;
                            setTileState(a);
                        }, 2000);
                    }
                    row.push(
                        <Card
                            word={words[index]}
                            key={index}
                            index={index}
                            turned={turned}
                            solved={solved}
                            onClick={handleClick}
                        />
                    );
                    numCards++;
                }
            }
            layout.push(
                <div key={i} className="row">
                    {row}
                </div>
            );
        }
        return layout;
    };

    const handleSettings = () => {
        setInSettings(true);
    };

    const handleSettingsClose = reload => {
        setInSettings(false);
        if (reload) {
            location.reload();
        }
    };

    if (inSettings) {
        return (
            <>
                <SettingsDlg onClose={handleSettingsClose} />
            </>
        );
    }

    return (
        <>
            <div id="setup_button" onClick={handleSettings}>
                <img src="/img/settings.svg" alt="settings" />
            </div>
            <div className="container">
                <h1>{title}</h1>
                {getLayout()}
            </div>
        </>
    );
}

export default App;
