import React, { useEffect, useState, useContext } from 'react'
import {auth,storage, firestore, database} from '../firebase';
import { Link } from 'react-router-dom';
import {useHistory} from "react-router-dom"


import "./Signup.css"
function Signup(props) {
    const [email, setEmail] = useState("");
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [loader, setLoader] = useState(false);
    const [file, setFile] = useState(null);
    const history=useHistory()
    function handlFileSubmit(e) {
        let file = e?.target?.files[0];
        if (file != null) {
            // console.log(e.target.files[0])
            setFile(e.target.files[0]);
        }
    }

    
    async function handleSignup(e) {
        e.preventDefault();
        try{
            setLoader(true);
            auth.createUserWithEmailAndPassword(email,password).then((authUser)=>{
                console.log(authUser)
              let uid=authUser.user.uid;
                console.log(uid);

                const fileUpload=storage.ref(`/users/${uid}/profileImage`).put(file);
                fileUpload.on("state_changed",fn1,fn2,fn3);
                function fn1(snapshot) {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progress);
                }
                function fn2(error) {
                    setError(error);
                    setLoader(false);
                }
                async function fn3() {
                    // link get 
                    let downloadurl = await fileUpload.snapshot.ref.getDownloadURL();
                    database.users.doc(uid).set({
                        email: email,
                        userId: uid,
                        username,
                        createdAt: database.getUserTimeStamp(),
                        profileUrl: downloadurl,
                        postIds:[]
                    })
                    setLoader(false);
                    history.push("/login")
                }

                setEmail("");
                setPassword("")
            })

        }
        catch(err){
            setError("");
            setLoader(false);
        }
     
    }
    return (
        <div className="signup__screen">
            <form onSubmit={handleSignup} className="main__container">

                <div className="top__container">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe1mXowQOoDhnVexElVo_B017a1E__nKe8Yw&usqp=CAU"></img>
      
                    <h3>Sign up To see photos and videos.</h3>

                </div>

                <div className="mid__container">


                    <input type="text" value={username} placeholder="username"
                        onChange={(e) => { setUserName(e.target.value) }} />

                    <input type="email" value={email} placeholder="email"
                        onChange={(e) => { setEmail(e.target.value) }} />


                    <input type="password" placeholder="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}></input>

                    <div className="button__container">
                     
                            <input type="file" id="actual-btn" 
                             onChange={(e) => { handlFileSubmit(e) }}
                            hidden/>
                            <label for="actual-btn">Upload Profile Image</label>
                    </div>

                    <button type="submit" disabled={loader}>Signup</button>

                    <h3>By signing up you agree to our terms ,Data policy</h3>

                </div>
                <div className="footer">
                    <h3> Have an account? 
                          <Link to="login">
                          <span>LOGIN</span>
                          </Link>
                          
                         
                       
                    </h3>

                </div>

            </form>
        </div>
    )
}
export default Signup
