import { Button, styled } from '@mui/material';

const ShowMoreContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

function ShowMore({ hasNext, onClickShowMore, showNoNextText, noNextText }) {
  if (hasNext) {
    return (
      <ShowMoreContainer>
        <Button
          variant="outlined"
          onClick={onClickShowMore}
        >
          Show More
        </Button>
      </ShowMoreContainer>
    );
  }

  if (showNoNextText && !hasNext) {
    return <ShowMoreContainer>{noNextText}</ShowMoreContainer>;
  }

  return null;
}

export default ShowMore;
