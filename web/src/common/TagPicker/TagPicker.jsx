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

const TagPicker = ({ tags, setTags, readOnly, placeholder, required, unique }) => {
  const classes = useStyles();
  const [isInvalid, setIsInvalid] = useState(false);

  let placeholderText = placeholder;
  if (placeholderText && required) {
    placeholderText += ' *';
  }

  const handleTagsOnChange = (newTags) => {
    if (unique) {
      const uniqArr = uniq(newTags);
      const invalid = newTags.length !== uniqArr.length;

      if (!invalid || ((newTags.length - uniqArr.length) === 1 && !isInvalid)) {
        setTags(newTags);
      }
      setIsInvalid(invalid);
    } else {
      setTags(newTags);
    }
  };

  return (
    readOnly
      ? (
        <ReactTagInput
          tags={tags}
          onChange={(newTags) => handleTagsOnChange(newTags)}
          removeOnBackspace
          readOnly={readOnly}
          placeholder={placeholderText}
        />
      )
      : (
        <>
          <Box
            border={1}
            borderRadius={5}
            borderColor={unique && isInvalid ? ERROR_COLOR : TAG_BOX_COLOR}
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
          {unique && isInvalid
            ? <p className={classes.errorText}>Tag list should contain unique items</p>
            : null}
        </>
      )
  );
};

TagPicker.defaultProps = {
  placeholder: 'Type a topic and press enter to add',
  unique: true,
};

export default TagPicker;
