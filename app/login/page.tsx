import LoginClient from "@/components/sections/Login/LoginSection";
import Link from "next/link";
// import LoginClient from './LoginClient';
// import './login.css'; // or convert to Tailwind

export default function LoginPage() {
  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-form">
          <LoginClient />
        </div>
      </div>
    </div>
  );
}
