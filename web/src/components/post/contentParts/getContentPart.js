import TextContent from './TextContent';
import ListContent from './ListContent';
import EditorContent from './EditorContent';
import ImageContent from './ImageContent';

import FORM_COMPONENT_TYPES from '../../form/formComponentTypes';

function TextContentComponent({ field, onChange, onBlur, value }) {
  return <TextContent field={field} onChange={onChange} onBlur={onBlur} value={value} />;
}

function EditorContentComponent({ field, onChange, value }) {
  return <EditorContent field={field} onChange={onChange} value={value} />;
}

function ListContentComponent({ field, onChange, value }) {
  return <ListContent field={field} onChange={onChange} value={value} />;
}

function ImageContentComponent({ field, onChange, value }) {
  return <ImageContent field={field} onChange={onChange} value={value} />;
}

const CONTENT = new Map();

CONTENT.set(FORM_COMPONENT_TYPES.TEXT, TextContentComponent);
CONTENT.set(FORM_COMPONENT_TYPES.EDITOR, EditorContentComponent);
CONTENT.set(FORM_COMPONENT_TYPES.LIST, ListContentComponent);
CONTENT.set(FORM_COMPONENT_TYPES.IMAGE, ImageContentComponent);

function getContentPart(contentType) {
  return CONTENT.get(contentType);
}

export default getContentPart;
