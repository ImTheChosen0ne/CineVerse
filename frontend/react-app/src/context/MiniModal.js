import React, {useRef, useState, useContext} from 'react';
import ReactDOM from 'react-dom';
import './MiniModal.css';

const MiniModalContext = React.createContext();

export function MiniModalProvider({children}) {
    const modalRef = useRef();
    const [modalContent, setModalContent] = useState(null);
    // callback function that will be called when modal is closing
    const [onModalClose, setOnModalClose] = useState(null);

    const closeMiniModal = () => {
        setModalContent(null); // clear the modal contents
        // If callback function is truthy, call the callback function and reset it
        // to null:
        if (typeof onModalClose === 'function') {
            setOnModalClose(null);
            onModalClose();
        }
    };

    const contextValue = {
        modalRef, // reference to modal div
        modalContent, // React component to render inside modal
        setModalContent, // function to set the React component to render inside modal
        setOnModalClose, // function to set the callback function called when modal is closing
        closeMiniModal // function to close the modal
    };

    return (
        <>
            <MiniModalContext.Provider value={contextValue}>
                {children}
            </MiniModalContext.Provider>
            <div ref={modalRef}/>
        </>
    );
}

export function MiniModal() {
    const {modalRef, modalContent, closeMiniModal} = useContext(MiniModalContext);
    // If there is no div referenced by the modalRef or modalContent is not a
    // truthy value, render nothing:
    if (!modalRef || !modalRef.current || !modalContent) return null;

    // Render the following component to the div referenced by the modalRef
    return ReactDOM.createPortal(
        <div className="focus-trap-wrapper previewModal--wrapper mini-modal has-smaller-buttons">
            {/*<div id="mini-modal-background" onClick={closeModal} />*/}
            {/*<div id="mini-modal-content">*/}
                {modalContent}
            {/*</div>*/}
        </div>,
        modalRef.current
    );
}

export const useMiniModal = () => useContext(MiniModalContext);