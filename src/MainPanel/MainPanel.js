import { useState, useEffect } from "react";
import Money from "./Money";

function MainPanel(props) {
    const [style, setStyle] = useState({})

    useEffect(() => {
        setTimeout(() => {
            setStyle({ opacity: 1 })
        }, 5);
    }, [])

    return (
        <div className="main-container">
            <div className="panel" style={style}>
                <Money />
            </div>
        </div>
    );
}

export default MainPanel;
