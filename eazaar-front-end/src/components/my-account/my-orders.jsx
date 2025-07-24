import dayjs from "dayjs";
import Link from "next/link";
import React from "react";
import Loader from "../loader/loader";
import { useTheme } from "@/context/ThemeContext";

const MyOrders = ({ orderData, orderLoading, orderError }) => {
  const order_items = orderData?.orders;
  const { isDark } = useTheme();
  return (
    <div className="profile__ticket table-responsive" style={{
      backgroundColor: isDark ? '#1e293b !important' : 'transparent !important'
    }}>
      {orderLoading ? (
        <div className="d-flex justify-content-center py-5">
          <Loader loading={true} />
        </div>
      ) : orderError ? (
        <div
          style={{ height: "210px" }}
          className="d-flex align-items-center justify-content-center"
        >
          <div className="text-center">
            <i
              style={{ 
                fontSize: "30px", 
                color: isDark ? "#fbbf24" : "#f39c12" 
              }}
              className="fa-solid fa-exclamation-triangle"
            ></i>
            <p style={{ 
              color: isDark ? "#f8fafc" : "#1e293b",
              fontSize: "16px",
              fontWeight: "500",
              margin: "12px 0 6px 0"
            }}>
              Unable to load orders at the moment.
            </p>
            <small style={{ 
              color: isDark ? "#94a3b8" : "#64748b",
              fontSize: "14px"
            }}>
              Please try refreshing the page.
            </small>
          </div>
        </div>
      ) : (!order_items ||
        (order_items?.length === 0 && (
          <div
            style={{ height: "210px" }}
            className="d-flex align-items-center justify-content-center"
          >
            <div className="text-center">
              <i
                style={{ 
                  fontSize: "30px", 
                  color: isDark ? "#94a3b8" : "#64748b" 
                }}
                className="fa-solid fa-cart-circle-xmark"
              ></i>
              <p style={{ 
                color: isDark ? "#f8fafc" : "#1e293b",
                fontSize: "16px",
                fontWeight: "500",
                margin: "12px 0"
              }}>
                You Have no order Yet!
              </p>
            </div>
          </div>
        )))}
      {order_items && order_items?.length > 0 && (
        <table className={isDark ? "custom-dark-table" : "table"} style={{
          backgroundColor: isDark ? '#1e293b !important' : '#ffffff !important',
          color: isDark ? '#f8fafc !important' : '#1e293b !important',
          width: '100% !important',
          borderCollapse: 'collapse !important'
        }}>
          <thead style={{
            backgroundColor: isDark ? '#1e40af !important' : '#f8f9fa !important',
            borderBottom: isDark ? '1px solid #3b82f6 !important' : '1px solid #dee2e6 !important'
          }}>
            <tr>
              <th scope="col" style={{
                color: isDark ? '#f8fafc !important' : '#1e293b !important',
                borderColor: isDark ? '#475569 !important' : '#dee2e6 !important',
                padding: '12px 15px !important',
                fontWeight: '600 !important'
              }}>Order Id</th>
              <th scope="col" style={{
                color: isDark ? '#f8fafc !important' : '#1e293b !important',
                borderColor: isDark ? '#475569 !important' : '#dee2e6 !important',
                padding: '12px 15px !important',
                fontWeight: '600 !important'
              }}>Order Time</th>
              <th scope="col" style={{
                color: isDark ? '#f8fafc !important' : '#1e293b !important',
                borderColor: isDark ? '#475569 !important' : '#dee2e6 !important',
                padding: '12px 15px !important',
                fontWeight: '600 !important'
              }}>Status</th>
              <th scope="col" style={{
                color: isDark ? '#f8fafc !important' : '#1e293b !important',
                borderColor: isDark ? '#475569 !important' : '#dee2e6 !important',
                padding: '12px 15px !important',
                fontWeight: '600 !important'
              }}>View</th>
            </tr>
          </thead>
          <tbody>
            {order_items.map((item, i) => (
              <tr key={i} style={{
                backgroundColor: isDark ? '#1e40af !important' : '#ffffff !important',
                borderBottom: isDark ? '1px solid #3b82f6 !important' : '1px solid #dee2e6 !important'
              }} className={isDark ? "dark-mode-row" : ""}>
                <th scope="row" style={{
                  color: isDark ? '#f8fafc !important' : '#1e293b !important',
                  backgroundColor: isDark ? '#1e40af !important' : '#ffffff !important',
                  borderColor: isDark ? '#475569 !important' : '#dee2e6 !important',
                  padding: '12px 15px !important',
                  fontWeight: '500 !important'
                }}>#{item._id.substring(20, 25)}</th>
                <td data-info="title" style={{
                  color: isDark ? '#e2e8f0 !important' : '#475569 !important',
                  backgroundColor: isDark ? '#1e40af !important' : '#ffffff !important',
                  borderColor: isDark ? '#475569 !important' : '#dee2e6 !important',
                  padding: '12px 15px !important'
                }}>
                  {dayjs(item.createdAt).format("MMMM D, YYYY")}
                </td>
                <td
                  data-info={`status ${item.status === "pending" ? "pending" : ""}  ${item.status === "processing" ? "hold" : ""}  ${item.status === "delivered" ? "done" : ""}`}
                  className={`status ${item.status === "pending" ? "pending" : ""} ${item.status === "processing" ? "hold" : ""}  ${item.status === "delivered" ? "done" : ""}`}
                  style={{
                    backgroundColor: isDark ? '#1e40af !important' : '#ffffff !important',
                    borderColor: isDark ? '#475569 !important' : '#dee2e6 !important',
                    padding: '12px 15px !important',
                    color: isDark ? '#f8fafc !important' : '#1e293b !important'
                  }}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </td>
                <td style={{
                  backgroundColor: isDark ? '#1e40af !important' : '#ffffff !important',
                  borderColor: isDark ? '#475569 !important' : '#dee2e6 !important',
                  padding: '12px 15px !important'
                }}>
                  <Link 
                    href={`/order/${item._id}`} 
                    className="tp-logout-btn"
                    style={{
                      backgroundColor: isDark ? '#3b82f6 !important' : '#0989FF !important',
                      color: '#ffffff !important',
                      border: 'none !important',
                      padding: '8px 16px !important',
                      borderRadius: '6px !important',
                      textDecoration: 'none !important',
                      fontSize: '14px !important',
                      fontWeight: '500 !important',
                      transition: 'all 0.2s ease !important'
                    }}
                  >
                    Invoice
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {/* Custom dark mode table styles */}
      <style jsx>{`
        .custom-dark-table {
          width: 100% !important;
          margin-bottom: 1rem !important;
          color: #f8fafc !important;
          background-color: #1e293b !important;
          border-collapse: collapse !important;
          border: 1px solid #475569 !important;
        }
        
        .custom-dark-table th,
        .custom-dark-table td {
          padding: 12px 15px !important;
          vertical-align: middle !important;
          border: 1px solid #475569 !important;
          background-color: #1e293b !important;
          color: #f8fafc !important;
        }
        
        .custom-dark-table thead th {
          background-color: #334155 !important;
          color: #f8fafc !important;
          font-weight: 600 !important;
          border-bottom: 2px solid #475569 !important;
          text-align: left !important;
        }
        
        .custom-dark-table tbody tr {
          background-color: #1e293b !important;
        }
        
        .custom-dark-table tbody tr:hover {
          background-color: #334155 !important;
        }
        
        .custom-dark-table tbody tr:hover th,
        .custom-dark-table tbody tr:hover td {
          background-color: #334155 !important;
        }
        
        .custom-dark-table .status {
          background-color: #1e293b !important;
          color: #f8fafc !important;
          font-weight: 500 !important;
        }
        
        .custom-dark-table .status.pending {
          color: #fbbf24 !important;
        }
        
        .custom-dark-table .status.hold {
          color: #f97316 !important;
        }
        
        .custom-dark-table .status.done {
          color: #10b981 !important;
        }
        
        .custom-dark-table .tp-logout-btn {
          background-color: #3b82f6 !important;
          color: #ffffff !important;
          border: none !important;
          padding: 8px 16px !important;
          border-radius: 6px !important;
          text-decoration: none !important;
          font-size: 14px !important;
          font-weight: 500 !important;
        }
        
        .custom-dark-table .tp-logout-btn:hover {
          background-color: #2563eb !important;
        }
      `}</style>
    </div>
  );
};

export default MyOrders;
