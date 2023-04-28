import { Chip } from '@mui/material';
import { useState } from 'react';

function Chips({ chips, setChips, placeholder, disabled, border, borderColor, inputId }) {
  const [text, setText] = useState('');

  const handleInputChange = (e) => setText(e.target.value);

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission

      if (!text || (chips ?? []).includes(text)) {
        return;
      }

      setChips([...chips, text]);
      setText('');
    }

    if (e.key === 'Backspace' && !text && chips.length > 0) {
      setChips(chips.slice(0, -1));
    }
  };

  const handleChipDelete = (deletedChip) => setChips(chips.filter((chip) => chip !== deletedChip));

  return (
    <div
      style={
        border ? {
          border: `1px solid ${borderColor || '#bdbdbd'}`,
          padding: '12px',
          borderRadius: '4px',
        } : {}
      }
    >
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {(chips ?? []).map((chip) => (
          <Chip
            size="small"
            key={chip}
            label={chip}
            onDelete={() => handleChipDelete(chip)}
            sx={{ margin: '4px' }}
          />
        ))}
      </div>
      <input
        id={inputId}
        type="text"
        disabled={disabled}
        value={text}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        style={{ border: 'none', outline: 'none', width: '100%' }}
        placeholder={placeholder}
      />
    </div>
  );
}

Chips.defaultProps = {
  placeholder: 'Type a tag and press enter to add',
  border: false,
};

export default Chips;
