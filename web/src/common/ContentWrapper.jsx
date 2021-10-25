import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: theme.spacing(0, 2),
  },
}));

const ContentWrapper = ({ title, children }) => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default ContentWrapper;
