import React from 'react'
import "./Video.css"

function Video(props) {

    const handlemute=(e)=>{
        e.preventDefault();
        e.target.muted=!e.target.muted;

    }

    return (
        <div className="division" >
              <video ref={props.videoRef} className="video-styles" muted autoPlay id={props.videoid} >
                  <source src={props.src} type="video/mp4"
                  onClick={handlemute}
                  > 
                  </source>
              </video>
              {props.name}
        </div>
    )
}

export default Video
