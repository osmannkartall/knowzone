import { React, useState } from 'react';
import ReactTagInput from '@pathofdev/react-tag-input';
import '@pathofdev/react-tag-input/build/index.css';
import './TagPicker.css';
import { Box, makeStyles } from '@material-ui/core';
import uniq from 'lodash/uniq';

const ERROR_COLOR = '#f44336';
const TAG_BOX_COLOR = 'grey.400';

const useStyles = makeStyles((theme) => ({
  errorText: {
    margin: 0,
    fontSize: '0.75rem',
    marginTop: 3,
    textAlign: 'left',
    fontFamily: 'Roboto',
    fontWeight: 400,
    lineHeight: 1.66,
    letterSpacing: '0.03333em',
    marginLeft: 14,
    marginRight: 14,
    color: ERROR_COLOR,
  },
  tagBox: {
    padding: theme.spacing(1),
  },
}));

const TagPicker = ({
  tags,
  setTags,
  readOnly,
  placeholder,
  required,
  border,
  unique,
  onUniqueError,
  error,
  helperText,
}) => {
  const classes = useStyles();
  const [isValid, setIsValid] = useState(true);

  let placeholderText = placeholder;
  if (placeholderText && required) {
    placeholderText += ' *';
  }

  const handleTagsOnChange = (newTags) => {
    if (unique) {
      const uniqArr = uniq(newTags);
      const valid = newTags.length === uniqArr.length;

      if (valid || ((newTags.length - uniqArr.length) === 1 && isValid)) {
        setTags(newTags);
      }
      setIsValid(valid);
      if (typeof onUniqueError === 'function') {
        onUniqueError(valid);
      }
    } else {
      setTags(newTags);
    }
  };

  return (
    border
      ? (
        <>
          <Box
            border={1}
            borderRadius={5}
            borderColor={error || (unique && !isValid) ? ERROR_COLOR : TAG_BOX_COLOR}
            className={classes.tagBox}
          >
            <ReactTagInput
              tags={tags}
              onChange={(newTags) => handleTagsOnChange(newTags)}
              removeOnBackspace
              readOnly={readOnly}
              placeholder={placeholderText}
            />
          </Box>
          {error || (unique && !isValid)
            ? <p className={classes.errorText}>{error && (helperText.length > 0) ? helperText : 'Tag list should contain unique items.'}</p>
            : null}
        </>
      )
      : (
        <ReactTagInput
          tags={tags}
          onChange={(newTags) => handleTagsOnChange(newTags)}
          removeOnBackspace
          readOnly={readOnly}
          placeholder={placeholderText}
        />
      )
  );
};

TagPicker.defaultProps = {
  placeholder: 'Type a topic and press enter to add',
};

export default TagPicker;
