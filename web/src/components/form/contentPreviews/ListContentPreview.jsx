import Chips from '../../common/Chips';

function ListContentPreview() {
  return (
    <Chips
      chips={['example1', 'example2']}
      setChips={() => {}}
      placeholder="Type an item and press enter to add"
      disabled
      border
    />
  );
}

export default ListContentPreview;
