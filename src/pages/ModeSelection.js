import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ModeSelection.css"; 

// Import hình ảnh
import mode1 from "../assets/ongnoi1.jpg";
import mode2 from "../assets/ongnoi2.jpg";
import mode3 from "../assets/ongnoi3.jpg";
import mode4 from "../assets/ongnoi4.jpg";
import mode5 from "../assets/ongnoi5.jpg";
import mode6 from "../assets/bo2.jpg";

import co from "../assets/co.png";
import {zoomImage} from "../core";

// Mảng hình ảnh tương ứng với từng chế độ
const modeImages = [mode1, mode2, mode3, mode4, mode5, mode6];

const modes = [
    { id: 1, label: "Hanzi-Mean", key: "hanzi-mean" },
    { id: 2, label: "Mean-Hanzi", key: "mean-hanzi" },
    { id: 3, label: "Pinyin-Hanzi", key: "pinyin-hanzi" },
    { id: 4, label: "Hanzi-Pinyin", key: "hanzi-pinyin" },
    { id: 5, label: "Mean-Pinyin", key: "mean-pinyin" },
    { id: 6, label: "Pinyin-Mean", key: "pinyin-mean" },
];

const ModeSelection = () => {
    const { level } = useParams();
    const navigate = useNavigate();

    const handleImage = (e)=>{
        zoomImage(e);
    }

    return (
        <div className="mode-selection">
            <img src={co} alt="co" className="bg-selection-mode"/>
            <h1>SELECTION MODE - HSK {level}</h1>
            <div className="mode-list">
                {modes.map((mode, index) => (
                    <div key={mode.id} className="mode-item">
                        <img src={modeImages[index]} alt={`hsk${mode.id}`} className="mode-image" onClick={(e)=>handleImage(e)} />
                        <button className="mode-button" onClick={() => navigate(`/game/${level}/${mode.key}`)}>
                            {mode.label}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ModeSelection;
