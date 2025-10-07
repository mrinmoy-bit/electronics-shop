import React from 'react';

function Invoice({ sale, onClose, onPrint }) {
  if (!sale) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '10px',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
      }}>
        {/* Invoice Content */}
        <div id="invoice-content" style={{ padding: '40px' }}>
          {/* Header */}
          <div style={{
            borderBottom: '3px solid #667eea',
            paddingBottom: '20px',
            marginBottom: '30px'
          }}>
            <h1 style={{ 
              color: '#667eea', 
              margin: 0,
              fontSize: '32px'
            }}>
              🔌 ElectroStock
            </h1>
            <p style={{ margin: '5px 0', color: '#666' }}>Electronics Shop</p>
          </div>

          {/* Invoice Details */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '30px'
          }}>
            <div>
              <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>INVOICE</h2>
              <p style={{ margin: '5px 0' }}>
                <strong>Invoice #:</strong> {sale.invoice_number}
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Date:</strong> {formatDate(sale.created_at)}
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Served By:</strong> {sale.served_by}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                Thank you for your business!
              </p>
            </div>
          </div>

          {/* Items Table */}
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '30px'
          }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  borderBottom: '2px solid #667eea'
                }}>Product</th>
                <th style={{
                  padding: '12px',
                  textAlign: 'center',
                  borderBottom: '2px solid #667eea'
                }}>Quantity</th>
                <th style={{
                  padding: '12px',
                  textAlign: 'right',
                  borderBottom: '2px solid #667eea'
                }}>Unit Price</th>
                <th style={{
                  padding: '12px',
                  textAlign: 'right',
                  borderBottom: '2px solid #667eea'
                }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.sale_items?.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                    {item.product?.name}
                    <br />
                    <small style={{ color: '#666' }}>{item.product?.category}</small>
                  </td>
                  <td style={{
                    padding: '12px',
                    textAlign: 'center',
                    borderBottom: '1px solid #eee'
                  }}>
                    {item.quantity}
                  </td>
                  <td style={{
                    padding: '12px',
                    textAlign: 'right',
                    borderBottom: '1px solid #eee'
                  }}>
                    ${parseFloat(item.unit_price).toFixed(2)}
                  </td>
                  <td style={{
                    padding: '12px',
                    textAlign: 'right',
                    borderBottom: '1px solid #eee'
                  }}>
                    ${parseFloat(item.total_price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div style={{
            textAlign: 'right',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#667eea',
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '5px'
          }}>
            TOTAL: ${parseFloat(sale.total_amount).toFixed(2)}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: '40px',
            paddingTop: '20px',
            borderTop: '1px solid #eee',
            textAlign: 'center',
            color: '#666',
            fontSize: '14px'
          }}>
            <p>Thank you for shopping with ElectroStock!</p>
            <p>For any queries, please contact us.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          padding: '20px',
          background: '#f8f9fa',
          borderTop: '1px solid #ddd',
          display: 'flex',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <button
            onClick={onPrint}
            style={{
              padding: '12px 30px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🖨️ Print Invoice
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '12px 30px',
              background: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Invoice;