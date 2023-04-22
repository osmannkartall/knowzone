import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { IRREVERSIBLE_ACTION, WHITE } from '../../constants/colors';

function ConfirmDialog(
  {
    open,
    dialogTitle,
    onClickCancel,
    onClickConfirm,
    confirmButtonTitle,
  },
) {
  return (
    <Dialog
      open={open}
      onClose={onClickCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {dialogTitle ?? 'Confirm'}
      </DialogTitle>
      <DialogActions>
        <Button onClick={onClickCancel} color="primary">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onClickConfirm}
          style={{
            backgroundColor: IRREVERSIBLE_ACTION,
            color: WHITE,
          }}
          autoFocus
        >
          {confirmButtonTitle ?? 'Ok'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
