import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Upload, Download, Edit2, Trash2, Loader2 } from 'lucide-react';
import { getInventory, importInventory } from '../api/inventory.api';
import '../styles/pages.css';

const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['inventory', searchTerm],
    queryFn: () => getInventory({ search: searchTerm }),
  });

  const importMutation = useMutation({
    mutationFn: importInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryVersion'] });
      alert('Inventory imported successfully!');
    },
    onError: (err) => {
      alert(`Import failed: ${err.message || 'Unknown error'}`);
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (confirm(`Are you sure you want to import ${file.name}? This will update the inventory version.`)) {
        importMutation.mutate(file);
      }
      e.target.value = null; // reset
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  const items = response?.data?.items || [];

  return (
    <div className="page-container page-enter">
      <div className="dashboard-header">
        <h1>Inventory Management</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {importMutation.isPending && <span style={{color: 'var(--color-primary)'}}>Importing...</span>}
          <button className="btn btn-secondary" onClick={() => alert('Export not implemented yet')}>
            <Download size={18} />
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
            <Upload size={18} />
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
            Showing {items.length} items
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
                  <th>Stock</th>
                  <th>Status</th>
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
                    <td>{item.quantity}</td>
                    <td>
                      {item.quantity > 10 ? (
                        <span className="badge badge-success">In Stock</span>
                      ) : item.quantity > 0 ? (
                        <span className="badge badge-warning">Low Stock</span>
                      ) : (
                        <span className="badge badge-danger">Out of Stock</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="icon-btn" style={{ width: '32px', height: '32px' }} title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button className="icon-btn" style={{ width: '32px', height: '32px', color: 'var(--color-danger)' }} title="Delete">
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
      </div>
    </div>
  );
};

export default InventoryPage;
