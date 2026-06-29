import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Upload, Download, Edit2, Trash2, Loader2, X } from 'lucide-react';
import { getInventory, importInventory, updateInventoryItem, deleteInventoryItem } from '../api/inventory.api';
import { useToast } from '../hooks/useToast';
import '../styles/pages.css';

const InventoryPage = () => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [pendingFile, setPendingFile] = useState(null);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(50);

  // Edit / Delete states
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['inventory', searchTerm, page, limit],
    queryFn: () => getInventory({ search: searchTerm, page, limit }).then(res => res.data),
    keepPreviousData: true,
  });

  const importMutation = useMutation({
    mutationFn: importInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryVersion'] });
      setPendingFile(null);
      toast.success('Inventory imported successfully!');
    },
    onError: (err) => {
      const errMsg = err.response?.data?.message || err.message || 'Unknown error';
      toast.error(`Import failed: ${errMsg}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateInventoryItem({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryVersion'] });
      setEditingItem(null);
      toast.success('Inventory item updated successfully!');
    },
    onError: (err) => {
      const errMsg = err.response?.data?.message || err.message || 'Unknown error';
      toast.error(`Update failed: ${errMsg}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryVersion'] });
      setDeletingItemId(null);
      toast.success('Inventory item deleted successfully!');
    },
    onError: (err) => {
      const errMsg = err.response?.data?.message || err.message || 'Unknown error';
      toast.error(`Delete failed: ${errMsg}`);
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPendingFile(file);
      e.target.value = null; // reset
    }
  };

  const confirmImport = () => {
    if (pendingFile) {
      importMutation.mutate(pendingFile);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setPage(1); // Reset to first page on new search
  };

  const items = response?.items || [];
  const totalItems = response?.total || 0;
  const totalPages = response?.totalPages || 1;

  return (
    <div className="page-container page-enter">
      <div className="dashboard-header">
        <h1>Inventory Management</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {importMutation.isPending && <span style={{color: 'var(--color-primary)'}}>Importing...</span>}
          <button className="btn btn-secondary" onClick={() => toast.info('Export not implemented yet')}>
            <Upload size={18} />
            Export
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept=".xlsx,.xls,.csv" 
            onChange={handleFileChange} 
          />
          <button 
            className="btn btn-primary" 
            onClick={() => fileInputRef.current?.click()}
            disabled={importMutation.isPending}
          >
            <Download size={18} />
            Import Excel File
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
          <form onSubmit={handleSearch} className="input-with-icon" style={{ width: '300px' }}>
            <Search size={18} className="input-icon" />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search part no or description..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" style={{display: 'none'}}>Search</button>
          </form>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Showing {items.length} of {totalItems} items
          </span>
        </div>

        <div className="table-container">
          {isLoading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              <Loader2 size={24} className="spin" style={{ margin: '0 auto', display: 'block', marginBottom: '1rem' }} />
              Loading inventory...
            </div>
          ) : isError ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-danger)' }}>
              Failed to load inventory. Please check backend connection.
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Part No</th>
                  <th>Barcode</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td style={{ fontWeight: 500 }}>{item.part_no}</td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{item.barcode}</td>
                    <td>{item.description}</td>
                    <td><span className="badge badge-info">{item.location}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="icon-btn" 
                          style={{ width: '32px', height: '32px' }} 
                          title="Edit"
                          onClick={() => setEditingItem(item)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="icon-btn" 
                          style={{ width: '32px', height: '32px', color: 'var(--color-danger)' }} 
                          title="Delete"
                          onClick={() => setDeletingItemId(item._id)}
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
          {!isLoading && items.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              No inventory found {searchTerm ? `matching "${searchTerm}"` : ''}
            </div>
          )}
        </div>

        {/* Pagination controls */}
        {!isLoading && totalPages > 1 && (
          <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', padding: '1rem 0', borderTop: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Page <strong>{page}</strong> of {totalPages} (Total: {totalItems} items)
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))} 
                disabled={page === 1}
              >
                Previous
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} 
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* File Import Confirmation Dialog */}
      {pendingFile && createPortal(
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001
        }}>
          <div className="card page-enter" style={{ width: '400px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
              <Upload size={48} style={{ margin: '0 auto' }} />
            </div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Import Inventory File</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Are you sure you want to import <strong>{pendingFile.name}</strong>? This will update the inventory database and increment the global WMS version.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setPendingFile(null)} style={{ flex: 1 }}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={confirmImport} style={{ flex: 1 }} disabled={importMutation.isPending}>
                {importMutation.isPending ? 'Importing...' : 'Confirm Import'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Item Modal */}
      {editingItem && createPortal(
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001
        }}>
          <div className="card page-enter" style={{ width: '450px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Edit Inventory Item</h2>
              <button onClick={() => setEditingItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              updateMutation.mutate({
                id: editingItem._id,
                data: {
                  part_no: editingItem.part_no,
                  barcode: editingItem.barcode,
                  location: editingItem.location,
                  description: editingItem.description
                }
              });
            }}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Part No</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={editingItem.part_no} 
                  onChange={(e) => setEditingItem({ ...editingItem, part_no: e.target.value })} 
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Barcode</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={editingItem.barcode} 
                  onChange={(e) => setEditingItem({ ...editingItem, barcode: e.target.value })} 
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Location</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={editingItem.location} 
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })} 
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Description</label>
                <textarea 
                  className="input-field" 
                  value={editingItem.description} 
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })} 
                  style={{ minHeight: '80px', padding: '0.5rem', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingItem(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Item Confirmation Dialog */}
      {deletingItemId && createPortal(
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001
        }}>
          <div className="card page-enter" style={{ width: '400px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>
              <Trash2 size={48} style={{ margin: '0 auto' }} />
            </div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Delete Inventory Item</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this inventory item? This action is permanent and will trigger a global database version increment.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setDeletingItemId(null)} style={{ flex: 1 }}>
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => deleteMutation.mutate(deletingItemId)} 
                style={{ flex: 1, backgroundColor: 'var(--color-danger)', color: 'white' }} 
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default InventoryPage;
