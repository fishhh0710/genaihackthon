import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './Personal_team_page.css';

const PersonalTeamPage = () => {

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
      <div className='body'>
        <div className='Todo'>
            <strong>To-Do</strong>
            <hr />
            {/* 这里可以添加其他 Team A 相关的内容 */}
        </div>
        <div className='inProgress'>
            <strong>In Progress</strong>
            <hr />
        </div>
        <div className='Done'>
            <strong>Done</strong>
            <hr />
        </div>
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

    </div>
  );
};

export default PersonalTeamPage;
