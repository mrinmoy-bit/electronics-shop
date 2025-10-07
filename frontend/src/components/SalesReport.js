import React, { useState, useEffect } from 'react';
import { salesAPI } from '../services/api';
import Invoice from './Invoice';

function SalesReport() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await salesAPI.getAllSales();
      if (response.data.success) {
        setSales(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  };

  const viewInvoice = (sale) => {
    setSelectedSale(sale);
    setShowInvoice(true);
  };

  const closeInvoice = () => {
    setShowInvoice(false);
    setSelectedSale(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const getTodaySales = () => {
    const today = new Date().toDateString();
    return sales.filter(sale => {
      const saleDate = new Date(sale.created_at).toDateString();
      return saleDate === today;
    });
  };

  const getTodayTotal = () => {
    return getTodaySales().reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0).toFixed(2);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>💰 Sales Reports</h2>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          color: 'white',
          padding: '25px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', opacity: 0.9 }}>Today's Sales</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>${getTodayTotal()}</p>
        </div>
        
        <div style={{
          background: 'linear-gradient(45deg, #27ae60, #2ecc71)',
          color: 'white',
          padding: '25px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', opacity: 0.9 }}>Orders Today</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{getTodaySales().length}</p>
        </div>

        <div style={{
          background: 'linear-gradient(45deg, #f39c12, #e67e22)',
          color: 'white',
          padding: '25px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', opacity: 0.9 }}>Total Sales</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{sales.length}</p>
        </div>
      </div>

      {/* Sales Table */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3>All Sales</h3>

        {loading ? (
          <p>Loading sales...</p>
        ) : sales.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No sales yet</p>
        ) : (
          <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Invoice #</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Date & Time</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Served By</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Items</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>Total Amount</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(sale => (
                <tr key={sale.id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{sale.invoice_number}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{formatDate(sale.created_at)}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{sale.served_by}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                    {sale.sale_items?.length || 0}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right', fontWeight: 'bold' }}>
                    ${parseFloat(sale.total_amount).toFixed(2)}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                    <button
                      onClick={() => viewInvoice(sale)}
                      style={{
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Invoice Modal */}
      {showInvoice && selectedSale && (
        <Invoice
          sale={selectedSale}
          onClose={closeInvoice}
          onPrint={handlePrint}
        />
      )}
    </div>
  );
}

export default SalesReport;