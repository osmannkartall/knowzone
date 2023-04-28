import { Chip } from '@mui/material';

function ReadOnlyChips({ chips, onClick, selectedIndex }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {(chips ?? []).map((chip, index) => (
        <Chip
          variant="contained"
          color={selectedIndex === index ? 'primary' : 'default'}
          key={chip}
          label={chip}
          clickable
          onClick={(e) => onClick(e, index)}
          sx={{ margin: '4px' }}
        />
      ))}
    </div>
  );
}

export default ReadOnlyChips;
