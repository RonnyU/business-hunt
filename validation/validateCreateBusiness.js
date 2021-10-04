export default function validateCreateBusiness(values) {
  let errors = {};

  if (!values.name) {
    errors.name = 'The Name is required';
  }

  if (!values.company) {
    errors.company = 'The name of the company is required';
  }

  if (!values.url) {
    errors.url = 'The URL of the company is required';
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(values.url)) {
    errors.url = 'URL invalid';
  }

  if (!values.description) {
    errors.description = 'Add a description of your company';
  }

  return errors;
}
