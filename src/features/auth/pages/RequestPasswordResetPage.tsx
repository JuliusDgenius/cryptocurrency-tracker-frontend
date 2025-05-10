import { PasswordResetRequestForm } from "../components/RequestPasswordResetForm";

export const PasswordResetRequestPage = () => {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold nb-6 text-center">Crypto Tracker Request Password Reset</h2>
          <PasswordResetRequestForm />
        </div>
      </div>
    );
};