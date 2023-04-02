import { MenuItem, TextField } from '@mui/material';

function Type({ onChange, onBlur, value, formTypes }) {
  return (
    <TextField
      id="select-post-type"
      data-testid="select-post-type"
      select
      onChange={onChange}
      onBlur={onBlur}
      value={value ?? ''}
      variant="outlined"
      fullWidth
    >
      <MenuItem disabled key="none" value="">
        <em>Select</em>
      </MenuItem>
      {(formTypes ?? []).map((form) => (
        <MenuItem key={form.id} value={form.type}>{form.type}</MenuItem>
      ))}
    </TextField>
  );
}

export default Type;
