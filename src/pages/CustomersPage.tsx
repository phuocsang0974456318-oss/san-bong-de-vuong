import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, RefreshCw, X, Users, Search, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('id', { ascending: false });

    if (!error && data) {
      setCustomers(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchCustomers();
  }, [fetchCustomers]);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!supabase) return;
      
      const { error } = await supabase.from('profiles').insert([
        {
          id: crypto.randomUUID(),
          full_name: fullName,
          email: email,
          phone: phone,
        },
      ]);

      if (error) {
        alert('Lỗi thêm khách hàng: ' + error.message);
      } else {
        setIsModalOpen(false);
        setFullName('');
        setEmail('');
        setPhone('');
        void fetchCustomers();
      }
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCustomer = async (customer: any) => {
    if (!supabase) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa khách hàng "${customer.full_name || customer.email}" không?`)) return;

    setDeletingId(customer.id);
    const { error } = await supabase.from('profiles').delete().eq('id', customer.id);
    setDeletingId(null);

    if (!error) {
      setCustomers((current) => current.filter((c) => c.id !== customer.id));
    } else {
      alert('Không xóa được khách hàng do chính sách bảo mật (RLS) của Supabase: ' + error.message);
    }
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filtered = customers.filter(
    (c) =>
      (c.full_name || '').toLowerCase().includes(normalizedSearch) ||
      (c.email || '').toLowerCase().includes(normalizedSearch) ||
      (c.phone || '').includes(normalizedSearch)
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Sân bóng Đế Vương
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '4px 0 8px 0', color: '#0f172a' }}>Khách hàng</h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Danh sách tài khoản khách hàng đã đăng ký trong hệ thống.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 16px', fontWeight: 600, cursor: 'pointer' }}
          >
            <UserPlus size={16} /> Thêm khách hàng
          </button>
          <button
            onClick={() => void fetchCustomers()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', fontWeight: 500 }}
          >
            <RefreshCw size={16} /> Làm mới
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#0f172a' }}>
            <Users size={20} color="#0284c7" /> Tài khoản khách hàng ({filtered.length})
          </div>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Tìm theo tên, email hoặc SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', width: '100%', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Họ và tên</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Email</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Số điện thoại</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Đang tải danh sách khách hàng...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Chưa có dữ liệu khách hàng.</td>
                </tr>
              ) : (
                filtered.map((c, i) => (
                  <tr key={c.id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#0f172a' }}>{c.full_name || 'Chưa cập nhật'}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{c.email || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{c.phone || '—'}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => void handleDeleteCustomer(c)}
                        disabled={deletingId === c.id}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: '#fff',
                          color: '#ef4444',
                          border: '1px solid #fca5a5',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: 500
                        }}
                      >
                        <Trash2 size={14} />
                        <span>{deletingId === c.id ? 'Đang xóa...' : 'Xóa'}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '24px', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
              <X size={20} />
            </button>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>Thêm khách hàng mới</h2>
            <form onSubmit={handleAddCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Họ và tên *</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập họ tên"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Email *</label>
                <input
                  type="email"
                  required
                  placeholder="Nhập email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Số điện thoại</label>
                <input
                  type="text"
                  placeholder="Nhập số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#334155', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" disabled={submitting} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                  {submitting ? 'Đang lưu...' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}