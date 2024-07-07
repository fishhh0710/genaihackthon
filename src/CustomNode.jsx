import React from 'react';

const CustomNode = ({ data }) => {
  return (
    <div style={{
      border: `2px solid ${data.borderColor || 'black'}`,
      padding: 10,
      borderRadius: 5,
      backgroundColor: 'white' 
    }}>
      <strong>{data.label}</strong>
      <div>{data.description}</div>
      <div>{data.time}</div>
      <div>{data.deadline}</div>
    </div>
  );
};

export default CustomNode;
