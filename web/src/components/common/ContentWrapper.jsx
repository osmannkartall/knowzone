import { styled } from '@mui/material/styles';

const PREFIX = 'ContentWrapper';

const classes = {
  wrapper: `${PREFIX}-wrapper`,
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.wrapper}`]: {
    padding: theme.spacing(0, 2),
  },
}));

function ContentWrapper({ title, children }) {
  return (
    <Root className={classes.wrapper}>
      <h2>{title}</h2>
      {children}
    </Root>
  );
}

export default ContentWrapper;
