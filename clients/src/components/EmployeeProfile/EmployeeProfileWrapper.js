import React from 'react';
import { useParams } from 'react-router-dom';
import EmployeeProfilePage from './EmployeeProfilePage';

const EmployeeProfileWrapper = () => {
  const { id } = useParams();
  if (!id) {
    return <div className="p-6 text-red-500">Çalışan ID bulunamadı.</div>;
  }
  return <EmployeeProfilePage employeeId={id} />;
};

export default EmployeeProfileWrapper;
