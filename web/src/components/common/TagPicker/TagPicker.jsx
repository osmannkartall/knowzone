import { useState, useEffect } from 'react';
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
  onNotUniqueError,
  showError,
  helperText,
}) => {
  const classes = useStyles();
  const [areCurrentTagsUnique, setAreCurrentTagsUnique] = useState(true);

  let placeholderText = placeholder;
  if (placeholderText && required) {
    placeholderText += ' *';
  }

  const checkErrors = (newTags = undefined) => {
    let isError = false;
    let currentTags = tags;

    if (newTags !== undefined) {
      currentTags = newTags;
    }
    if (unique) {
      const uniqueTags = uniq(currentTags);
      const isNewTagsArrayUnique = currentTags.length === uniqueTags.length;
      const isNewDuplicatedTagAdded = (currentTags.length - uniqueTags.length) === 1;
      isError = !(isNewTagsArrayUnique || (isNewDuplicatedTagAdded && areCurrentTagsUnique));

      setAreCurrentTagsUnique(isNewTagsArrayUnique);
      if (typeof onNotUniqueError === 'function') {
        onNotUniqueError(isNewTagsArrayUnique);
      }
    }
    return isError;
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      checkErrors();
    }
    return function cleanup() {
      mounted = false;
    };
  }, []);

  const handleTagsOnChange = (newTags) => {
    const isError = checkErrors(newTags);
    const isAnyTagRemoved = newTags.length < tags.length;
    if (!isError || isAnyTagRemoved) {
      setTags(newTags);
    }
  };

  return (
    <>
      {border
        ? (
          <Box
            border={1}
            borderRadius={5}
            borderColor={showError || (unique && !areCurrentTagsUnique)
              ? ERROR_COLOR : TAG_BOX_COLOR}
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
        )
        : (
          <ReactTagInput
            tags={tags}
            onChange={(newTags) => handleTagsOnChange(newTags)}
            removeOnBackspace
            readOnly={readOnly}
            placeholder={placeholderText}
          />
        )}
      {(showError || (unique && !areCurrentTagsUnique)) && (
        <p className={classes.errorText}>
          {showError && helperText && (helperText.length > 0) && areCurrentTagsUnique
            ? helperText
            : `Tag list should contain unique items. '${tags.at(-1)}' exists in the list.`}
        </p>
      )}
    </>
  );
};

TagPicker.defaultProps = {
  placeholder: 'Type a tag and press enter to add',
};

export default TagPicker;
