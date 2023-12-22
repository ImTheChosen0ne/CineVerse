import React from 'react';
import { useMiniModal } from '../../context/MiniModal';

function OpenMiniModalButton({
    modalComponent, // component to render inside the modal
    buttonText, // text of the button that opens the modal
    onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
    onModalClose // optional: callback function that will be called once the modal is closed
    }) {
    const { setModalContent, setOnModalClose } = useMiniModal();

    const onClick = () => {
        if (onModalClose) setOnModalClose(onModalClose);
        setModalContent(modalComponent);
        if (onButtonClick) onButtonClick();
    };

    return (
        <button onClick={onClick}>{buttonText}</button>
    );
}

export default OpenMiniModalButton;