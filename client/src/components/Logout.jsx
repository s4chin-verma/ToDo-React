import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import arrow from '../assets/arrow.png'
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const navigate = useNavigate();
    const handleConfirm = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <>
            <img
                src={arrow}
                alt="Logout"
                onClick={handleShow}
                className="img-fluid"
                style={{ width: '2rem', height: '2rem', cursor: 'pointer' }}
            />
            <Modal show={show} onHide={handleClose} animation={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure want to logout</Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleConfirm}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

