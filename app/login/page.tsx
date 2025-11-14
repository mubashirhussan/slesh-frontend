import LoginClient from "@/components/sections/Login/LoginSection";
import Link from "next/link";
// import LoginClient from './LoginClient';
// import './login.css'; // or convert to Tailwind

export default function LoginPage() {
  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your Slesh account to continue</p>
        </div>
        <div className="login-form">
          <LoginClient />
        </div>
        <div className="login-footer">
          <p>
            <Link href="/">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
