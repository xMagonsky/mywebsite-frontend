import { useState } from "react";
import "./Console.css";
import ConsoleContext from "./ConsoleContext";


function Console(props) {
    const [logs, setLogs] = useState([]);

    function consoleLog(message) {
        setLogs([...logs, message]);
    }

    return (
        <ConsoleContext.Provider value={consoleLog}>
            <div id="console">
                {
                    logs.map((log, index) => {
                        return <p key={index}>{log}</p>;
                    })
                }
            </div>
            {props.children}
        </ConsoleContext.Provider>
    );
}

export default Console;
