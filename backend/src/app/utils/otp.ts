import dayjs from 'dayjs';

export const generateOtp = () => {
  const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  const expireAt = dayjs().add(5, 'minute').toISOString(); // OTP expires in 5 minutes

  return { verificationCode, expireAt };
};

export const isOtpExpired = (expireAt: string | null): boolean => {
  if (!expireAt) return true;
  return dayjs().isAfter(dayjs(expireAt));
};
