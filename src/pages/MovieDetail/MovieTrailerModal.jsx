import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import YouTube from 'react-youtube';
import './MovieTrailerModal.style.css';

export default function MovieTrailerModal({ show, onHide, videoKey }) {
  const opts = {
    height: '480',
    width: '100%',
    playerVars: { autoplay: 1 },
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      dialogClassName="trailer-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>예고편</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {videoKey ? (
          <div className="youtube-iframe-wrapper">
            <YouTube videoId={videoKey} opts={opts} />
          </div>
        ) : (
          <p>예고편을 불러올 수 없습니다.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
