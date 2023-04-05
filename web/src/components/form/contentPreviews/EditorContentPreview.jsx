import MarkdownEditor from '../../common/MarkdownEditor';

function EditorContentPreview() {
  return (
    <MarkdownEditor
      text={'# This is an editor\n\n```js\nconsole.log("Click to SHOW PREVIEW Button")\n```'}
      onChangeText={() => {}}
      containerMaxHeight="50vh"
    />
  );
}

export default EditorContentPreview;
