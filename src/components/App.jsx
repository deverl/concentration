import { useState, useEffect } from "react";
import axios from "axios";
import { arrayShuffle } from "../utils/Utils.js";
import "./App.css";
import Card from "./Card.jsx";

let timer = null;
let audio = null;
const defaultTimeout = 2; // 2 seconds

function App() {
    const [words, setWords] = useState([]);
    const [solved, setsolved] = useState([]);
    const [tileState, setTileState] = useState([]);
    const [rows, setRows] = useState(2);
    const [cols, setCols] = useState(2);

    useEffect(() => {
        axios.get("/public/words.txt").then(response => {
            let wordArray = response.data.split("\n");

            wordArray = [...wordArray, ...wordArray];

            const numWords = wordArray.length;
            let numCols =
                localStorage.getItem("columns") || Math.ceil(Math.sqrt(numWords)); //  + 1;
            const numRows = numWords / numCols;

            wordArray = arrayShuffle(wordArray);

            const theTileState = new Array(numWords).fill(false);

            const solvedArray = new Array(numWords).fill(false);

            setRows(numRows);
            setCols(numCols);
            setWords(wordArray);
            setsolved(solvedArray);
            setTileState(theTileState);

            audio = document.getElementById("tada_audio");
        });
    }, []);

    const playTada = () => {
        const shouldPlayString = localStorage.getItem("sound");
        if (
            shouldPlayString === null ||
            shouldPlayString === "1" ||
            shouldPlayString === "true" ||
            shouldPlayString === "on"
        ) {
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
                const solvedArray = [...solved];
                solvedArray[selectedWords[0].index] = true;
                solvedArray[selectedWords[1].index] = true;
                newTileState = new Array(words).fill(false);
                setTileState(newTileState);
                setsolved(solvedArray);
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
                    const turned = tileState[index] || solved[index];
                    row.push(
                        <Card
                            word={words[index]}
                            key={index}
                            index={index}
                            turned={turned}
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

    return (
        <>
            <div className="container">
                <h1>Concentration</h1>
                {getLayout()}
            </div>
        </>
    );
}

export default App;
