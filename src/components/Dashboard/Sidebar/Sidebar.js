import React from 'react';
import './Sidebar.css';
import spotify from '../../media/spotify.svg';
import RenderComponents from './RenderComponents.js';
import HomeIcon from '@material-ui/icons/Home';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import PublicIcon from '@material-ui/icons/Public';

class Sidebar extends React.Component{
    render(){
        return(
            <div className = 'sidebar'>
                <img src = {spotify} alt =""/>
                <a href ='/in' className = 'home'><RenderComponents item = "Home" Icon = {HomeIcon}/></a>
                <RenderComponents item = "Explore" Icon = {PublicIcon}/>
                <RenderComponents item = "Library" Icon = {LibraryMusicIcon}/>
                <RenderComponents item = "Create Playlists" Icon = {AddCircleOutlineIcon}/>
                
                <br></br>
                <strong className = 'playlists_sidebar'>Playlists</strong>
                <hr className = 'separator'/>

            </div>
        );
    }
}

export default Sidebar;