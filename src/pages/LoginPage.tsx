import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LoginPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (!supabase) {
        setErrorMsg('Chưa kết nối được Supabase.');
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('*')
          .eq('email', email)
          .single();

        if (staffError || !staffData) {
          setErrorMsg('Email hoặc mật khẩu không chính xác!');
          setLoading(false);
          return;
        }
      }

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      onLoginSuccess();
    } catch (err: any) {
      setErrorMsg('Lỗi đăng nhập: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      width: '100vw', 
      backgroundColor: '#07090e', 
      backgroundImage: 'radial-gradient(circle at 50% 30%, #111827 0%, #07090e 100%)',
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: '"Georgia", "Times New Roman", serif' 
    }}>
      {/* Khung thẻ phong cách cổ điển sang trọng */}
      <div style={{ 
        backgroundColor: '#0d1322', 
        borderRadius: '4px', 
        padding: '48px 40px', 
        width: '100%', 
        maxWidth: '440px', 
        border: '1px solid #d4af37', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 0 15px rgba(212, 175, 55, 0.05)',
        position: 'relative'
      }}>
        
        {/* Góc trang trí cổ điển */}
        <div style={{ position: 'absolute', top: '8px', left: '8px', width: '8px', height: '8px', borderTop: '1px solid #d4af37', borderLeft: '1px solid #d4af37' }} />
        <div style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', borderTop: '1px solid #d4af37', borderRight: '1px solid #d4af37' }} />
        <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '8px', height: '8px', borderBottom: '1px solid #d4af37', borderLeft: '1px solid #d4af37' }} />
        <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '8px', height: '8px', borderBottom: '1px solid #d4af37', borderRight: '1px solid #d4af37' }} />

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: 700, 
            color: '#d4af37', 
            textTransform: 'uppercase', 
            letterSpacing: '2.5px',
            fontFamily: 'sans-serif'
          }}>
           Sân bóng Đế Vương
          </span>
          <h2 style={{ 
            fontSize: '26px', 
            fontWeight: 'normal', 
            color: '#f8fafc', 
            margin: '12px 0 6px 0',
            letterSpacing: '0.5px'
          }}>
            Hệ Thống Quản Trị
          </h2>
          <div style={{ width: '40px', height: '1px', backgroundColor: '#d4af37', margin: '0 auto' }} />
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: '10px 0 0 0', fontStyle: 'italic', fontFamily: 'sans-serif' }}>
            Vui lòng xác thực quyền hạn vận hành.
          </p>
        </div>

        {errorMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#451a03', border: '1px solid #b45309', color: '#fde68a', padding: '10px 14px', borderRadius: '4px', fontSize: '13px', marginBottom: '16px', fontFamily: 'sans-serif' }}>
            <ShieldAlert size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontFamily: 'sans-serif' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Quản Trị</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#d4af37' }} />
              <input
                type="email"
                required
                placeholder="admin@tuanduong.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px 12px 12px 42px', 
                  borderRadius: '4px', 
                  border: '1px solid #334155', 
                  backgroundColor: '#07090e',
                  color: '#fff',
                  fontSize: '14px', 
                  outline: 'none', 
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mật Khẩu</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#d4af37' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px 12px 12px 42px', 
                  borderRadius: '4px', 
                  border: '1px solid #334155', 
                  backgroundColor: '#07090e',
                  color: '#fff',
                  fontSize: '14px', 
                  outline: 'none', 
                  boxSizing: 'border-box' 
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px', 
              backgroundColor: '#d4af37', 
              color: '#0f172a', 
              border: 'none', 
              borderRadius: '4px', 
              padding: '13px', 
              fontSize: '14px', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              marginTop: '10px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
              transition: 'all 0.2s'
            }}
          >
            <span>{loading ? 'Đang xác thực...' : 'Truy Cập Hệ Thống'}</span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
}