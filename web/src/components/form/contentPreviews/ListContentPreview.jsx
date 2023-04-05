import TagPicker from '../../common/TagPicker/TagPicker';

function ListContentPreview() {
  return (
    <TagPicker
      tags={['example1', 'example2']}
      setTags={() => {}}
      placeholder="Type an item and press enter to add"
      unique
      border
    />
  );
}

export default ListContentPreview;
