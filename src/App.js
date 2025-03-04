import "./App.css";
import { useEffect, useState } from "react";
import { APIreq } from "./helpers";
import Title from "./Title";
import MainPanel from "./LoggedInComponents/MainPanel";

const ENTRY_DURATION = 1000
const ENDING_DURATION = 300


function App() {
  const [status, setStatus] = useState("LOADING")
  const [panel, setPanel] = useState({ show: false, admin: false })

  useEffect(() => {
    APIreq({
      url: "/amilogged",
      method: "GET"
    }, (status, result) => {
      if (status !== 200) {
        console.log(status, result)
        setStatus("NOT_LOGGED_IN")
        return
      }
      console.log("AUTH: ok")
      setStatus("LOGGED_IN")
      setTimeout(() => {
        setPanel({
          show: true,
          admin: result.admin
        })
      }, ENTRY_DURATION + ENDING_DURATION);
    })
  }, [])
  
  return (
    <>
      <Title status={status} entryDuration={ENTRY_DURATION} endingDuration={ENDING_DURATION} />
      {panel.show ?
        <MainPanel admin={panel.admin} /> : <LoginContainer />
      }
    </>
  );
}


function LoginContainer() {
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const handleShowForm = (e) => {
      if (e.altKey && e.key === "l") {
        //if (!showForm) setShowForm(true)
        setShowForm(!showForm)
      }
    }
    window.addEventListener("keydown", handleShowForm)
    return () => {
      window.removeEventListener("keydown", handleShowForm)
    }
  }, [showForm])

  return (
      showForm ? <LoginForm /> : "" 
  )
}


function LoginForm() {
  const handleSubmit = (e) => {
    e.preventDefault()
    const login = e.target.login.value
    const password = e.target.password.value
    const rememberme = e.target.rememberme.checked
    APIreq({
      url: "/login",
      method: "POST",
      body: {
        login: login,
        password: password,
        rememberMe: rememberme
      }
    }, (status, result) => {
      if (status !== 200) {
        console.log(status, result)
        return
      }
      window.location.reload()
    })
  }

  return (
    <div className="login-form">
      <h2>LOGIN</h2>
      <form onSubmit={handleSubmit}>
        <p>
          <span>Login: </span>
          <input type="text" name="login" />
        </p>
        <p>
          <span>Password: </span>
          <input type="password" name="password" />
        </p>
        <p>
          <span>Remember me: </span>
          <input type="checkbox" name="rememberme" />
        </p>
        <input type="submit" value="OK" />
      </form>
    </div>
  )
}

export default App;
