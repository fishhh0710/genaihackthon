import React, { useState } from 'react';
import axios from 'axios';

const input = () => {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/add_task', {
        //括號裡是前端給後端的資料
        label: label,
        description: description,
        time: time,
        deadline: deadline
      });

      console.log('Response from backend:', response.data);
      // 在這裡處理後端返回的數據或更新前端狀態

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="label">Name:</label><br />
        <input
          type="text"
          id="label"
          name="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
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

        <label htmlFor="deadline">Deadline: MM/DD</label><br />
        <input
          type="text"
          id="deadline"
          name="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        /><br /><br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default input;