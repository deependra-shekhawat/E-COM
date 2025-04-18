// Purpose: Display the reset password code to the user.
const ResetPassword = (email, otp) => {
    return (
      `<div>
        <h2>input below code to reset your password for ${email}</h2>
        <h1>${otp}</h1>
      </div>`
    );
  }
  
export default ResetPassword;