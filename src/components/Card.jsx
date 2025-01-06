// import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import "./Card.css";

function Card({ word = "", index = 0, turned = false, timeout = 2, onClick = () => {} }) {
    const title = `card-${index}`;

    const handleClick = e => {
        const title = e.currentTarget.id;
        const index = parseInt(title.split("-")[1]);
        onClick(index);
    };

    if (turned) {
        return (
            <div className="card" id={title} onClick={handleClick}>
                <div className="card-body">
                    <h5 className="card-title">{word}</h5>
                </div>
            </div>
        );
    }

    return (
        <div className="card veiled" id={title} onClick={handleClick}>
            &nbsp;
        </div>
    );
}

Card.propTypes = {
    word: PropTypes.string.isRequired,
    index: PropTypes.number,
    turned: PropTypes.bool,
    timeout: PropTypes.number,
    onClick: PropTypes.func,
};

export default Card;
