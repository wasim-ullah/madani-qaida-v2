import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div style={{
      minHeight: '100svh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg,#0d2d40,#1B4D6B)',
      padding: '24px 16px',
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: 'linear-gradient(135deg,#FFD54F,#FF8F00)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, margin: '0 auto 12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        }}>☪️</div>
        <h1 style={{
          fontFamily: 'Fredoka One, cursive',
          fontSize: 28, color: 'white', margin: 0, lineHeight: 1.2,
        }}>Madani Qaida</h1>
        <p style={{
          fontFamily: 'IndoPak Nastaleeq, serif',
          color: '#FFD54F', fontSize: 18, direction: 'rtl', margin: '4px 0 0',
        }}>مدنى قاعده</p>
        <p style={{
          fontFamily: 'Fredoka One, cursive',
          color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 8,
        }}>Create your free account to start learning</p>
      </div>

      <SignUp />
    </div>
  );
}
