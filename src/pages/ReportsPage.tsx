import React, { useState, useEffect } from 'react';
import { BarChart3, DollarSign, CalendarCheck, Users, TrendingUp, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalCustomers: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  const fetchReportData = async () => {
    setLoading(true);
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      // Lấy danh sách lịch đặt sân để tính toán doanh thu và tổng số đơn
      const { data: bookingsData } = await supabase
        .from('booking_requests')
        .select('*')
        .order('created_at', { ascending: false });

      // Lấy danh sách khách hàng
      const { count: customerCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer');

      if (bookingsData) {
        setRecentBookings(bookingsData.slice(0, 5)); // Lấy 5 đơn gần nhất

        // Giả lập tính doanh thu (ví dụ mỗi sân 5 người: 200k, sân 7 người: 350k cho các đơn đã xác nhận)
        const confirmedBookings = bookingsData.filter(b => b.status === 'confirmed');
        const revenue = confirmedBookings.reduce((sum, b) => {
          const price = b.court_type === '7' ? 350000 : 200000;
          return sum + price;
        }, 0);

        setStats({
          totalRevenue: revenue,
          totalBookings: bookingsData.length,
          totalCustomers: customerCount || 0,
        });
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu báo cáo:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  return (
    <div>
      {/* Header trang Báo cáo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Sân bóng Đế Vương
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '4px 0 8px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={28} color="#0284c7" /> Báo cáo kinh doanh
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            Thống kê doanh thu, lịch đặt sân và hoạt động kinh doanh tổng quan.
          </p>
        </div>

        <button
          onClick={fetchReportData}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#fff',
            color: '#334155',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={16} />
          <span>Làm mới số liệu</span>
        </button>
      </div>

      {/* CÁC THẺ THỐNG KÊ TỔNG QUAN (CARDS) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Doanh thu */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ backgroundColor: '#e0f2fe', padding: '14px', borderRadius: '10px', color: '#0284c7' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 4px 0', fontWeight: 500 }}>Tổng doanh thu (Ước tính)</p>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
              {loading ? 'Đang tính...' : stats.totalRevenue.toLocaleString('vi-VN')} đ
            </h3>
          </div>
        </div>

        {/* Tổng đơn đặt sân */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ backgroundColor: '#dcfce7', padding: '14px', borderRadius: '10px', color: '#16a34a' }}>
            <CalendarCheck size={24} />
          </div>
          <div>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 4px 0', fontWeight: 500 }}>Tổng lượt đặt sân</p>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
              {loading ? '...' : stats.totalBookings} đơn
            </h3>
          </div>
        </div>

        {/* Tổng khách hàng */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ backgroundColor: '#f3e8ff', padding: '14px', borderRadius: '10px', color: '#9333ea' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 4px 0', fontWeight: 500 }}>Khách hàng đăng ký</p>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
              {loading ? '...' : stats.totalCustomers} tài khoản
            </h3>
          </div>
        </div>
      </div>

      {/* BẢNG HIỂN THỊ GIAO DỊCH / ĐƠN ĐẶT SÂN GẦN NHẤT */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontWeight: 600, color: '#0f172a', fontSize: '16px' }}>
          <TrendingUp size={20} color="#0284c7" />
          <span>Các giao dịch đặt sân gần đây</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Khách hàng</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Loại sân</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Ngày đá</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Khung giờ</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu báo cáo...</td></tr>
            ) : recentBookings.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Chưa có giao dịch nào được ghi nhận.</td></tr>
            ) : (
              recentBookings.map((b, i) => (
                <tr key={b.id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: '#0f172a' }}>
                    {b.customer_name}
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'normal' }}>{b.customer_phone}</div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#334155' }}>Sân {b.court_type} người</td>
                  <td style={{ padding: '12px 16px', color: '#334155' }}>{b.booking_date}</td>
                  <td style={{ padding: '12px 16px', color: '#334155' }}>{b.time_slot}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      backgroundColor: b.status === 'confirmed' ? '#dcfce7' : b.status === 'cancelled' ? '#fee2e2' : '#fef9c3',
                      color: b.status === 'confirmed' ? '#16a34a' : b.status === 'cancelled' ? '#dc2626' : '#ca8a04',
                    }}>
                      {b.status === 'confirmed' ? 'Đã xác nhận' : b.status === 'cancelled' ? 'Đã hủy' : 'Chờ xác nhận'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}