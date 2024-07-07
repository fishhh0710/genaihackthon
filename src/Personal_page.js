import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './personal_page.css';
import PersonalData from './personalData.json'
//import BackendIntegration from './BackendIntegration';
import axios from 'axios';

 

const PersonalPage = () => {

  const [isActive, setIsActive] = useState(false); 
  const [isClick, setIsClick] = useState(false);
  const [clickedText, setClickedText] = useState('');
  const [clickedData, setClickedData] = useState(null); // 用于存储点击的 JSON 数据

  const handleDone = (label) => {
    const data = {
      label: label
    };

    setIsClick(false)

    axios.post('http://127.0.0.1:5000/submit', data)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }

  
  

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
            <li><i className="material-icons" onClick={handleMenuClick} id='menu'>menu</i></li>
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
      <div className='TeamATask'>
        <strong>Team A</strong>
        <i className="material-icons" id='add'>add</i>
        <hr /> 
        <div className='box-container'>
        {
        PersonalData && PersonalData.map(personaldata => {
          return(
            <div className={`box${personaldata.data.done}`} key={personaldata.id} onClick={handleDetailClick}>
              { personaldata.data.label}
            </div>
          )
        })
      }
      </div>
      </div>
      <div>
      <section className={`menu${isActive ? "isActive" : ""}`}>
        <div className="personalManagementTitle"><Link to="/">個人管理</Link></div>
        <hr />
        <div className="teamManagementTitle"><Link to="/">團隊管理</Link></div>
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
              <div>Description: 
                <div className='des_block'>
                  {clickedData.data.description}
                </div>
              </div>
              <br />
              <div>Member: {clickedData.data.participants}</div>
              <br />
              <div>Deadline: {clickedData.data.deadline}</div>
              <br />
              <div>Time: {clickedData.data.time}</div>
              <br />
              <div className={`label${clickedData.data.done}`}>
              <label htmlFor="requiredTime">Actual required time</label><br />
              <input
              type="text"
              id="requiredTime"
              name="requiredTime"
              //value={requiredTime}
              //onChange={(e) => setRequiredTime(e.target.value)}
              />
              </div>
              <button className={`doneBtn${clickedData.data.done}`} onClick={() => handleDone(clickedData.data.label)}>Done</button>
            </div>
          )}
    </div>
    </div>
  );
};

export default PersonalPage;
