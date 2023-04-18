import { Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ReadOnlyChips({ chips }) {
  const navigate = useNavigate();

  const handleChipClick = (chip) => navigate(`/topics/${chip}`);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {(chips ?? []).map((chip) => (
        <Chip
          size="small"
          variant="outlined"
          color="primary"
          key={chip}
          label={chip}
          clickable
          onClick={() => handleChipClick(chip)}
          sx={{ margin: '4px' }}
        />
      ))}
    </div>
  );
}

export default ReadOnlyChips;
