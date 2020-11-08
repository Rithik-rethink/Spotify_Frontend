import React from 'react';
import './Main.css';
import Axios from 'axios';
import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import user from '../../media/user.png';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import Avatar from '@material-ui/core/Avatar';


const cookie = new Cookies();

class Library extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user : "",
            redirect_error : false,
            categories : [],
            currentPage : 'Browse'
        }
        
    }
    componentDidMount(){
        Axios.get('http://localhost:8080/api/user/dashboard', {withCredentials: true}).then((res)=>{
            this.setState({
                show_page : true,
                user : res.data.name                
            })
        }).catch((err)=>{
            this.setState({
                redirect_error : true
            })            
        })
        Axios.get('https://api.spotify.com/v1/browse/categories',{
            headers : {'Authorization' : 'Bearer ' + cookie.get('Spotify_token')}
        }).then((res)=>{
            this.setState({
                categories : res.data.categories.items
            })
        }).catch((err)=>{
            console.log(err.message);
        })
    }
    handleChange(event){
        var value = event.currentTarget.value;
        var q = "";
        q = q + value;
        this.setState({
            search : q
        })
        Axios.get(`https://api.spotify.com/v1/search?q=${this.state.search}&type=album,artist,playlist,track&include_external=audio&limit=20`,{
            headers : {'Authorization' : 'Bearer ' + cookie.get('Spotify_token')}
        }).then((res)=>{
            this.setState({
                search_response_tracks : res.data.tracks.items,
                search_response_albums : res.data.albums.items,
                search_response_artists : res.data.artists.items,
                search_response_playlists : res.data.playlists.items
            })
        }).catch((err)=>{
            this.setState({
                search_response_tracks : [],
                search_response_albums : [],
                search_response_artists : [],
                search_response_playlists : []
            })
        })
    }
    render(){
        if(this.state.redirect_error){
            return(
                <Redirect to = "/login"/>
            );
        }
        
        const categories = this.state.categories.map((tracks)=>{
            return(
                <div className = 'col-12 col-sm-3 mt-2 tracks search' >
                    <img src = {tracks.icons[0].url} alt ="" width = '100%'/> 
                    <b>{tracks.name}</b><br></br>
                </div>
            );
        })
        return(
            <div className = 'Main'>
                <div className = 'row'>
                    <TextField
                        className ='search search_field'
                        id="input-with-icon-textfield"
                        variant='filled'
                        onChange = {(event)=>this.handleChange(event)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                            <SearchIcon className = 'icon'/>
                            </InputAdornment>
                        ),
                    }}
                    />
                    <div className = 'profile'>
                        <Avatar alt ="" src = {user} className = 'avatar'/><h5 className = 'name'>{this.state.user}</h5>
                    </div>
                </div>
                <div className = 'rendering_playlists mt-4'>
                    {categories}
                </div>
            </div>
        );
    }
}

export default Library;