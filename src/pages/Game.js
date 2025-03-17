import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Game.css";

import mode1 from "../assets/ongnoi1.jpg";
import mode2 from "../assets/ongnoi2.jpg";
import mode3 from "../assets/ongnoi3.jpg";
import mode4 from "../assets/ongnoi4.jpg";
import mode5 from "../assets/ongnoi5.jpg";
import mode6 from "../assets/bo2.jpg";
import thanhtri from "../assets/thanhtri.png";

import { zoomImage, readExcelFile, removeVietnameseAccents } from "../core";

import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.min.css";

const Game = () => {
  const { level, mode } = useParams();
  const storageKey = `gameProgress_HSK${level}_${mode}`;

  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [isScoreSaved, setIsScoreSaved] = useState(false);

  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(50);
  const [isSelectingRange, setIsSelectingRange] = useState(true);

  const images = [mode1, mode2, mode3, mode4, mode5, mode6];
  const [randomImage, setRandomImage] = useState(null);

  const navigate = useNavigate();

  alertify.set("notifier", "position", "top-right");
  alertify.set("notifier", "delay", 2);

  useEffect(() => {
    setRandomImage(images[Math.floor(Math.random() * images.length)]);
  }, []);

  const loadWords = async () => {
    const wordsFromExcel = await readExcelFile(level);
    const validStart = Math.max(0, startIndex);
    const validEnd = Math.min(wordsFromExcel.length, endIndex);
    let filteredWords = wordsFromExcel.slice(validStart, validEnd);
  
    // Xáo trộn danh sách từ vựng
    filteredWords = filteredWords.sort(() => Math.random() - 0.5);
  
    if (filteredWords.length > 0) {
      setWords(filteredWords);
      setCurrentWord(filteredWords[0]); // Bắt đầu với từ ngẫu nhiên
    }
  };
  

  useEffect(() => {
    const savedProgress = JSON.parse(localStorage.getItem(storageKey));
    if (savedProgress && savedProgress.words.length > 0) {
      setWords(savedProgress.words);
      setScore(savedProgress.score);
      setCurrentWord(savedProgress.currentWord);
      setIsGameOver(false);
      setIsSelectingRange(false);
    } else {
      loadWords();
    }
  }, [level, mode]);

  useEffect(() => {
    if (!isGameOver && words.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify({ words, score, currentWord }));
    }
  }, [words, score, currentWord, isGameOver]);

  const startNewGame = () => {
    setIsSelectingRange(true);
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    setWords(shuffledWords);
    setScore(0);
    setCurrentWord(shuffledWords[0]);
    setIsGameOver(false);
    localStorage.removeItem(storageKey);
  };

  const getNextQuestion = (remainingWords) => {
    if (remainingWords.length === 0) {
      setIsGameOver(true);
      return;
    }
    const randomIndex = Math.floor(Math.random() * remainingWords.length);
    setCurrentWord(remainingWords[randomIndex]);
  };  

  const getQuestionText = () => {
    if (!currentWord) return "";
    switch (mode) {
      case "hanzi-mean": return `Từ: ${currentWord.hanzi}`;
      case "mean-hanzi": return `Nghĩa: ${currentWord.mean}`;
      case "pinyin-hanzi": return `Pinyin: ${currentWord.pinyin}`;
      case "hanzi-pinyin": return `Từ: ${currentWord.hanzi}`;
      case "mean-pinyin": return `Nghĩa: ${currentWord.mean}`;
      case "pinyin-mean": return `Pinyin: ${currentWord.pinyin}`;
      default: return "Lỗi mode!";
    }
  };

  const checkAnswer = () => {
    if (!currentWord) return;

    let correctAnswers = [];
    switch (mode) {
      case "hanzi-mean":
      case "pinyin-mean":
        correctAnswers = currentWord.mean.split(/[,;]\s*/);
        break;
      case "mean-hanzi":
      case "pinyin-hanzi":
        correctAnswers = [currentWord.hanzi];
        break;
      case "hanzi-pinyin":
      case "mean-pinyin":
        correctAnswers = [currentWord.pinyin];
        break;
      default:
        break;
    }

    const normalizeText = (text) => removeVietnameseAccents(text);

    const userAnswers = answer.split(",").map((a) => normalizeText(a));
    const isCorrect = userAnswers.some((ans) =>
      correctAnswers.some((correct) => normalizeText(correct) === ans)
    );

    if (isCorrect) {
      alertify.success("✅ Đúng rồi!");
      setScore(score + 10);
      setWords((prevWords) => {
        const updatedWords = prevWords.filter((w) => w.hanzi !== currentWord.hanzi);
        setTimeout(() => {
          setAnswer("");
          getNextQuestion(updatedWords);
        }, 1000);
        return updatedWords;
      });
    } else {
      alertify.error("❌ Sai! Hãy thử lại.");
      setAnswer("");
      setScore(score - 10);
    }
  };


  const saveScore = () => {
    if (!playerName) return;

    if (!isScoreSaved) {
      // Lưu điểm vào localStorage
      const scores = JSON.parse(localStorage.getItem("gameScores")) || [];
      scores.push({ name: playerName, score, level, mode });
      localStorage.setItem("gameScores", JSON.stringify(scores));

      alertify.success("Điểm số đã được lưu!");
      setIsScoreSaved(true); // Đánh dấu là đã lưu điểm
    } else {
      navigate("/"); // Nếu đã lưu điểm, quay về trang chủ
    }
  };

  const handleImage = (e) => {
    zoomImage(e);
  };

  return (
    <div className="game-container">
      {isSelectingRange ? (
        <div className="select-range-box">
          <img src={thanhtri} alt="thanh tri" />
          <h2>SELECT WORDS</h2>
          <br></br>
          <label>Bắt đầu từ:</label>
          <input
            type="number"
            value={startIndex}
            onChange={(e) => setStartIndex(parseInt(e.target.value) || 0)}
            min="0"
          />
          <br></br>
          <label>Kết thúc:</label>
          <input
            type="number"
            value={endIndex}
            onChange={(e) => setEndIndex(parseInt(e.target.value) || 0)}
            min={startIndex + 1}
          />
          <br></br>
          <button onClick={() => { setIsSelectingRange(false); loadWords(); }}>Bắt đầu chơi</button>
        </div>
      ) : (
        <>
          <h2>HSK {level} - MODE: {mode.replace("-", " → ")}</h2>
          {randomImage && <img src={randomImage} alt="Random" className="img-random" onClick={handleImage} />}
          <div className="box-menu">
            <p>{score} 💰</p>
            <button onClick={startNewGame}>♻️</button>
          </div>

          {isGameOver ? (
            <div className="game-over">
              <h1>Hoàn thành</h1>
              <p>Điểm số của bạn: <strong>{score}</strong></p>
              <input type="text" className="input-name" placeholder="Nhập tên của bạn..." value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
              <div className="btn-bottom">
                <button className="btn-save" onClick={saveScore}>
                  {isScoreSaved ? "🏠 Về trang chủ" : "💾 Lưu điểm"}
                </button>
                <button className="btn-close" onClick={startNewGame}>🔄 Chơi lại</button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="question">{getQuestionText()}</h1>
              <input type="text" value={answer} className="answer-input" onChange={(e) => setAnswer(e.target.value)} placeholder="Nhập câu trả lời..." />
              <button className="check-button" onClick={checkAnswer}>Kiểm tra</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Game;
