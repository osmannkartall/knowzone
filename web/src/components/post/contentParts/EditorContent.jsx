import MarkdownEditor from '../../common/MarkdownEditor';

function EditorContent({ field, onChange, value }) {
  return (
    <MarkdownEditor
      title={field}
      id={field}
      text={value}
      onChangeText={onChange}
      containerMaxHeight="50vh"
    />
  );
}

export default EditorContent;
