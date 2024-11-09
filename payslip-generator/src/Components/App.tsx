import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeTable from './EmployeeTable';
import PayslipGenerator from './payslipGenerator';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmployeeTable />} />
        <Route path="/payslip-preview" element={<PayslipGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;
