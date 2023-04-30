import { Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function TopicChips({ chips }) {
  const navigate = useNavigate();

  const handleOnClickChip = (chip) => navigate(`/topics/${chip}`);

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
          onClick={() => handleOnClickChip(chip)}
          sx={{ margin: '4px' }}
        />
      ))}
    </div>
  );
}

export default TopicChips;
