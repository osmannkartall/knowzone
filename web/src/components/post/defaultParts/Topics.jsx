import { FormHelperText } from '@mui/material';
import { GRAY3, IRREVERSIBLE_ACTION } from '../../../constants/colors';
import Chips from '../../common/Chips';

function getErrorMessageOfArrayInput(arr) {
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
}

function Topics({ onChange, value, errors, inputId }) {
  return (
    <>
      <Chips
        inputId={inputId}
        chips={Array.isArray(value) ? value : []}
        setChips={onChange}
        placeholder="Type a topic and press enter to add"
        border
        borderColor={errors ? IRREVERSIBLE_ACTION : GRAY3}
      />
      {errors && (
      <FormHelperText role="alert" error={errors !== undefined}>
        {getErrorMessageOfArrayInput(errors)}
      </FormHelperText>
      )}
    </>
  );
}

export default Topics;
