import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './personal_page.css';
import PersonalData from './personalData.json'
//import BackendIntegration from './BackendIntegration';

 

const PersonalPage = () => {

  const [isActive, setIsActive] = useState(false); 

  const handleMenuClick = () => {
    setIsActive(!isActive)
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
      <div className='TeamATask'>
        <strong>Team A</strong>
        <i className="material-icons" id='add'>add</i>
        <hr /> 
        <div className='box-container'>
        {
        PersonalData.task && PersonalData.task.map(personaldata => {
          return(
            <div className='box' key={personaldata.id}>
              { personaldata.label}
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
    </div>
  );
};

export default PersonalPage;
