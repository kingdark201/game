import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Leaderboard.css";

import mode1 from "../assets/ongnoi1.jpg";
import mode2 from "../assets/ongnoi2.jpg";
import mode3 from "../assets/ongnoi3.jpg";
import mode4 from "../assets/ongnoi4.jpg";
import mode5 from "../assets/ongnoi5.jpg";
import mode6 from "../assets/bo2.jpg";
import { zoomImage } from "../core";

const ITEMS_PER_PAGE = 3;

const Leaderboard = () => {
    const [scores, setScores] = useState([]);
    const [selectedHSK, setSelectedHSK] = useState("all");
    const [selectedMode, setSelectedMode] = useState("all");
    const [selectedQuestions, setSelectedQuestions] = useState("all");
    const [questionOptions, setQuestionOptions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const images = [mode1, mode2, mode3, mode4, mode5, mode6];
    const [randomImage, setRandomImage] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        setRandomImage(images[Math.floor(Math.random() * images.length)]);
    }, []);

    useEffect(() => {
        const storedScores = JSON.parse(localStorage.getItem("gameScores")) || [];
        setScores(storedScores);

        const uniqueQuestions = [...new Set(storedScores.map(score => score.number_question))].sort((a, b) => a - b);
        setQuestionOptions(uniqueQuestions);
    }, []);

    const filterScores = () => {
        return scores
            .filter(score =>
                (selectedHSK === "all" || score.level === selectedHSK) &&
                (selectedMode === "all" || score.mode === selectedMode) &&
                (selectedQuestions === "all" || score.number_question === parseInt(selectedQuestions))
            )
            .sort((a, b) => b.score - a.score);
    };

    const filteredScores = filterScores();
    const totalPages = Math.ceil(filteredScores.length / ITEMS_PER_PAGE);
    const displayedScores = filteredScores.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="leaderboard-container">

            <div className="filters">
                <select onChange={(e) => setSelectedHSK(e.target.value)} value={selectedHSK}>
                    <option value="all">HSK</option>
                    {[1, 2, 3, 4, 5, 6].map(level => (
                        <option key={level} value={level}>HSK {level}</option>
                    ))}
                </select>

                <select onChange={(e) => setSelectedMode(e.target.value)} value={selectedMode}>
                    <option value="all">Chế độ</option>
                    {["hanzi-mean", "mean-hanzi", "pinyin-hanzi", "hanzi-pinyin", "mean-pinyin", "pinyin-mean"].map(mode => (
                        <option key={mode} value={mode}>{mode.replace("-", " → ")}</option>
                    ))}
                </select>

                <select onChange={(e) => setSelectedQuestions(e.target.value)} value={selectedQuestions}>
                    <option value="all">Số câu</option>
                    {questionOptions.map(num => (
                        <option key={num} value={num}>{num} câu</option>
                    ))}
                </select>
            </div>

            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tên</th>
                        <th>Điểm</th>
                        <th>HSK</th>
                        <th>Chế độ</th>
                        <th>Số câu</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedScores.map((entry, index) => (
                        <tr key={index}>
                            <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                            <td>{entry.name}</td>
                            <td>{entry.score}</td>
                            <td>HSK {entry.level}</td>
                            <td>{entry.mode.replace("-", " → ")}</td>
                            <td>{entry.number_question}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>⬅ Trước</button>
                <span>Trang {currentPage} / {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Tiếp ➡</button>
            </div>

            <button className="home-btn" onClick={() => navigate("/")}>🏠 Về trang chủ</button>
            {randomImage && <img src={randomImage} alt="Random" className="img-random" onClick={(e)=>zoomImage(e)} />}
        </div>
    );
};

export default Leaderboard;
