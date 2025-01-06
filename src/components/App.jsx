import { useState, useEffect } from "react";
import axios from "axios";
import { arrayShuffle, arrayOR } from "../utils/Utils.js";
import "./App.css";
import Card from "./Card.jsx";

let timer = null;
let solved = [];

function App() {
    const [words, setWords] = useState([]);
    const [tileState, setTileState] = useState([]);
    const [rows, setRows] = useState(2);
    const [cols, setCols] = useState(2);

    useEffect(() => {
        axios.get("/public/words.txt").then(response => {
            let wordArray = response.data.split("\n");

            wordArray = [...wordArray, ...wordArray];

            const numWords = wordArray.length;
            const numCols = Math.ceil(Math.sqrt(numWords)) + 1;
            const numRows = numWords / numCols;

            wordArray = arrayShuffle(wordArray);

            const theTileState = new Array(numWords).fill(false);

            solved = new Array(numWords).fill(false);

            setRows(numRows);
            setCols(numCols);
            setWords(wordArray);
            setTileState(theTileState);
        });
    }, []);

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
        const newTileState = [...tileState];
        newTileState[idx] = !tileState[idx];
        setTileState(newTileState);
        if (newTileState.filter(Boolean).length === 2) {
            const selectedWords = getSelectedWords(newTileState);
            console.log("Selected words: ", selectedWords[0].word, selectedWords[1].word);
            if (selectedWords[0].word === selectedWords[1].word) {
                solved[selectedWords[0].index] = true;
                solved[selectedWords[1].index] = true;
                clearTimeout(timer);
                timer = null;
                return;
            }
            timer = setTimeout(() => {
                let a = new Array(tileState.length).fill(false);
                setTileState(a);
                timer = null;
            }, 2000);
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
                    row.push(
                        <Card
                            word={words[index]}
                            key={index}
                            index={index}
                            turned={tileState[index]}
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
