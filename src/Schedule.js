/*
import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './Personal_team_page.css';
import axios from 'axios';
import personalData from './personalData.json'

const PersonalTeamPage = () => {

  const [isActive, setIsActive] = useState(false); 
  const [todoTasks, setTodoTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [isClick, setIsClick] = useState(false);
  const [clickedText, setClickedText] = useState('');
  const [clickedData, setClickedData] = useState(null); // 用于存储点击的 JSON 数据

  const handleDone = (label) => {
    const data = {
      label: label
    };

    axios.post('http://127.0.0.1:5000/submit', data)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }

  const handleDetailClick = (event) => {
    setIsClick(true)
    const text = event.target.innerText;
    setClickedText(text);

    const data = personalData.find(item => item.data.label === text);
    setClickedData(data);
  };

  const handleGenerate = () => {
    const data = {
      message: "generate"
    };

    axios.post('http://127.0.0.1:5000/generate', data)
      .then(response => {
        console.log(response.data);
        const generatedTasks = response.data;

        // Filter personalData to find tasks matching generatedTasks
        const todo = personalData.filter(item => generatedTasks.includes(item.data.label) && item.data.done === "0");
        const done = personalData.filter(item => generatedTasks.includes(item.data.label) && item.data.done === "1");

        setTodoTasks(todo);
        setDoneTasks(done);
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
            <li><button id='generate' onClick={handleGenerate}>Generate</button></li>
          </ul>
        </div>
      </nav>
      <div className='body'>
        <section className='Todo'>
            <strong>To-Do</strong>
            <hr />
            <div className='box-container'>
            {todoTasks && todoTasks.map(task => (
              <div key={task.id} className={`box-1`} onClick={handleDetailClick}>
                {task.data.label}
              </div>
            ))}
      </div>
        </section>
        <section className='Done'>
            <strong>Done</strong>
            <hr />
            <div className='box-container'>
            {doneTasks && doneTasks.map(task => (
              <div key={task.id} className={`box${task.data.done}`} onClick={handleDetailClick}>
                {task.data.label}
              </div>
            ))}
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

export default PersonalTeamPage;
*/

import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './Personal_team_page.css';
import axios from 'axios';
import personalData from './personalData.json';

const PersonalTeamPage = () => {
  const [isActive, setIsActive] = useState(false);
  const [todoTasks, setTodoTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [isClick, setIsClick] = useState(false);
  const [clickedText, setClickedText] = useState('');
  const [clickedData, setClickedData] = useState(null); // 用于存储点击的 JSON 数据

  const handleDone = (label) => {
    const data = {
      label: label
    };

    setIsClick(false)

    // 发送 POST 请求到后端更新任务状态为已完成
    axios.post('http://127.0.0.1:5000/submit', data)
      .then(response => {
        console.log(response.data);
        // 更新前端状态：从 todoTasks 移除完成的任务，加入到 doneTasks
        const updatedTodoTasks = todoTasks.filter(task => task.data.label !== label);
        const taskToMove = todoTasks.find(task => task.data.label === label);
        setTodoTasks(updatedTodoTasks);
        setDoneTasks([...doneTasks, taskToMove]);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }

  const handleDetailClick = (event) => {
    setIsClick(true)
    const text = event.target.innerText;
    setClickedText(text);

    const data = personalData.find(item => item.data.label === text);
    setClickedData(data);
  };

  const handleGenerate = () => {
    const data = {
      message: "generate"
    };

    axios.post('http://127.0.0.1:5000/generate', data)
      .then(response => {
        console.log(response.data);
        const generatedTasks = response.data;

        // Filter personalData to find tasks matching generatedTasks
        const todo = personalData.filter(item => generatedTasks.includes(item.data.label) && item.data.done === "0");
        const done = personalData.filter(item => generatedTasks.includes(item.data.label) && item.data.done === "1");

        setTodoTasks(todo);
        setDoneTasks(done);
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
            <li><button id='generate' onClick={handleGenerate}>Generate</button></li>
          </ul>
        </div>
      </nav>
      <div className='body'>
        <section className='Todo'>
          <strong>To-Do</strong>
          <hr />
          <div className='box-container'>
            {todoTasks && todoTasks.map(task => (
              <div key={task.id} className={`Sbox-1`} onClick={handleDetailClick}>
                {task.data.label}
              </div>
            ))}
          </div>
        </section>
        <section className='Done'>
          <strong>Done</strong>
          <hr />
          <div className='box-container'>
            {doneTasks && doneTasks.map(task => (
              <div key={task.id} className={`Sbox${task.data.done}`} onClick={handleDetailClick} >
                {task.data.label}
              </div>
            ))}
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

export default PersonalTeamPage;
