// Import necessary dependencies and components
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditUserRoleModal = ({ showModal, handleCloseModal, handleSaveChanges, currentRole, newRole, setNewRole, userId }) => {
  const roleOptions = ['ผู้ใช้งาน', 'ลูกค้า', 'เจ้าของหอพัก', 'แอดมิน']; // Define available role options


  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>แก้ไขบทบาท</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>บทบาทปัจจุบัน: {currentRole}</p>
        <Form>
          <Form.Group controlId="formUserRole">
            <Form.Label>เลือกบทบาทใหม่</Form.Label>
            <Form.Control
              as="select"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          ปิด
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          บันทึกการเปลี่ยนแปลง
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUserRoleModal;
