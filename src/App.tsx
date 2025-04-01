import React from 'react';
import EmployeeList from './components/EmployeeList';

function App() {

  console.log("chcking",process.env.REACT_APP_BASE_URL)
  return (
    <div className="App">
      <EmployeeList />
    </div>
  );
}

export default App;
