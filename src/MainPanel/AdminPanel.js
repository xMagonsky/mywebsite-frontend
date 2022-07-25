import { useEffect } from "react"
import { useState } from "react"
import { APIreq } from "../helpers"
import Loans from "./Loans"
import "./Admin.css"


function AdminPanel() {
    const [switcher, setSwitcher] = useState(null)

    return (
        <>
            <h2 className="header">Admin panel</h2>
            <div className="admin-ctn">
                {!switcher &&
                    <div className="admin-buttons-ctn">
                        <button onClick={ ()=>{setSwitcher("LOANS")} }>Długi</button>
                        <button onClick={ ()=>{setSwitcher("USERS")} }>Użytkownicy</button>
                    </div>
                }
                { (switcher === "LOANS") && <LoansPanel /> }
            </div>
            { switcher && <button onClick={ ()=>{setSwitcher(null)} } className="back-button">WRÓĆ</button> }
        </>
    )
}

function LoansPanel() {
    const [loans, setLoans] = useState({})

    useEffect(() => {
        APIreq({
          url: "/money/1",
          method: "GET"
        }, (status, result) => {
            if (status !== 200) {
                console.log(status, result)
                return
            }
            setLoans(result)
        })
      }, [])

    return (
        <Loans loans={loans} />
    )
}

export default AdminPanel
