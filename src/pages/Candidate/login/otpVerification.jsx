import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
} from '@mui/material';
import candidateApi from '../../../services/candidateApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { mt } from 'date-fns/locale';

const CandidateVerification = () => {
  const [formData, setFormData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
    const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (!value) {
      setErrors((prev) => ({ ...prev, [name]: `${name.replace('newPassword', 'Password').replace('confirmPassword', 'Confirm Password')} cannot be left blank` }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (name === 'confirmPassword' && value !== formData.newPassword && formData.newPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!formData.otp) newErrors.otp = 'OTP cannot be left blank';
    if (!formData.newPassword) newErrors.newPassword = 'Password cannot be left blank';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm Password cannot be left blank';
    if (formData.confirmPassword && formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const queryParams = `?otp=${formData.otp}&new_password=${formData.newPassword}&confirm_password=${formData.confirmPassword}`;
      const response = await candidateApi.post(`/auth/candidate/reset_password_with_otp${queryParams}`);
      const data = response.data;
      console.log('Reset password success...', data?.data);
      if (data?.success) {
        toast.success('Password reset successfully!');
        navigate('/for-candidate/login');
      } else {
        toast.error(data?.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error.response?.data || error.message);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ marginTop:{xs:0,sm:10,lg:10,xl:20},backgroundColor: '#f5f7fa' }}>
      <Grid item size={{ xs: 11, sm: 8, md: 4, lg: 4, xl: 4 }}
        sx={{
          width: '300px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: 1,
        }}
      >
        <Typography variant="h2"fontSize={20} align="center" gutterBottom>
          Reset Password
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography>OTP</Typography>
          <TextField
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            error={!!errors.otp}
            helperText={errors.otp}
            fullWidth
            placeholder="Enter OTP"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Typography>Password</Typography>
          <TextField
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            fullWidth
            placeholder="Enter Password"
            type="password"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Typography>Confirm Password</Typography>
          <TextField
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            fullWidth
            placeholder="Enter Password Again"
            type="password"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            onClick={handleSubmit}
            variant="contained"
            fullWidth
            sx={{ backgroundColor: "#00BBD4" , '&:hover': { backgroundColor:"#00BBD4"  } }}
          >
            SUBMIT
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default CandidateVerification;