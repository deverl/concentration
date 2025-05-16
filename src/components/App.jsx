import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { arrayShuffle, areSoundsEnabled, getLocalStorage } from "../utils/Utils.js";
import "./App.css";
import Card from "./Card.jsx";
import SettingsDlg from "./SettingsDlg.jsx";

const defaultTimeout = 2; // 2 seconds

const calculateRowsAndCols = numWords => {
    let numCols = parseInt(getLocalStorage("columns", "0"), 10);
    if (numCols === 0) {
        numCols = Math.ceil(Math.sqrt(numWords));
    }

    const maxCols = numCols + 5;
    const minCols = Math.max(numCols - 5, 1);

    for (let i = numCols; i <= maxCols; i++) {
        if (numWords % i === 0) {
            numCols = i;
            break;
        }
    }

    for (let i = numCols; i >= minCols; i--) {
        if (numWords % i === 0) {
            numCols = i;
            break;
        }
    }

    const numRows = Math.ceil(numWords / numCols);
    return { numRows, numCols };
};

function App() {
    const [title, setTitle] = useState("Concentration");
    const [words, setWords] = useState([]);
    const [solvedTiles, setSolvedTiles] = useState([]);
    const [tileState, setTileState] = useState([]);
    const [rows, setRows] = useState(2);
    const [cols, setCols] = useState(2);
    const [inSettings, setInSettings] = useState(false);

    const timerRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        const storedTitle = getLocalStorage("title");
        if (storedTitle) {
            setTitle(`${storedTitle} - Concentration`);
        }
    }, []);

    useEffect(() => {
        let wordArray = [];
        const wordsString = getLocalStorage("words");
        if (wordsString) {
            try {
                wordArray = JSON.parse(wordsString);
            } catch (err) {
                console.error("Invalid words in localStorage", err);
            }
        }

        if (wordArray.length > 0) {
            loadWords(wordArray);
        } else {
            const file = getLocalStorage("file", "/words.txt");
            axios.get(file).then(response => {
                const list = response.data.split("\n").filter(Boolean);
                loadWords(list);
            });
        }
    }, []);

    const loadWords = wordList => {
        let wordArray = [...wordList, ...wordList];
        wordArray = arrayShuffle(wordArray);

        const { numRows, numCols } = calculateRowsAndCols(wordArray.length);

        setRows(numRows);
        setCols(numCols);
        setWords(wordArray);
        setSolvedTiles(new Array(wordArray.length).fill(false));
        setTileState(new Array(wordArray.length).fill(false));
    };

    useEffect(() => {
        const handleKeyDown = event => {
            const isMac = navigator.platform.toUpperCase().includes("MAC");
            const openSettings =
                (isMac && event.metaKey && event.key === ",") ||
                (!isMac && event.ctrlKey && event.key === ",");

            if (openSettings) {
                event.preventDefault();
                setInSettings(true);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const playTada = () => {
        if (areSoundsEnabled() && audioRef.current) {
            audioRef.current.play();
        }
    };

    const getSelectedWords = newTileState => {
        return newTileState
            .map((turned, index) => (turned ? { index, word: words[index] } : null))
            .filter(Boolean);
    };

    const handleClick = idx => {
        if (timerRef.current || tileState[idx] || solvedTiles[idx]) return;

        const newTileState = [...tileState];
        newTileState[idx] = true;
        setTileState(newTileState);

        const selected = getSelectedWords(newTileState);
        if (selected.length === 2) {
            const [first, second] = selected;
            if (first.word === second.word) {
                playTada();
                const updatedSolved = [...solvedTiles];
                updatedSolved[first.index] = true;
                updatedSolved[second.index] = true;
                setSolvedTiles(updatedSolved);

                setTimeout(() => {
                    const cleared = new Array(words.length).fill(false);
                    setTileState(cleared);
                }, 500); // Quick flip back for matched
            } else {
                const timeout = parseFloat(getLocalStorage("timeout", defaultTimeout));
                timerRef.current = setTimeout(() => {
                    const cleared = new Array(words.length).fill(false);
                    setTileState(cleared);
                    timerRef.current = null;
                }, timeout * 1000);
            }
        }
    };

    const handleSettings = () => setInSettings(true);
    const handleSettingsClose = reload => {
        setInSettings(false);
        if (reload) location.reload();
    };

    const getLayout = () => {
        if (words.length === 0) return <h1>Loading...</h1>;

        return Array.from({ length: rows }).map((_, rowIdx) => (
            <div key={rowIdx} className="row">
                {Array.from({ length: cols }).map((_, colIdx) => {
                    const index = rowIdx * cols + colIdx;
                    if (index >= words.length) return null;

                    return (
                        <Card
                            key={index}
                            word={words[index]}
                            index={index}
                            turned={tileState[index]}
                            solved={solvedTiles[index]}
                            onClick={handleClick}
                        />
                    );
                })}
            </div>
        ));
    };

    if (inSettings) {
        return <SettingsDlg onClose={handleSettingsClose} />;
    }

    return (
        <>
            <audio ref={audioRef} id="tada_audio" src="/tada.mp3" preload="auto" />
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
