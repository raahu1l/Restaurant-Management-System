module.exports = (err, req, res, next) => {
  // Keep detailed errors in the server console; return safe, readable messages to the client.
  console.error(err);
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON request body.' });
  if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Duplicate value. A record with this unique value already exists.' });
  if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ error: 'Related record does not exist. Check the selected customer, table, staff, order, menu item or bill.' });
  if (err.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ error: 'Cannot delete this record because it is being used by related records.' });
  if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED' || err.errno === 3819) return res.status(400).json({ error: 'Input violates a database validation rule. Check the allowed values and numeric limits.' });
  if (['ER_BAD_NULL_ERROR','ER_TRUNCATED_WRONG_VALUE','ER_DATA_TOO_LONG','ER_WARN_DATA_OUT_OF_RANGE','ER_TRUNCATED_WRONG_VALUE_FOR_FIELD'].includes(err.code)) return res.status(400).json({ error: 'Invalid or missing input. Check required fields, data types and allowed ranges.' });
  res.status(500).json({ error: 'Internal server error. Please try again.' });
};
