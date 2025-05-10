import { useForm } from "react-hook-form";
import { Button, TextField } from "@mui/material";
import { VerifyEmailDto } from "../../../types/auth";
import { authApi } from "../../../api/auth";

export const VerifyEmailForm = () => {
  const { register, handleSubmit } = useForm<VerifyEmailDto>();

  const onSubmit = async (data: VerifyEmailDto) => {
    try {
      await authApi.verifyEmail(data);
      alert('Email successfully verified');
    } catch (error) {
      alert('Email verification failed. Please try again');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Verification Token"
          { ...register('token') }
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained">
          Verify Email
        </Button>
    </form>
  );
};