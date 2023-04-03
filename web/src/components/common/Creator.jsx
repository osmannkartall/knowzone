import { Button, Dialog, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import Close from '@mui/icons-material/Close';
import { GRAY3, PRIMARY, WHITE } from '../../constants/colors';

const PREFIX = 'Creator';

const classes = {
  modalData: `${PREFIX}-modalData`,
  form: `${PREFIX}-form`,
  topContainer: `${PREFIX}-topContainer`,
  middleContainer: `${PREFIX}-middleContainer`,
  bottomContainer: `${PREFIX}-bottomContainer`,
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
  [`& .${classes.modalData}`]: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: `calc(100% - ${theme.spacing(10)})`,
  },

  [`& .${classes.form}`]: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh',
  },

  [`& .${classes.topContainer}`]: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: WHITE,
    padding: theme.spacing(0, 2),
    borderTopLeftRadius: theme.spacing(1),
    borderTopRightRadius: theme.spacing(1),
    backgroundColor: PRIMARY,
  },

  [`& .${classes.middleContainer}`]: {
    overflowY: 'auto',
    borderTop: 0,
    border: `1px solid ${GRAY3}`,
    backgroundColor: WHITE,
    padding: theme.spacing(1, 0),
  },

  [`& .${classes.bottomContainer}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(2),
    borderBottomLeftRadius: theme.spacing(1),
    borderBottomRightRadius: theme.spacing(1),
    border: `1px solid ${GRAY3}`,
    borderTop: 0,
    backgroundColor: WHITE,
  },
}));

function TopContainer({ title, handleClose }) {
  return (
    <div className={classes.topContainer}>
      <h1>{title ?? 'Create'}</h1>
      <IconButton
        aria-label="close post form"
        style={{ color: WHITE }}
        onClick={handleClose}
        size="large"
      >
        <Close style={{ color: WHITE, width: 35, height: 35 }} />
      </IconButton>
    </div>
  );
}

function MiddleContainer({ children }) {
  return (
    <div className={classes.middleContainer}>
      <div className={classes.middleInnerContainer}>
        {children}
      </div>
    </div>
  );
}

function BottomContainer({ buttonTitle, isButtonDisabled }) {
  return (
    <div className={classes.bottomContainer}>
      <Button variant="contained" color="primary" type="submit" disabled={isButtonDisabled}>
        {buttonTitle ?? 'Create'}
      </Button>
    </div>
  );
}

function DialogData({ title, buttonTitle, handleClose, onSubmit, isButtonDisabled, children }) {
  return (
    <div className={classes.modalData}>
      <form
        className={classes.form}
        onSubmit={onSubmit}
      >
        <TopContainer title={title} handleClose={handleClose} />
        <MiddleContainer>
          {children}
        </MiddleContainer>
        <BottomContainer
          buttonTitle={buttonTitle}
          isButtonDisabled={isButtonDisabled}
        />
      </form>
    </div>
  );
}

function Creator({ title, buttonTitle, isButtonDisabled, isOpen, setIsOpen, onSubmit, children }) {
  const handleClose = () => setIsOpen(false);

  return (
    <StyledDialog onClose={handleClose} open={isOpen}>
      <DialogData
        title={title}
        buttonTitle={buttonTitle}
        handleClose={handleClose}
        onSubmit={onSubmit}
        isButtonDisabled={isButtonDisabled}
      >
        {children}
      </DialogData>
    </StyledDialog>
  );
}

export default Creator;
