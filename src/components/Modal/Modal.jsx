import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import styles from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

const Modal = ({ link, tags, closeModal }) => {
  const onBackdropClick = e => {
    if (e.currentTarget === e.target) {
      closeModal();
    }
  };

  const onEsc = evt => {
    if (evt.code === 'Escape') {
      closeModal();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', onEsc);

    return () => {
      window.removeEventListener('keydown', onEsc);
    };
  }, []);

  return createPortal(
    <div className={styles.overlay} onClick={onBackdropClick}>
      <div className={styles.modal}>
        <button className={styles['close-button']} onClick={closeModal}>
          &times;
        </button>
        <img src={link} alt={tags} />
      </div>
    </div>,
    modalRoot
  );
};
Modal.propTypes = {
  link: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default Modal;
