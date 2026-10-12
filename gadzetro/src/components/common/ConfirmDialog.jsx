import Modal from './Modal.jsx'
import Button from './Button.jsx'

export default function ConfirmDialog({ open, title = 'Are you sure?', message, confirmLabel = 'Confirm', danger = false, onConfirm, onCancel }) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  )
}
