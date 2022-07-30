import "./Admin.css"
import { useState } from "react"
import Loans from "../Loans"


function AdminPanel() {
    const [switcher, setSwitcher] = useState(null)

    return (
        <>
            <h2 className="header">Admin panel</h2>

            {!switcher &&
                <div className="flex-fill-rest">
                    <div className="admin-buttons-ctn">
                        <button onClick={ ()=>{setSwitcher("LOANS")} }>Długi</button>
                        <button onClick={ ()=>{setSwitcher("USERS")} }>Użytkownicy</button>
                    </div>
                </div>
            }

            { (switcher === "LOANS") && <LoansPanel /> }

            {switcher &&
                <button onClick={ ()=>{setSwitcher(null)} } className="back-button">WRÓĆ</button>
            }
        </>
    )
}

function LoansPanel() {
    return (
        <>
            <Loans admin={true} />
        </>
    )
}

export default AdminPanel
