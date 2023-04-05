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

function ContentWrapper({ Header, children }) {
  return (
    <Root className={classes.wrapper}>
      {Header}
      {children}
    </Root>
  );
}

export default ContentWrapper;
