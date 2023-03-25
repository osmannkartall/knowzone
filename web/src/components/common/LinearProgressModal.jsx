import { LinearProgress, Modal } from '@mui/material';

function LinearProgressModal({ isOpen, children }) {
  return (
    <>
      <Modal open={isOpen}>
        <LinearProgress />
      </Modal>
      {children}
    </>
  );
}

export default LinearProgressModal;
