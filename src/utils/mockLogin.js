export const mockLogin = (email, password) => {
  const credentials = {
    email: "test@bayer.com",
    password: "password1234",
  };
  let errors = {};
  if (email.length === 0) {
    errors.email = "Error de ingreso: campos faltantes";
  }
  if (password.length === 0) {
    errors.password = "Error de ingreso: campos faltantes";
  }
  if (email !== credentials.email || password !== credentials.password) {
    errors.credentials = "Credenciales incorrectas";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  } else {
    return { token: "exampleToken" };
  }
};
