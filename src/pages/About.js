import React from 'react'
import './About.css'
import { useNavigate } from 'react-router-dom';

function About() {
   const navigate = useNavigate();
   const handleReset = () =>{
      localStorage.clear();
      navigate('/');
   }
   return (
      <div className='about-container'>
         <h3>Giới thiệu</h3>
         <p>
            Đây là trang học từ vựng tiếng Trung. Có thể giúp bạn ghi nhớ từ vựng, pinyin dễ dàng và hiệu quả.
            Được mô phỏng dưới dạng trò chơi tích điểm và có bảng xếp hạng thành tích.
            Từ vựng bao gồm từ hsk1 đến hsk6.
         </p>
         <h3>Đặt lại tất cả thành tích</h3>
         <button onClick={handleReset}>Reset</button>
      </div>
   )
}

export default About
