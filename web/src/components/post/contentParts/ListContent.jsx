import TagPicker from '../../common/TagPicker/TagPicker';

function ListContent({ field, onChange, value }) {
  return (
    <div title={field}>
      <TagPicker
        id={field}
        tags={Array.isArray(value) ? value : []}
        setTags={onChange}
        placeholder="Type an item and press enter to add"
        unique
        border
      />
    </div>
  );
}

export default ListContent;
