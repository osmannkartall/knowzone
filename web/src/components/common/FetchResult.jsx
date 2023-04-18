import { Alert, Button, CircularProgress } from '@mui/material';

function FetchResult({ status, errorMessage, handleOnClickShowMore, noNextText, noResultText }) {
  if (status === 'error') {
    return <Alert severity="error">{`Error: ${errorMessage}`}</Alert>;
  }

  if (status === 'loading') {
    return (
      <CircularProgress size={32} />
    );
  }

  if (status === 'hasNext') {
    return (
      <div>
        <Button
          variant="outlined"
          onClick={handleOnClickShowMore}
        >
          Show More
        </Button>
      </div>
    );
  }

  if (status === 'resolved' && noNextText) {
    return noNextText;
  }

  if (status === 'noResult') {
    return noResultText;
  }

  return null;
}

export default FetchResult;
