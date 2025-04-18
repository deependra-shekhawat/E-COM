// Purpose: To display the verification link to the user.
const VerifyMail = (user, verificationToken) => {
  return (
    `<div>
      <p>click on below link to verify your email</p>
      <h1>${process.env.APP_DOMAIN}/api/v1/user/verify/?user=${encodeURIComponent(user)}&verificationToken=${encodeURIComponent(verificationToken)}</h1>
    </div>`
  );
}

export default VerifyMail;