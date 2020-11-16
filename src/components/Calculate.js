import React from 'react';
import 'tachyons';
const Calculate = ({calculateTime}) =>{
  return(
    <div>
        <button style ={{width:'100px',height:'30px', backgroundColor:'whitesmoke',margin:' 20px 0px 0px 130px'}}onClick={calculateTime}>
         Show
        </button>
    </div>
  )
}


export default Calculate;