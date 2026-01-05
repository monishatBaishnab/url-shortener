type OtpPayload = { verificationCode: number; userName: string };
const sentOtp = ({ verificationCode, userName }: OtpPayload) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OTP Verification</title>
  <style>
    .wrapper {
      margin: 0;
      padding: 0;
      font-family: "Inter", Arial, sans-serif;
    }

    .container {
      background: #ffffff;
      max-width: 500px;
      padding: 45px 35px;
      margin: 0 auto;
      border-radius: 14px;
      text-align: center;
    }

    .logo {
      font-size: 22px;
      font-weight: 600;
      letter-spacing: 1px;
      margin-bottom: 14px;
      color: #2d4a80; /* soft navy */
    }

    h2 {
      margin-bottom: 18px;
      font-size: 20px;
      color: #1f2937; /* soft dark */
      font-weight: 600;
    }

    p {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 28px;
      line-height: 1.6;
    }

    .otp-box {
      font-size: 30px;
      letter-spacing: 12px;
      padding: 14px 0;
      background: #f7f9fc; /* ultra soft grey blue */
      border-radius: 10px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 30px;
      border: 1px solid #e5e7eb; /* soft border */
    }

    .btn:hover {
      background: #2f5fc7;
    }

    footer {
      margin-top: 28px;
      font-size: 12px;
      color: #9ca3af;
      line-height: 1.5;
    }
  </style>
</head>
<body>
 <div class="wrapper">
   <div class="container">
     <div class="logo">URL Shortener</div>
  
     <h2>Your OTP Code</h2>
  
     <p>Hello ${userName},<br />Use the OTP below to verify your action. This OTP is valid for the next 5 minutes.</p>
  
     <div class="otp-box">${verificationCode}</div>
  
     <footer>
       If you did not request this, please ignore this message.<br />
       © 2025 URL Shortener. All rights reserved.
     </footer>
   </div>
 </div>
</body>
</html>

`;
};
export default sentOtp;
