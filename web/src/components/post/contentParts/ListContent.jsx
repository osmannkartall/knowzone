import Chips from '../../common/Chips';

function ListContent({ field, onChange, value }) {
  return (
    <div title={field}>
      <Chips
        inputId={field}
        chips={Array.isArray(value) ? value : []}
        setChips={onChange}
        placeholder="Type an item and press enter to add"
        border
      />
    </div>
  );
}

export default ListContent;
