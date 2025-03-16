import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bg from '../assets/nha.png';
import co from '../assets/co.png';
import dienthoai from '../assets/dienthoai.png';

import hsk1 from '../assets/ongnoi1.jpg';
import hsk2 from '../assets/ongnoi2.jpg';
import hsk3 from '../assets/ongnoi3.jpg';
import hsk4 from '../assets/ongnoi4.jpg';
import hsk5 from '../assets/ongnoi5.jpg';
import hsk6 from '../assets/bo1.jpg';

import './Home.css';

function Home() {
  const hskImages = [hsk1, hsk2, hsk3, hsk4, hsk5, hsk6];
  const [index, setIndex] = useState(0);
  const [bouncingIdx, setBouncingIdx] = useState(null);
  const totalSlides = Math.ceil(hskImages.length / 3);
  const navigate = useNavigate();

  const nextSlide = () => {
    setIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleClick = (e, idx) => {
    const img = e.target;

    const rect = img.getBoundingClientRect();
    img.style.position = "fixed";
    img.style.left = `${rect.left}px`;
    img.style.top = `${rect.top}px`;
  
    setBouncingIdx(idx);
  
    setTimeout(() => {
      setBouncingIdx(null);
      img.style.position = "";
      img.style.left = "";
      img.style.top = "";
    }, 3000);
    


  };

  const handleGame = (level, idx) => {
    navigate(`/game/${level}`);
  };

  return (
    <div className='home'>
      <div className='check-mobile'>
        <center><img className='animate__animated animate__shakeX animate__infinite' src={dienthoai} alt='dien thoai' /></center>
        <center><p className='animate__animated animate__pulse animate__infinite'>Dùng điện thoại để truy cập</p></center>
      </div>
      <div className='background'>
        <img className='image-background' src={bg} alt='bg' />
        <img className='image-grass' src={co} alt='bgrass' />
      </div>
      <div className="slider-container">
        <div className="slider" style={{ transform: `translateX(-${index * 100}%)` }}>
          {hskImages.map((imgSrc, idx) => (
            <div key={idx} className="slide-item">
              <img 
                className={`hsk ${bouncingIdx === idx ? 'moving' : ''}`} 
                src={imgSrc} 
                alt={`hsk${idx + 1}`} 
                onClick={(e) => handleClick(e,idx)} 
              />
              <p className="hsk-level" onClick={() => handleGame(idx + 1, idx)}>HSK {idx + 1}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="button-container">
        <button onClick={prevSlide}><i className="bi bi-arrow-left-circle"></i></button>
        <button onClick={nextSlide}><i className="bi bi-arrow-right-circle"></i></button>
      </div>
    </div>
  );
}

export default Home;
