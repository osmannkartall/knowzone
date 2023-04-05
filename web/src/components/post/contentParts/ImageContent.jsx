import FileUploader from '../../common/FileUploader';

function ImageContent({ field, onChange, value }) {
  return (
    <div title={field}>
      <FileUploader
        id={field}
        files={Array.isArray(value) ? value : []}
        setFiles={onChange}
      />
    </div>
  );
}

export default ImageContent;
