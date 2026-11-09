import React, { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, X, Search, Trash2, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function BookingPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [courtName, setCourtName] = useState('Sân 1 (5 người)');
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('17:00 - 18:30');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('booking_requests')
      .select('*')
      .order('booking_date', { ascending: false });

    if (error) {
      alert('Không tải được lịch đặt sân: ' + error.message);
    } else if (data) {
      setBookings(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchBookings();
  }, [fetchBookings]);

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!supabase) return;

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        alert('Không xác định được tài khoản đăng nhập: ' + userError.message);
        return;
      }
      if (!user) {
        alert('Vui lòng đăng nhập lại trước khi đặt sân.');
        return;
      }

      const newBooking = {
        user_id: user.id,
        customer_name: customerName,
        customer_phone: phone,
        court_type: courtName.includes('(7 người)') ? '7' : '5',
        booking_date: bookingDate || new Date().toISOString().split('T')[0],
        time_slot: timeSlot,
        status: 'confirmed',
        notes: note || 'Không có ghi chú'
      };

      const { error } = await supabase.from('booking_requests').insert([newBooking]);

      if (error) {
        alert('Lỗi đặt sân: ' + error.message);
      } else {
        setIsModalOpen(false);
        setCustomerName('');
        setPhone('');
        setNote('');
        void fetchBookings();
      }
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!supabase) return;
    if (!window.confirm('Bạn có chắc chắn muốn hủy lịch đặt sân này không?')) return;

    setDeletingId(id);
    const { error } = await supabase.from('booking_requests').delete().eq('id', id);
    setDeletingId(null);

    if (!error) {
      setBookings(current => current.filter(b => b.id !== id));
    } else {
      alert('Không xóa được lịch: ' + error.message);
    }
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filtered = bookings.filter(b => {
    const matchSearch = 
      (b.customer_name || '').toLowerCase().includes(normalizedSearch) ||
      (b.customer_phone || '').includes(normalizedSearch) ||
      (`sân ${b.court_type} người`).includes(normalizedSearch) ||
      (b.booking_date || '').includes(normalizedSearch);

    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ padding: '0 8px' }}>
      {/* Tiêu đề trang */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Sân Bóng Đế Vương
          </span>
          <h1 style={{ fontSize: '26px', fontWeight: 'normal', margin: '4px 0 6px 0', color: '#0f172a', fontFamily: '"Georgia", serif' }}>
            Lịch đặt sân
          </h1>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Theo dõi và cập nhật trạng thái các yêu cầu đặt sân nhanh chóng.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0f172a', color: '#d4af37', border: '1px solid #d4af37', borderRadius: '4px', padding: '10px 18px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', textTransform: 'uppercase' }}
          >
            <Plus size={16} /> Đặt sân mới
          </button>
          <button
            onClick={() => void fetchBookings()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '10px 16px', cursor: 'pointer', fontWeight: 500, fontSize: '13px' }}
          >
            <RefreshCw size={16} /> Làm mới
          </button>
        </div>
      </div>

      {/* Khung danh sách */}
      <div style={{ backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        
        {/* Bộ lọc và tìm kiếm */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Tìm theo tên khách, SĐT, sân..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '9px 12px 9px 36px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px', width: '100%', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#fff', color: '#0f172a', fontWeight: 500 }}
            >
              <option value="all">Tất cả ({bookings.length})</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="pending">Chờ xử lý</option>
            </select>
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Mã đặt sân</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Khách hàng</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Sân / Ngày đá</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Khung giờ</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Ghi chú</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Trạng thái</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Đang tải lịch đặt sân...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>Chưa có yêu cầu đặt sân nào.</td>
                </tr>
              ) : (
                filtered.map((b, i) => (
                  <tr key={b.id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#d4af37', fontFamily: 'monospace' }}>
                      #{b.id.slice(0, 6).toUpperCase()}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{b.customer_name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{b.customer_phone}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 500, color: '#0f172a' }}>{`Sân ${b.court_type} người`}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{b.booking_date}</div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#0284c7', fontWeight: 600 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} /> {b.time_slot}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '13px' }}>{b.notes || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ 
                        backgroundColor: b.status === 'confirmed' ? '#f0fdf4' : '#fefce8', 
                        color: b.status === 'confirmed' ? '#16a34a' : '#ca8a04', 
                        padding: '4px 10px', 
                        borderRadius: '4px', 
                        fontSize: '12px', 
                        fontWeight: 600,
                        border: `1px solid ${b.status === 'confirmed' ? '#bbf7d0' : '#fef08a'}`
                      }}>
                        {b.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xử lý'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => void handleDeleteBooking(b.id)}
                        disabled={deletingId === b.id}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: '#fff',
                          color: '#ef4444',
                          border: '1px solid #fca5a5',
                          borderRadius: '4px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: 500
                        }}
                      >
                        <Trash2 size={14} />
                        <span>{deletingId === b.id ? 'Đang hủy...' : 'Hủy lịch'}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal thêm lịch đặt sân */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '6px', width: '100%', maxWidth: '460px', padding: '28px', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', border: '1px solid #d4af37' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
              <X size={20} />
            </button>
            <h2 style={{ margin: '0 0 18px 0', fontSize: '18px', fontWeight: 'normal', color: '#0f172a', fontFamily: '"Georgia", serif' }}>Thêm lịch đặt sân mới</h2>
            
            <form onSubmit={handleAddBooking} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: '#475569', textTransform: 'uppercase' }}>Tên khách hàng *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nguyễn Văn Nam"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: '#475569', textTransform: 'uppercase' }}>Số điện thoại *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: 0901234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: '#475569', textTransform: 'uppercase' }}>Chọn sân</label>
                  <select
                    value={courtName}
                    onChange={(e) => setCourtName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' }}
                  >
                    <option value="Sân 1 (5 người)">Sân 1 (5 người)</option>
                    <option value="Sân 2 (5 người)">Sân 2 (5 người)</option>
                    <option value="Sân 3 (7 người)">Sân 3 (7 người)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: '#475569', textTransform: 'uppercase' }}>Ngày đá</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: '#475569', textTransform: 'uppercase' }}>Khung giờ</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' }}
                >
                  <option value="07:00 - 08:30">07:00 - 08:30</option>
                  <option value="15:30 - 17:00">15:30 - 17:00</option>
                  <option value="17:00 - 18:30">17:00 - 18:30</option>
                  <option value="18:30 - 20:00">18:30 - 20:00</option>
                  <option value="20:00 - 21:30">20:00 - 21:30</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: '#475569', textTransform: 'uppercase' }}>Ghi chú</label>
                <input
                  type="text"
                  placeholder="VD: Đặt thêm nước uống, đá giải trí..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '9px 16px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', color: '#334155', cursor: 'pointer', fontSize: '13px' }}>Hủy</button>
                <button type="submit" disabled={submitting} style={{ padding: '9px 18px', borderRadius: '4px', border: 'none', background: '#0f172a', color: '#d4af37', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                  {submitting ? 'Đang lưu...' : 'Xác nhận đặt sân'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}