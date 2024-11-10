import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeTable from './EmployeeTable';
import PayslipViewer from './payslipViewer';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmployeeTable />} />
        <Route path="/payslip-preview" element={<PayslipViewer />} />
      </Routes>
    </Router>
  );
}

export default App;
