import TagPicker from '../../common/TagPicker/TagPicker';

const getErrorMessageOfArrayForm = (arr) => {
  if (arr) {
    if (arr.message) {
      return arr.message;
    }

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] && arr[i].message) {
        return arr[i].message;
      }
    }
  }

  return null;
};

function Topics({ onChange, value, errors, setAreTopicsUnique }) {
  return (
    <TagPicker
      tags={Array.isArray(value) ? value : []}
      setTags={onChange}
      placeholder="Type a topic and press enter to add"
      required
      unique
      border
      showError={errors.topics !== undefined}
      onNotUniqueError={(isUnique) => setAreTopicsUnique(isUnique)}
      helperText={getErrorMessageOfArrayForm(errors.topics)}
    />
  );
}

export default Topics;
