import React, { useState } from 'react';
import { Search, Upload, Download, Edit2, Trash2 } from 'lucide-react';
import '../styles/pages.css';

const dummyInventory = [
  { id: 1, partNo: '22201-KON-DU2', barcode: '8901234567890', desc: 'DISK CLUTCH FRICTION', loc: 'A2-15', qty: 150 },
  { id: 2, partNo: '14401-KWB-921', barcode: '8901234567891', desc: 'CHAIN CAM', loc: 'B1-02', qty: 45 },
  { id: 3, partNo: '06455-KPL-901', barcode: '8901234567892', desc: 'PAD SET, FRONT', loc: 'C3-11', qty: 0 },
  { id: 4, partNo: '31311-KWF-900', barcode: '8901234567893', desc: 'O-RING, 14.8X2.4', loc: 'A1-05', qty: 320 },
];

const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = dummyInventory.filter(item => 
    item.partNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1>Inventory Management</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary">
            <Download size={18} />
            Export
          </button>
          <button className="btn btn-primary">
            <Upload size={18} />
            Import Excel File
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div className="input-with-icon" style={{ width: '300px' }}>
            <Search size={18} className="input-icon" />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search part no or description..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Showing {filtered.length} items
          </span>
        </div>

        <div className="table-container">
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
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 500 }}>{item.partNo}</td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{item.barcode}</td>
                  <td>{item.desc}</td>
                  <td><span className="badge badge-info">{item.loc}</span></td>
                  <td>{item.qty}</td>
                  <td>
                    {item.qty > 10 ? (
                      <span className="badge badge-success">In Stock</span>
                    ) : item.qty > 0 ? (
                      <span className="badge badge-warning">Low Stock</span>
                    ) : (
                      <span className="badge badge-danger">Out of Stock</span>
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
          {filtered.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              No inventory found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
