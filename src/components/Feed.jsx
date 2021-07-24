import React, { useState, useEffect,useRef } from 'react'
import { auth, storage, firestore, database } from '../firebase';
import "./Feed.css"
import { useHistory } from "react-router-dom"
import uuid from "react-uuid"
import Video from "./Video"
import Avatar from '@material-ui/core/Avatar';

import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

function Feed() {
    const videoRef = useRef()
    const history = useHistory();
    const [video, setVideo] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [userObj, setUserObj] = useState();
    const [currentUser, setCurrentuser] = useState();
    const [isLiked, setLiked] = useState(false);

    // console.log(currentUser.uid);

    async function signOut(e) {
        e.preventDefault();
        localStorage.removeItem("isSignin")
        history.push("/login")
        return await auth.signOut();

    }


    auth.onAuthStateChanged((user) => {
        if (user) {

            setCurrentuser(user);
            // console.log(currentUser);


        } else {
            // User not logged in or has just logged out.
            console.log("error occured");
        }
    });

    // console.log(user_id);

    function handlFileSubmit(e) {
        e.preventDefault();
        let file = e?.target?.files[0];
        if (file != null) {
            console.log(e.target.files[0])

        }
        const fileUpload = storage.ref(`/posts/${uuid()}`).put(file);

        function fn1(snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress);
        }
        const fn2 = () => {
            alert("There was an error in uploading");
            return;
        }

        function fn3() {
            fileUpload.snapshot.ref.getDownloadURL().then(async url => {
                let obj = {
                    comments: [],
                    likes: [],
                    url,
                    current_user_id: currentUser.uid,
                    createdAt: database.getUserTimeStamp()

                }

                let postObj = await database.posts.add(obj);
                //    await database.users.doc(user_id).update({
                //     postIds:[  postObj.id]
                //    })
            })


        }

        fileUpload.on("state_changed", fn1, fn2, fn3);

        //   const fileUpload=storage.ref(`/posts${uid}`)
    }

    useEffect(async () => {

        await database.users.onSnapshot(async snapshot => {
            setUserObj(snapshot.docs.map(doc => doc.data()));
        })
        // let dataObject =await database.users.doc(currentUser.uid).get();
        // setUserObj(dataObject.data());
        setPageLoading(false);


    }, []);

    // console.log(userObj);


    useEffect(async () => {

        await database.posts.onSnapshot(async snapshot => {
            let videoObj = snapshot.docs.map(doc => doc.data());
            let videoArr = [];

            for (let i = 0; i < videoObj.length; i++) {

                let videoUrl = videoObj[i].url

                let videoUserid = videoObj[i].current_user_id

                // console.log(videoUserid);

                let postId = snapshot.docs[i].id;

                // console.log(postId);

                let userObject = await database.users.doc(videoUserid).get();

                let profileUrl = userObject.data().profileUrl;

                // console.log(profileUrl);

                // console.log(userObject.data());
                let name = userObject.data().username;

                videoArr.push({
                    videoUrl,
                    videoUserid,
                    name,
                    profileUrl,
                    postId


                })

            }
            setVideo(videoArr);
            // console.log(video);


        })

    }, [])

   const callback = (entries)=>{
       const [entry] = entries;
       console.log(entry)
   }
      const options = {
          root : null,
          threshold:1,
          rootMargin : "0px"
      }
        useEffect(() =>{
            const observer = new IntersectionObserver(callback,options)
            if(videoRef.current) observer.observer(videoRef.current)
        }
        , [videoRef])

        const handleLiked = async (postId) => {
            console.log(postId);
            let postData = await database.posts.doc(postId).get();
            let postObject = postData.data();
            let likes = postObject.likes
            if (isLiked == false) {
                database.posts.doc(postId).update({
                    "likes": [...likes, currentUser.uid]
                })
            } else {
                let likes = postObject.likes.filter(iLikeuid => {
                    return iLikeuid != currentUser.uid;
                })
                database.posts.doc(postId).update({
                    "likes": likes
                })
            }

        }


        return (

            pageLoading == true ? <div>Loading</div> :

                <div className="all_content">
                    <div className="navbar" >
                        {/* {  userObj &&  <Avatar alt="Remy Sharp" src={userObj[0].profileUrl}/>} */}

                        {userObj && userObj.map((user) => {

                            return <Avatar alt="name" src={user.profileUrl} />
                        })}

                    </div>

                    <div className="up_sign" >

                        <div className="button__container">
                            <input type="file" id="actual-btn"
                                onChange={(e) => { handlFileSubmit(e) }}
                                hidden />
                            <label for="actual-btn">Upload File</label>
                        </div>

                        <button className="sign_out" onClick={signOut}>Signout</button>
                    </div>

                    <div className="reels">
                        {video.map((videoObj) => {
                            return <div className="video-Container">

                                <Video
                                videoRef = {videoRef}
                                    src={videoObj.videoUrl}
                                    videoid={videoObj.postId}
                                    userName={videoObj.name}
                                />
                                <FavoriteBorderIcon
                                    onClick={() => {
                                        { handleLiked(videoObj.postId) }
                                    }} />


                            </div>
                        })}

                    </div>
                </div>
        )
    }


    export default Feed
