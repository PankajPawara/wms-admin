import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';

const dummyEmployees = [
  { id: 1, empId: 'ADMIN001', name: 'Super Admin', role: 'admin', status: 'active' },
  { id: 2, empId: 'EMP002', name: 'John Doe', role: 'employee', status: 'active' },
  { id: 3, empId: 'EMP003', name: 'Jane Smith', role: 'employee', status: 'inactive' },
];

const EmployeesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1>Employee Management</h1>
        <button className="btn btn-primary">
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div className="input-with-icon" style={{ width: '300px' }}>
            <Search size={18} className="input-icon" />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search employee..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dummyEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td style={{ fontWeight: 500 }}>{emp.empId}</td>
                  <td>{emp.name}</td>
                  <td style={{ textTransform: 'capitalize' }}>{emp.role}</td>
                  <td>
                    {emp.status === 'active' ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-danger">Inactive</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="icon-btn" style={{ width: '32px', height: '32px' }}>
                        <Edit2 size={16} />
                      </button>
                      <button className="icon-btn" style={{ width: '32px', height: '32px', color: 'var(--color-danger)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;
