import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './Personal_team_page.css';
import PersonalData from './personalData.json'
import Edge from './edge.json'

const PersonalTeamPage = () => {

  const [isActive, setIsActive] = useState(false); 
  const [isClick, setIsClick] = useState(false);
  const [clickedText, setClickedText] = useState('');
  const [clickedData, setClickedData] = useState(null); // 用于存储点击的 JSON 数据

  const handleMenuClick = () => {
    setIsActive(!isActive)
  };

  const handleClose = () => {
    setIsClick(false)
  };

  const handleDetailClick = (event) => {
    setIsClick(true)
    const text = event.target.innerText;
    setClickedText(text);

    const data = PersonalData.find(item => item.data.label === text);
    setClickedData(data);
  };

  return (
    <div className='flex-container'>
      <nav className='nav'>
        <div className='leftNav'>
          <ul>
            <li><i className="material-icons" onClick={handleMenuClick}>menu</i></li>
            <li id='personal'><Link to="/">Personal</Link></li>
            <li id='TeamA'><Link to="/TeamA">Team A</Link></li>
          </ul>
        </div>
        <div className='rightNav'>
          <ul>
            <li><i className="material-icons">notifications</i></li>
          </ul>
        </div>
      </nav>
      <div className='body'>
        <section className='Todo'>
            <strong>To-Do</strong>
            <hr />
            <div className='box-container'>
            {
        PersonalData && PersonalData.map(personaldata => {
          return(
            <div className={`ToDobox${personaldata.data.done}`} key={personaldata.id} onClick={handleDetailClick}>
              { personaldata.data.label}
            </div>
          )
        })
      }
      </div>
        </section>
        <section className='inProgress'>
            <strong>In Progress</strong>
            <hr />
            <div className='box-container'>
            {
        PersonalData && PersonalData.map(personaldata => {
          return(
            <div className={`InProgressbox${personaldata.data.done}`} key={personaldata.id} onClick={handleDetailClick}>
              { personaldata.data.label}
            </div>
          )
        })
      }
      </div>
        </section>
        <section className='Done'>
            <strong>Done</strong>
            <hr />
            <div className='box-container'>
            {
        PersonalData && PersonalData.map(personaldata => {
          return(
            <div className={`Donebox${personaldata.data.done}`} key={personaldata.id} onClick={handleDetailClick}>
              { personaldata.data.label}
            </div>
          )
        })
      }
      </div>
        </section>
      </div>
      <div>
      <section className={`menu${isActive ? "isActive" : ""}`}>
        <div className="personalManagementTitle"><Link to="/">個人管理</Link></div>
        <hr />
        <div className="teamManagementTitle" ><Link to="/">團隊管理</Link></div>
        <hr />
        <div className="personalScheduleSuggestionTitle"><Link to="/Schedule">個人日程建議</Link></div>
        <hr />
      </section>
    </div>
    <div className={`detail${isClick ? "isClick" : ""}`}>
    { clickedData && (
            <div>
              <h2>{clickedData.data.label}</h2>
              <i className="material-icons" id='close' onClick={handleClose}>close</i>
              <hr />
              <p>Description: 
                <div className='des_block'>
                  {clickedData.data.description}
                </div>
                </p>
              <p>Member: {clickedData.data.participants}</p>
              <p>Deadline: {clickedData.data.deadline}</p>
              <p>Time: {clickedData.data.time}</p>
            </div>
          )}
    </div>
    </div>
  );
};

export default PersonalTeamPage;
