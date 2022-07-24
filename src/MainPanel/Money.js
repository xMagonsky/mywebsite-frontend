import { useEffect, useState } from "react"
import { APIreq } from "../helpers"

function Money() {
    const [loans, setLoans] = useState([])

    useEffect(() => {
        APIreq({
            url: "/money/loans"
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
                {
                    loans.map((loan) => {
                        return <Loan key={loan.id} loan={loan} />
                    })
                }
            </div>
        </>
    )
}


function Loan(props) {
    return (
        <div className="loan">
            <div className="loan-info">
                <div className="loan-info-item">
                    <p className="loan-title">Nazwa:</p>
                    <p className="loan-desc">{props.loan.name}</p>
                </div>
                <div className="loan-info-item">
                    <p className="loan-title">Ilość:</p>
                    <p className="loan-desc">{props.loan.amount}</p>
                </div>
                <div className="loan-info-item">
                    <p className="loan-title">Data pożyczenia:</p>
                    <p className="loan-desc">{props.loan.created}</p>
                </div>
            </div>
        </div>
    )
}

export default Money
