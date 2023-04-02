import { TextField } from '@mui/material';

function TextContentPreview() {
  return (
    <TextField
      fullWidth
      id="outlined-basic"
      variant="outlined"
      value="This is a text"
      multiline
      minRows={4}
      maxRows={4}
    />
  );
}

export default TextContentPreview;
