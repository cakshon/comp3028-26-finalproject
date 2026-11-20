const MAX_NAME_LENGTH = 50;
const MAX_EMAIL_LENGTH = 50;

export function readRequiredString(value, field) {
  if (typeof value !== "string" || value.trim() === "") {
    const error = new Error(`${field} is required.`);
    error.status = 400;
    throw error;
  }
  return value.trim();
}

export function readName(value, field) {
  const name = readRequiredString(value, field);
  if (name.length > MAX_NAME_LENGTH) {
    const error = new Error(`${field} must be 50 characters or fewer.`);
    error.status = 400;
    throw error;
  }
  return name;
}

export function readEmail(value, field = "email") {
  const email = readRequiredString(value, field);
  if (email.length > MAX_EMAIL_LENGTH || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const error = new Error(`${field} must be a valid email address of 50 characters or fewer.`);
    error.status = 400;
    throw error;
  }
  return email;
}

export function readID(value, field) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    const error = new Error(`${field} must be a positive integer.`);
    error.status = 400;
    throw error;
  }
  return id;
}

export function rejectUnknownFields(body, allowedFields, message) {
  const fields = Object.keys(body);
  if (fields.length === 0 || fields.some((field) => !allowedFields.includes(field))) {
    const error = new Error(message);
    error.status = 400;
    throw error;
  }
}
