// App.tsx
import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const redirectToVue3 = () => {
  window.location.href = 'http://localhost:5001/layout';
}
const App: React.FC = () => {
  return (
    <>
      <div>
        <h1 >Bonjour,c'est le React!</h1>
        <p onClick={redirectToVue3}>~click me back to vue3~</p>
      </div>
    </>
  );
};

export default App;