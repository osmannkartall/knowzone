import { TextField } from '@mui/material';

function TextContent({ field, onChange, onBlur, value, name }) {
  return (
    <TextField
      variant="outlined"
      title={field}
      fullWidth
      multiline
      minRows={4}
      maxRows={4}
      id={field}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      name={name}
    />
  );
}

export default TextContent;
