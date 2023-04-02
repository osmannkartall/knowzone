import FORM_COMPONENT_TYPES from '../formComponentTypes';
import EditorContentPreview from './EditorContentPreview';
import TextContentPreview from './TextContentPreview';
import ListContentPreview from './ListContentPreview';
import ImageContentPreview from './ImageContentPreview';

const CONTENT_PREVIEWS = new Map();

CONTENT_PREVIEWS.set(FORM_COMPONENT_TYPES.TEXT, () => <TextContentPreview />);
CONTENT_PREVIEWS.set(FORM_COMPONENT_TYPES.EDITOR, () => <EditorContentPreview />);
CONTENT_PREVIEWS.set(FORM_COMPONENT_TYPES.LIST, () => <ListContentPreview />);
CONTENT_PREVIEWS.set(FORM_COMPONENT_TYPES.IMAGE, () => <ImageContentPreview />);

function getContentPreview(contentType) {
  return CONTENT_PREVIEWS.get(contentType);
}

export default getContentPreview;
