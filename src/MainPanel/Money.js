import { useEffect, useState } from "react"
import { APIreq } from "../helpers"
import Loans from "./Loans"

function Money() {
    const [loans, setLoans] = useState([])

    useEffect(() => {
        APIreq({
            url: "/money/myloans"
        }, (status, result) => {
            if (status !== 200) {
                console.log(status, result)
                return
            }
            setLoans(result)
        })
    }, [])
    
    return (
        <>
            <h2 className="header">Lista dlugow</h2>
            <div className="loans-container">
                <Loans loans={loans} />
            </div>
        </>
    )
}

export default Money
