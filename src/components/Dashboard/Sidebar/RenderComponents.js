import React from 'react';
import './Sidebar.css';

function Render({item , Icon}){
    return(
        <div className ='sidebaroption'>
            {Icon && <Icon className = 'rendericons'/>}
            {Icon ?<b>{item}</b> : <p>{item}</p>}
            
        </div>
    );
}

export default Render;