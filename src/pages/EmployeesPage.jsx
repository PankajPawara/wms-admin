import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Edit2, Trash2, Loader2, X, Users, Shield, User, UserCheck, ArrowUpDown } from 'lucide-react';
import { getUsers, createUser, updateUser, deleteUser } from '../api/users.api';
import { useToast } from '../hooks/useToast';
import '../styles/pages.css';

const EmployeesPage = () => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [sortConfig, setSortConfig] = useState({ key: 'employee_id', direction: 'ascending' });
  
  // Add Form State
  const [addFormData, setAddFormData] = useState({
    name: '', employee_id: '', temporary_password: '', role: 'picker', mobile: '', email: '', address: ''
  });

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    id: '', name: '', employee_id: '', role: 'picker', mobile: '', email: '', address: '', status: 'active'
  });

  // Delete target state
  const [deleteTarget, setDeleteTarget] = useState(null);

  const queryClient = useQueryClient();

  // Query users
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowAddModal(false);
      setAddFormData({ name: '', employee_id: '', temporary_password: '', role: 'picker', mobile: '', email: '', address: '' });
      toast.success('Employee profile created successfully');
    },
    onError: (err) => {
      const errMsg = err.response?.data?.message || err.message || 'Unknown error';
      toast.error(`Create failed: ${errMsg}`);
    }
  });

  // Edit Mutation
  const editMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowEditModal(false);
      toast.success('Employee profile updated successfully');
    },
    onError: (err) => {
      const errMsg = err.response?.data?.message || err.message || 'Unknown error';
      toast.error(`Update failed: ${errMsg}`);
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowDeleteModal(false);
      setDeleteTarget(null);
      toast.success('Employee deleted successfully');
    },
    onError: (err) => {
      const errMsg = err.response?.data?.message || err.message || 'Unknown error';
      toast.error(`Delete failed: ${errMsg}`);
    }
  });

  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate(addFormData);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const { id, ...data } = editFormData;
    editMutation.mutate({ id, data });
  };

  const handleDeleteSubmit = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget._id);
    }
  };

  const openEditModal = (emp) => {
    setEditFormData({
      id: emp._id,
      name: emp.name || '',
      employee_id: emp.employee_id || '',
      role: emp.role || 'picker',
      mobile: emp.mobile || '',
      email: emp.email || '',
      address: emp.address || '',
      status: emp.status || 'active'
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (emp) => {
    setDeleteTarget(emp);
    setShowDeleteModal(true);
  };

  const users = response?.data?.items || [];
  
  // Calculate summary stats
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const pickerCount = users.filter(u => u.role === 'picker').length;
  const checkerCount = users.filter(u => u.role === 'checker').length;

  const filtered = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!a[sortConfig.key]) return 1;
    if (!b[sortConfig.key]) return -1;
    
    let aVal = a[sortConfig.key].toString().toLowerCase();
    let bVal = b[sortConfig.key].toString().toLowerCase();
    
    if (sortConfig.key === 'createdAt') {
      aVal = new Date(a.createdAt).getTime();
      bVal = new Date(b.createdAt).getTime();
    }
    
    if (aVal < bVal) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aVal > bVal) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="page-container page-enter">
      <div className="dashboard-header">
        <h1>Employee Management</h1>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {/* Summary Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="card stat-card">
          <div className="stat-icon-wrapper purple">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <div className="stat-value">{totalUsers}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon-wrapper blue">
            <Shield size={24} />
          </div>
          <div className="stat-content">
            <h3>Admins</h3>
            <div className="stat-value">{adminCount}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon-wrapper green">
            <User size={24} />
          </div>
          <div className="stat-content">
            <h3>Pickers</h3>
            <div className="stat-value">{pickerCount}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon-wrapper orange">
            <UserCheck size={24} />
          </div>
          <div className="stat-content">
            <h3>Checkers</h3>
            <div className="stat-value">{checkerCount}</div>
          </div>
        </div>
      </div>

      <div className="card">
        {/* Filters and Sorting Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <div className="input-with-icon" style={{ width: '260px' }}>
              <Search size={18} className="input-icon" />
              <input 
                type="text" 
                className="input-field" 
                placeholder="Search employee..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select 
                className="input-field" 
                style={{ width: '180px', padding: '0.5rem', cursor: 'pointer' }} 
                value={sortConfig.key} 
                onChange={(e) => setSortConfig(prev => ({ ...prev, key: e.target.value }))}
              >
                <option value="employee_id">Sort by ID</option>
                <option value="name">Sort by Name</option>
                <option value="role">Sort by Type (Role)</option>
                <option value="status">Sort by Status</option>
                <option value="createdAt">Sort by Date Created</option>
              </select>
              
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }} 
                onClick={() => setSortConfig(prev => ({ ...prev, direction: prev.direction === 'ascending' ? 'descending' : 'ascending' }))}
              >
                <ArrowUpDown size={14} />
                {sortConfig.direction === 'ascending' ? 'Ascending' : 'Descending'}
              </button>
            </div>
          </div>
          
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Showing {sorted.length} employees
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
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((emp) => (
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
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          className="icon-btn" 
                          style={{ color: 'var(--color-primary)' }}
                          title="Edit Profile"
                          onClick={() => openEditModal(emp)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="icon-btn" 
                          style={{ color: 'var(--color-danger)' }}
                          title="Delete User"
                          onClick={() => openDeleteModal(emp)}
                        >
                          <Trash2 size={16} />
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

      {/* Add Employee Modal */}
      {showAddModal && createPortal(
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card page-enter" style={{ width: '450px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>Add New Employee</h2>
              <button className="icon-btn" onClick={() => setShowAddModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Name</label>
                <input required className="input-field" value={addFormData.name} onChange={e => setAddFormData({...addFormData, name: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Employee ID</label>
                <input required className="input-field" value={addFormData.employee_id} onChange={e => setAddFormData({...addFormData, employee_id: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Mobile (10 digits)</label>
                <input required type="tel" pattern="[0-9]{10}" placeholder="e.g. 9876543210" className="input-field" value={addFormData.mobile} onChange={e => setAddFormData({...addFormData, mobile: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email</label>
                <input required type="email" placeholder="e.g. employee@wms.com" className="input-field" value={addFormData.email} onChange={e => setAddFormData({...addFormData, email: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Address (Optional)</label>
                <input className="input-field" value={addFormData.address} onChange={e => setAddFormData({...addFormData, address: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Initial Password (min 8 chars)</label>
                <input required type="password" minLength={8} className="input-field" value={addFormData.temporary_password} onChange={e => setAddFormData({...addFormData, temporary_password: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Role</label>
                <select className="input-field" value={addFormData.role} onChange={e => setAddFormData({...addFormData, role: e.target.value})}>
                  <option value="picker">Picker</option>
                  <option value="checker">Checker</option>
                  <option value="admin">Admin</option>
                  <option value="employee">Employee (Generic)</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Employee'}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Employee Modal */}
      {showEditModal && createPortal(
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card page-enter" style={{ width: '450px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>Edit Employee Profile</h2>
              <button className="icon-btn" onClick={() => setShowEditModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Name</label>
                <input required className="input-field" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Employee ID</label>
                <input required className="input-field" value={editFormData.employee_id} onChange={e => setEditFormData({...editFormData, employee_id: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Mobile (10 digits)</label>
                <input required type="tel" pattern="[0-9]{10}" className="input-field" value={editFormData.mobile} onChange={e => setEditFormData({...editFormData, mobile: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email</label>
                <input required type="email" className="input-field" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Address</label>
                <input className="input-field" value={editFormData.address} onChange={e => setEditFormData({...editFormData, address: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Role</label>
                <select className="input-field" value={editFormData.role} onChange={e => setEditFormData({...editFormData, role: e.target.value})}>
                  <option value="picker">Picker</option>
                  <option value="checker">Checker</option>
                  <option value="admin">Admin</option>
                  <option value="employee">Employee (Generic)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Status</label>
                <select className="input-field" value={editFormData.status} onChange={e => setEditFormData({...editFormData, status: e.target.value})}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={editMutation.isPending}>
                {editMutation.isPending ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Dialog Modal */}
      {showDeleteModal && createPortal(
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001
        }}>
          <div className="card page-enter" style={{ width: '400px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>
              <Trash2 size={48} style={{ margin: '0 auto' }} />
            </div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Delete Employee Account</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Are you sure you want to delete the account for <strong>{deleteTarget?.name}</strong> ({deleteTarget?.employee_id})? This action is permanent and cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)} style={{ flex: 1 }}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteSubmit} style={{ flex: 1 }} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default EmployeesPage;
