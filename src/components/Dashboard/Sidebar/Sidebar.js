import React from 'react';
import './Sidebar.css';
import spotify from '../../media/spotify.svg';
import RenderComponents from './RenderComponents.js';
import HomeIcon from '@material-ui/icons/Home';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import PublicIcon from '@material-ui/icons/Public';
import Axios from 'axios';
import Cookies from 'universal-cookie';

const cookie = new Cookies();

class Sidebar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            categories : []
        }
    }
    componentDidMount(){
        Axios.get('https://api.spotify.com/v1/browse/featured-playlists' , {
            headers : {'Authorization' : 'Bearer ' + cookie.get('Spotify_token')}
        }).then((res)=>{
            this.setState({
                categories : res.data.playlists.items
            })
        }).catch((err)=>{
            console.log(err.message);
        })
    }
    Explore(event,element){
        // Axios.get('https://api.spotify.com/v1/browse/categories',{
        //     headers : {'Authorization' : 'Bearer ' + cookie.get('Spotify_token')}
        // }).then((res)=>{
        //     this.props.onNameChange(res.data.categories.items);
        // }).catch((err)=>{
        //     console.log(err.message);
        // })
        if(element === 'Home'){
            this.props.onNameChange('Home');
        }
        else if(element ==='Explore'){
            this.props.onNameChange('Browse');
        }
        else if(element === 'Library'){
            this.props.onNameChange('Library');
        }
    }
    render(){
        const print_categories = this.state.categories.map((cat)=>{
            return(
                <div className = 'categories mt-2'>
                    <img src = {cat.images[0].url} alt = '' width = '10%'/>
                    <b className = 'category_name'>{cat.name}</b>
                </div>
            );
        })
        return(
            <div className = 'sidebar'>
                <img src = {spotify} alt =""/>
                <span onClick = {(event)=>this.Explore(event,'Home')}><RenderComponents item = "Home" Icon = {HomeIcon}/></span>
                <span onClick = {(event)=>this.Explore(event,'Explore')}><RenderComponents item = "Explore" Icon = {PublicIcon}/></span>
                <span onClick = {(event)=>this.Explore(event,'Library')}><RenderComponents item = "Library" Icon = {LibraryMusicIcon}/></span>
                <br></br>
                <strong className = 'playlists_sidebar'>Featured Playlists</strong>
                <hr className = 'separator'/>
                <div className = 'scrollable'>{print_categories}</div>
            </div>
        );
    }
}

export default Sidebar;