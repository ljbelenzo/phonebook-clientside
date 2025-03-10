import React from "react";
import ReactDom from 'react-dom';
import { CSSTransition } from "react-transition-group";

import Backdrop from "./Backdrop";
import "./Modal.css"

const ModalOverlay = props => {
    const {children,footerClass,footer, className,style,headerClass,header,onSubmit,contentClass } = props;
    const content = (
        <div className={`modal ${className}`} style={style}>
            <header className={`modal__header ${headerClass}`}>
                <h2>{header}</h2>
            </header>
            <form onSubmit={onSubmit? onSubmit : (event) => event.preventDefault() }>
                <div className={`modal__content ${contentClass}`}>
                    {children}
                </div>
                <footer className={`modal_footer ${footerClass}`}>
                    {footer}
                </footer>
            </form>
        </div>
    );
    return ReactDom.createPortal(content, document.getElementById('modal-hook'));
};

const Modal = props => {
    const { show ,onCancel } = props;

    return (
        <React.Fragment>
            {show && <Backdrop onClick={onCancel}/>}
            <CSSTransition 
            in={show}
            mountOnEnter 
            unmountOnExit 
            timeout={400}
            classNames="modal"
            >
                <ModalOverlay {...props}/>
            </CSSTransition>
        </React.Fragment>
    );
};

export default Modal;