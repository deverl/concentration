import { useEffect } from "react";
import PropTypes from "prop-types";

import { isCheckboxChecked, isTruthy } from "../utils/Utils";

import "./SettingsDlg.css";

function SettingsDlg({ onClose }) {
    useEffect(() => {
        const soundsValue = localStorage.getItem("sounds");
        const soundsEl = document.getElementById("play_sounds");
        console.log("soundsValue = ", soundsValue, ", soundsEl = ", soundsEl);
        if (isTruthy(soundsValue)) {
            soundsEl.checked = true;
        } else {
            soundsEl.checked = false;
        }

        const columnsValue = localStorage.getItem("columns");
        const columnsEl = document.getElementById("num_columns");
        if (columnsValue !== null) {
            columnsEl.value = columnsValue;
        } else {
            columnsEl.value = 0;
            localStorage.setItem("columns", 0);
        }

        const timeoutValue = localStorage.getItem("timeout");
        const timeoutEl = document.getElementById("timeout");
        if (timeoutValue !== null) {
            timeoutEl.value = timeoutValue;
        } else {
            timeoutEl.value = 0;
            localStorage.setItem("timeout", 2);
        }
    }, []);

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    const handleSoundsClick = e => {
        const isChecked = isCheckboxChecked("play_sounds");
        if (isChecked) {
            localStorage.setItem("sounds", "1");
        } else {
            localStorage.setItem("sounds", "0");
        }
    };

    const handleColumnsChange = e => {
        console.log("handleColumnsChange");
        const el = document.getElementById("num_columns");
        localStorage.setItem("columns", el.value);
    };

    const handleTimeoutChange = e => {
        console.log("handleTimeoutChange");
        const el = document.getElementById("timeout");
        localStorage.setItem("timeout", el.value);
    };

    return (
        <div className="dialog-container">
            <div className="dialog-title-row">
                <div className="dialog-title">Concentration Configuration</div>
                <div className="dialog-close-x" onClick={handleClose}>
                    <img src="/img/baseline-close-24px.svg" alt="close" />
                </div>
            </div>
            <div
                className="dialog-content"
                id="play_sounds_container"
                onClick={handleSoundsClick}
            >
                <div>
                    <input type="checkbox" id="play_sounds" name="play_sounds" />
                    <label htmlFor="play_sounds">Play Sounds</label>
                </div>
            </div>
            <div
                className="dialog-content"
                id="columns_container"
                onChange={handleColumnsChange}
                style={{ marginTop: "10px" }}
            >
                <div>
                    <input
                        type="number"
                        id="num_columns"
                        name="num_columns"
                        max={10}
                        min={0}
                        style={{ color: "#000", backgroundColor: "#f0f0f0" }}
                    />
                    <label htmlFor="num_columns"> Columns</label>
                </div>
            </div>

            <div
                className="dialog-content"
                id="columns_container"
                onChange={handleTimeoutChange}
                style={{ marginTop: "10px" }}
            >
                <div>
                    <input
                        type="number"
                        id="timeout"
                        name="timeout"
                        max={10}
                        min={1}
                        style={{ color: "#000", backgroundColor: "#f0f0f0" }}
                    />
                    <label htmlFor="timeout"> Flip timeout</label>
                </div>
            </div>

            <div className="button-row">
                <button id="close_button" className="ui button" onClick={handleClose}>
                    Close
                </button>
            </div>
        </div>
    );
}

SettingsDlg.propTypes = {
    onClose: PropTypes.func,
};

export default SettingsDlg;
