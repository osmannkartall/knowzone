import FORM_COMPONENT_TYPES from './formComponentTypes.js';
import FORM_SCHEMA_CONFIGS from './formSchemaConfigs.js';

function isAllValidKeyValue(content) {
  return Object.entries(content).every(([key, value]) => (
    typeof value === 'string'
      && value.length > 0
      && Object.values(FORM_COMPONENT_TYPES).includes(value)
      && key.length > 0
      && key.length <= FORM_SCHEMA_CONFIGS.MAX_LEN_KEY_OF_CONTENT
  ));
}

function isValidMaxNumImageComponent(content) {
  let numImageComponent = 0;
  const contentValues = Object.values(content);

  for (let i = 0; i < contentValues.length; i += 1) {
    if (contentValues[i] === FORM_COMPONENT_TYPES.IMAGE) {
      numImageComponent += 1;
    }

    if (numImageComponent > FORM_SCHEMA_CONFIGS.MAX_IMAGE_COMP) {
      return false;
    }
  }

  return true;
}

export default {
  isAllValidKeyValue,
  isValidMaxNumImageComponent,
};
