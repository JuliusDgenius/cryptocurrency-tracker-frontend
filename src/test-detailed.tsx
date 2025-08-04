import React, { useState, useEffect } from 'react';

const TestComponent: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [text, setText] = useState('');
  
  useEffect(() => {
    console.log('Count changed:', count);
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <input value={text} onChange={e => setText(e.target.value)} />
    </div>
  );
};

export default TestComponent;
