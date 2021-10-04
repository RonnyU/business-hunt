export default function validateLogin(values) {
  let errors = {};

  if (!values.email) {
    errors.email = 'The Email is required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = 'The email is not valid';
  }

  if (!values.password) {
    errors.password = 'The password is required';
  } else if (values.password.length < 6) {
    errors.password = 'The password has to has at least 6 characters';
  }

  return errors;
}
