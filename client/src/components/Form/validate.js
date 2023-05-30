const validateName = (name) => {
  if (name.length < 3) {
    return "Name must be at least 3 characters";
  }
  return null;
}

const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  if (!re.test(email)) {
    return "Please input a valid email address";
  }
  return null;
}

const validatePassword = (password) => {
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return null;
}

export { validateName, validateEmail, validatePassword };