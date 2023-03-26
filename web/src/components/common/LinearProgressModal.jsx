import { LinearProgress, Modal } from '@material-ui/core';

const LinearProgressModal = ({ isOpen, children }) => (
  <>
    <Modal open={isOpen}>
      <LinearProgress />
    </Modal>
    {children}
  </>
);

export default LinearProgressModal;
