import React from 'react';
import ReactTagInput from '@pathofdev/react-tag-input';
import '@pathofdev/react-tag-input/build/index.css';
import './TagPicker.css';

const TagPicker = ({ tags, setTags, readOnly }) => (
  <ReactTagInput
    tags={tags}
    onChange={(newTags) => setTags(newTags)}
    removeOnBackspace
    readOnly={readOnly}
    placeholder="Type a topic and press enter to add"
  />
);

export default TagPicker;
