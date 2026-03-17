const sendOTPByPhone = async (
  phoneNumber: string,
  fullName: string,
  otp: string,
) => {
  // send otp to phone number using third party service like Twilio, Nexmo, etc.
  console.log(
    `In helpers: 📱 Sending OTP ${otp} to phone number ${phoneNumber} for ${fullName}`,
  );
};

export default sendOTPByPhone;
