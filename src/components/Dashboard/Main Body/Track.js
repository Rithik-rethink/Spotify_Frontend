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
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocalOfferRoundedIcon from '@material-ui/icons/LocalOfferRounded';
import QueueMusicRoundedIcon from '@material-ui/icons/QueueMusicRounded';

const cookie = new Cookies();

class Track extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            user : "",
            redirect_error : false,
            categories : [],
            Liked : false,
            search : "",
            search_response_tracks : [],
            search_response_albums : [],
            search_response_playlists : [],
            search_response_artists : [],
            single_response : [],
            album_response : [],
            currentArtist : {}
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
        Axios.get(`https://api.spotify.com/v1/artists/${this.props.currently_playing_artist_id}`, {
            headers : {'Authorization' : 'Bearer ' + cookie.get('Spotify_token')}
        }).then((res)=>{
            console.log(res.data);
            this.setState({
                currentArtist : res.data
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
    click(){
        var value = this.state.Liked;
        value = !value;
        this.setState({
            Liked : value
        })
    }
    play(url){
        this.audio = new Audio(url);
        this.audio.play();
    }
    pause(){
        this.audio.pause();
    }
    render(){
        if(this.state.redirect_error){
            return(
                <Redirect to = "/login"/>
            );
        }
        const search_tracks = this.state.search_response_tracks.map((songs)=>{
            return(
                <div className = 'col-12 col-sm-3 mt-4 tracks search' onClick = {this.handlePlayback=()=>{
                    this.audio.pause();
                    const params = {
                        "uris" : [songs.uri]
                    }
                    const device_id = "e13c3d1079366711e539af09518d42bf6ac88d98";
                    const url = `https://api.spotify.com/v1/me/player/play?q=${device_id}`;
                    Axios.put(url , params , {
                        headers:{
                            'Authorization' : 'Bearer ' + cookie.get('Spotify_token'),
                        }
                    }).then((res)=>{
                        this.props.onNameChange(songs.album.images[0].url , songs.album.name , songs.artists[0].name , songs.uri , false, "Track");
                    }).catch((err)=>{
                        console.log(err.message);
                    })
                }} onMouseOver = {this.play.bind(this,songs.preview_url)} onMouseOut = {this.pause.bind(this)}>
                    <img src = {songs.album.images[0].url}  alt =""  width = '100%'/>
                    <b>{songs.album.name}</b><br></br>
                    {songs.artists[0].name}
                </div>
            );
        })
        const artist = () =>{
            return(
                <div className = 'row'>
                                <div className = 'col-12 col-sm-3 mt-4'>
                                    <img alt ="" src = {this.state.currentArtist.images[0].url} width = '100%'/>
                                </div>
                                <div className = 'col-12 col-sm-9'>
                                    <h3>{this.state.currentArtist.name}</h3>
                                    <p>Followers:{this.state.currentArtist.followers.total}</p>
                                </div>
                            </div>
            );
        }
        return(
            <div className = 'Main track'>
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
                        <Avatar alt ="" src = {user} className = 'avatar'/><h5>{this.state.user}</h5>
                    </div>
                </div>
                <div className = 'rendering_playlists'>
                    {this.state.search.length < 2 ?
                        <div>
                            <div className = 'mt-5 row'>
                                <img src = {this.props.currently_playing} className = 'col-12 col-sm-3' alt = '' width = '100%'/>
                                <div className = 'col-12 col-sm-9 '>
                                    <h1><b>{this.props.currently_playing_name}</b></h1>
                                    <h3>{this.props.currently_playing_artist}</h3>
                                    {!this.state.Liked?<FavoriteBorderOutlinedIcon className = 'favIcon' onClick={this.click.bind(this)} />:<FavoriteIcon className = 'favIcon' onClick={this.click.bind(this)}/>}{" "}<span><LocalOfferRoundedIcon className ='facIcon'/></span>{" "}<QueueMusicRoundedIcon className = 'facIcon'/>
                                </div>
                            </div>
                            {artist}
                        </div>
                        :
                        <div className = 'mt-4'>
                            {search_tracks}
                        </div>
                    }
                    
                </div>
            </div>
        );
    }
}

export default Track;