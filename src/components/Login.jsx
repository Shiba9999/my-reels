import React, { useState, useContext, useEffect } from 'react';
import { Link } from "react-router-dom";
import "./Login.css"
import auth from '../firebase';
import {useHistory} from "react-router-dom"

function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [loader, setLoader] = useState(false);
  
    const history=useHistory()
    const handleSubmit = async (e) => {
        // alert(email + password);
        e.preventDefault();
        try {
            // async 
            setLoader(true);
          auth.signInWithEmailAndPassword(email,password).then((authUser)=>{
                localStorage.setItem("isSignin",true);
                history.push("/")
                console.log(authUser);
            
          })
            setLoader(false);
            history.push("/");
        } catch (err) {
            setError(true);
            setLoader(false);
            setEmail("");
            setPassword("");
        }

    }

    return (
        <>

        <div className="loginScreen">
            <form className=" all__container">
                <div className="image__container" >
                    <img
                     src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe1mXowQOoDhnVexElVo_B017a1E__nKe8Yw&usqp=CAU"
              
                    ></img>
                </div>
                <div className="top__container">
                    <input placeholder="Email" type="email"
                        onChange={ (e) => {
                            setEmail(e.target.value);
                        }}
                    ></input>
                    <input placeholder="password" type="passsword"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}

                    ></input>
                    <button type="submit" onClick={handleSubmit} disabled={loader} >Log in</button>
                </div>
                <div className="bottom__container">
                    <h4>
                        <span className="signupScreen__grey">  Don't have an account? </span>
                         <Link to="/signup">
                        <span className="signUpScreen__link"   > SignUp </span>
                        </Link>

                    </h4>
                </div>
            </form>

        </div>


    </>

    )
}







export default Login;

