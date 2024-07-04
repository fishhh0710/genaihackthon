import React, { useState } from 'react';
import axios from 'axios';

const input = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/add_task', {
        //括號裡是前端給後端的資料
        name: name,
        description: description,
        time: time
      });

      console.log('test');

      console.log('Response from backend:', response.data);
      // 在這裡處理後端返回的數據或更新前端狀態

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label><br />
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br /><br />

        <label htmlFor="description">Description:</label><br />
        <input
          type="text"
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        /><br /><br />

        <label htmlFor="time">Time:</label><br />
        <input
          type="text"
          id="time"
          name="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        /><br /><br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default input;
