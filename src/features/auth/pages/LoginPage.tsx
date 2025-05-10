import { LoginForm } from "../components/LoginForm";

export const LoginPage = () => {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold nb-6 text-center">Crypto Tracker Login</h2>
            <LoginForm />
        </div>
      </div>
    );
};