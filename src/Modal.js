import ReactDOM from "react-dom";

function Modal({open, setOpen, children}) {
    return ReactDOM.createPortal(
        open && <div className="modal-background">
            <div className="modal-ctn">
                {setOpen && <button onClick={()=>{setOpen(false)}}>X</button>}
                {children}
            </div>
        </div>,
        document.getElementById("root")
    )
}

export default Modal
