import { useState, useEffect } from "react";
import AdminPanel from "./AdminPanel";
import Money from "./Money";

function MainPanel(props) {
    const [style, setStyle] = useState({})

    useEffect(() => {
        requestAnimationFrame(() => {
            setStyle({ opacity: 1 })
        });
    }, [])

    return (
        <div className="main-container">
            <div className="panel" style={style}>
                {props.admin ?
                    <AdminPanel /> :
                    <Money /> 
                }
            </div>
        </div>
    );
}

export default MainPanel;
