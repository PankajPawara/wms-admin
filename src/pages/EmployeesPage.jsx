import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Edit2, Trash2, Loader2, X } from 'lucide-react';
import { getUsers, createUser, updateUserStatus } from '../api/users.api';
import '../styles/pages.css';

const EmployeesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', employee_id: '', password: '', role: 'picker', mobile: '', email: ''
  });

  const queryClient = useQueryClient();

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowModal(false);
      setFormData({ name: '', employee_id: '', password: '', role: 'picker', mobile: '', email: '' });
      alert('Employee created successfully');
    },
    onError: (err) => {
      alert(`Error creating employee: ${err.message || 'Unknown error'}`);
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const users = response?.data?.items || [];
  const filtered = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container page-enter">
      <div className="dashboard-header">
        <h1>Employee Management</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
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
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Showing {filtered.length} employees
          </span>
        </div>

        <div className="table-container">
          {isLoading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              <Loader2 size={24} className="spin" style={{ margin: '0 auto', display: 'block', marginBottom: '1rem' }} />
              Loading employees...
            </div>
          ) : isError ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-danger)' }}>
              Failed to load employees.
            </div>
          ) : (
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
                {filtered.map((emp) => (
                  <tr key={emp._id}>
                    <td style={{ fontWeight: 500 }}>{emp.employee_id}</td>
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
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          onClick={() => {
                            if (confirm(`Toggle status for ${emp.name}?`)) {
                              toggleStatusMutation.mutate({ id: emp._id, status: emp.status === 'active' ? 'inactive' : 'active' });
                            }
                          }}
                        >
                          Toggle Status
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card page-enter" style={{ width: '400px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>Add New Employee</h2>
              <button className="icon-btn" onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Name</label>
                <input required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Employee ID</label>
                <input required className="input-field" value={formData.employee_id} onChange={e => setFormData({...formData, employee_id: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Initial Password</label>
                <input required type="password" className="input-field" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Role</label>
                <select className="input-field" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="picker">Picker</option>
                  <option value="checker">Checker</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Employee'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;
