import { useEffect } from "react";
import { createContext } from "react";
import { useContext } from "react";
import { useState } from "react";
import { APIheaders } from "../helpers"
import Modal from "../Modal";

const LoansContext = createContext()

function Loans({admin = false}) {
    const [loans, setLoans] = useState([])

    const fetchLoans = () => {
        const url = "/api/money" + (admin ? "" : "/myloans")
        fetch(url, {
            headers: APIheaders,
            method: "GET"
        })
        .then(res => {
            res.json().then(body => {
                if (res.status === 200) {
                    setLoans(body)
                }
            })
        })
    }

    useEffect(() => {
        fetchLoans()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [admin])


    const [showLoanModal, setShowLoanModal] = useState(false)

    const handleAddLoan = (e) => {
        e.preventDefault()
        
        fetch("/api/money", {
            headers: APIheaders,
            method: "POST",
            body: JSON.stringify({
                amount: e.target.form.amount.value,
                name: e.target.form.name.value,
                creditorID: 1,
	            borrowerID: 2
            })
        })
        .then(res => {
            res.json().then(body => {
                if (res.status === 200) {
                    fetchLoans()
                    setShowLoanModal(false)
                } else {
                    console.log(res.status, body)
                }
            })
        })
    }

    return (
        <LoansContext.Provider value={[loans, setLoans]}>
            {admin &&
                <div className="loan-admin-header">
                    <button onClick={() => {setShowLoanModal(true)}}>dodaj</button>
                    <Modal open={showLoanModal} setOpen={setShowLoanModal}>
                        <h2>Dodaj dług</h2>
                        <form>
                            <p>Nazwa:</p>
                            <input type="text" name="name" />
                            <p>Wartość:</p>
                            <input type="text" name="amount" />
                            <br /><br /><br /><br /><br />
                            <input onClick={handleAddLoan} type="submit" value="Dodaj" />
                        </form>
                    </Modal>
                </div>
            }
            <div className="flex-fill-rest">
                {(Object.keys(loans).length !== 0) &&
                    loans.map((loan) => {
                        return <Loan key={loan.id} loan={loan} admin={admin} />
                    })
                }
            </div>
        </LoansContext.Provider>
    )
}

function Loan(props) {
    const [expand, setExpand] = useState(false)

    const handleShowAdmin = () => {
        setExpand(!expand)
    }

    return (
        <div className="loan">
            <div className={`loan-info ${expand ? "select" : ""}`}>
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
                {props.admin &&
                    <div className="loan-admin-icon" onClick={handleShowAdmin}>
                        X
                    </div>
                }
            </div>
            {props.admin &&
                <AdminEdit show={expand} id={props.loan.id} />
            }
        </div>
    );
}

function AdminEdit({id, show}) {
    const [loans, setLoans] = useContext(LoansContext)

    const handleSubmitUpdate = (e) => {
        e.preventDefault()
        
        fetch("/api/money/"+id, {
            headers: APIheaders,
            method: "PATCH",
            body: JSON.stringify({
                amount: e.target.form.amount.value,
                name: e.target.form.name.value
            })
        })
        .then(res => {
            res.json().then(body => {
                if (res.status === 200) {
                    setLoans(loans.map(loan => {
                        if (loan.id === id) {
                            loan.name = e.target.form.name.value
                            loan.amount = parseFloat(e.target.form.amount.value).toFixed(2)
                            return loan
                        }

                        return loan
                    }))
                } else {
                    console.log(res.status, body)
                }
            })
        })
    }

    const handleSubmitDelete = (e) => {
        e.preventDefault()
        
        fetch("/api/money/"+id, {
            headers: APIheaders,
            method: "DELETE"
        })
        .then(res => {
            res.json().then(body => {
                if (res.status === 200) {
                    setLoans(loans.filter(loan => loan.id !== id))
                } else {
                    console.log(res.status, body)
                }
            })
        })
    }

    return (
        <div className={`loan-admin-ctn ${show ? "show" : ""}`}>
            <div className="controls">
                <form id={id}>
                    <div className="item">
                        <p>Nazwa:</p>
                        <input type="text" name="name"/>
                    </div>
                    <div className="item">
                        <p>Ilość:</p>
                        <input type="text" name="amount"/>
                    </div>
                    <div className="item-break"></div>
                    <div className="item right">
                        <p>
                            <input onClick={handleSubmitDelete} type="submit" name="delete" value="Usuń" />
                        </p>
                        <p>
                            <input onClick={handleSubmitUpdate} type="submit" name="update" value="Zmień" />
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Loans
