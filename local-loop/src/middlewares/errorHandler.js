export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error.status) {
    return res.status(error.status).json({ error: error.message });
  }
  if (error.code === "23505") {
    return res.status(409).json({ error: "A record with that identifier or email already exists." });
  }
  if (error.code === "22001" || error.code === "23522") {
    return res.status(400).json({ error: "One or more values are outside the allowed range." });
  }
  if (error.code === "23503") {
    return res.status(409).json({ error: "The record cannot be deleted because it is still in use." });
  }

  console.error(error);
  return res.status(500).json({ error: "The request could not be completed." });
}
