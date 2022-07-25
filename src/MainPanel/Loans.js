function Loans(props) {
    return (
        (Object.keys(props.loans).length !== 0) &&
        props.loans.map((loan) => {
            return <Loan key={loan.id} loan={loan} />
        })
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
    );
}

export default Loans
