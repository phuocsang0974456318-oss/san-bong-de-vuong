import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getSupabaseSetupMessage, supabase } from '../lib/supabase';

export function AuthPage({ mode, role = 'customer' }: { mode: 'login' | 'register'; role?: 'customer' | 'admin' }) {
  const isRegister = mode === 'register';
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { session, profile, loading } = useAuth();

  if (session && !isRegister) {
    if (loading) return <div className="account-page"><p>Đang kiểm tra tài khoản...</p></div>;
    if (profile?.role === role) {
      return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/account'} replace />;
    }
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!supabase) {
      setError(getSupabaseSetupMessage());
      return;
    }

    setSubmitting(true);
    try {
      if (isRegister) {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: fullName.trim() },
            emailRedirectTo: `${window.location.origin}/account`,
          },
        });

        if (authError) throw authError;
        if (!data.session) {
          setMessage('Đăng ký thành công. Hãy kiểm tra email để xác nhận tài khoản trước khi đăng nhập.');
        } else {
          navigate('/account', { replace: true });
        }
      } else {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authError) throw authError;

        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError || userProfile?.role !== role) {
          const { error: signOutError } = await supabase.auth.signOut();
          if (signOutError) throw signOutError;
          throw new Error(
            profileError
              ? `Không xác minh được quyền tài khoản: ${profileError.message}`
              : role === 'admin'
                ? 'Tài khoản này không có quyền quản trị viên.'
                : 'Vui lòng sử dụng trang đăng nhập quản trị viên cho tài khoản này.',
          );
        }

        const destination = (location.state as { from?: string } | null)?.from
          ?? (role === 'admin' ? '/admin/dashboard' : '/account');
        navigate(destination, { replace: true });
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Không thể hoàn tất yêu cầu. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="account-page">
      <div className="account-card">
        <span className="account-card__eyebrow">Sân bóng Đế Vương</span>
        <h1>{isRegister ? 'Tạo tài khoản khách hàng' : role === 'admin' ? 'Đăng nhập quản trị viên' : 'Đăng nhập khách hàng'}</h1>
        <p>{isRegister
          ? 'Đăng ký để gửi yêu cầu đặt sân và theo dõi thông tin của bạn.'
          : role === 'admin'
            ? 'Đăng nhập bằng tài khoản đã được cấp quyền quản trị viên.'
            : 'Đăng nhập để đặt sân và quản lý thông tin tài khoản.'}</p>
        {error && <div className="account-message account-message--error" role="alert">{error}</div>}
        {message && <div className="account-message account-message--success" role="status">{message}</div>}
        <form className="account-form" onSubmit={submit}>
          {isRegister && (
            <label>
              Họ và tên
              <input value={fullName} onChange={(event) => setFullName(event.target.value)} required maxLength={100} autoComplete="name" />
            </label>
          )}
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
          </label>
          <label>
            Mật khẩu
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete={isRegister ? 'new-password' : 'current-password'} />
            {isRegister && <small>Mật khẩu tối thiểu 8 ký tự.</small>}
          </label>
          <button type="submit" disabled={submitting}>{submitting ? 'Đang xử lý...' : isRegister ? 'Đăng ký' : 'Đăng nhập'}</button>
        </form>
        <div className="account-card__switch">
          {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
          <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Đăng nhập' : 'Đăng ký'}</Link>
        </div>
        {!isRegister && (
          <div className="account-card__switch">
            {role === 'admin' ? 'Là khách hàng?' : 'Bạn là quản trị viên?'}{' '}
            <Link to={role === 'admin' ? '/login' : '/admin/login'}>
              {role === 'admin' ? 'Đăng nhập khách hàng' : 'Đăng nhập quản trị viên'}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export function ProtectedRoute({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const { session, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="account-page"><p>Đang kiểm tra tài khoản...</p></div>;
  }
  if (!session) {
    return <Navigate to={adminOnly ? '/admin/login' : '/login'} replace state={{ from: location.pathname }} />;
  }
  if (adminOnly && profile?.role !== 'admin') {
    return (
      <div className="account-page">
        <div className="account-card">
          <h1>Không có quyền truy cập</h1>
          <p>Trang này chỉ dành cho tài khoản quản trị viên.</p>
          <Link className="account-card__link" to="/">Về trang chủ</Link>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

export function AccountPage() {
  const { profile, session } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const signOut = async () => {
    if (!supabase) return;
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError(signOutError.message);
      return;
    }
    navigate('/');
  };

  return (
    <section className="account-page">
      <div className="account-card">
        <span className="account-card__eyebrow">TÀI KHOẢN CỦA BẠN</span>
        <h1>Xin chào{profile?.full_name ? `, ${profile.full_name}` : ''}</h1>
        <p>{profile?.email ?? session?.user.email}</p>
        {error && <div className="account-message account-message--error" role="alert">{error}</div>}
        <div className="account-card__actions">
          <Link className="account-card__link" to="/booking">Gửi yêu cầu đặt sân</Link>
          {profile?.role === 'admin' && <Link className="account-card__link" to="/admin">Mở trang quản trị</Link>}
          <button className="account-card__secondary" type="button" onClick={signOut}>Đăng xuất</button>
        </div>
      </div>
    </section>
  );
}
