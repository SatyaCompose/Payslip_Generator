import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeTable from './EmployeeTable';
import PayslipViewer from './payslipViewer';
import Loading from './loading';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmployeeTable />} />
        <Route path="/payslip-preview" element={<PayslipViewer />} />
        <Route path="/email-sender" element={<Loading />} />
      </Routes>
    </Router>
  );
}

export default App;
