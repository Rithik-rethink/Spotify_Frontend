import React from 'react';
import './Main.css';
import Avatar from '@material-ui/core/Avatar';
import user from '../../media/user.png';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import Axios from 'axios';
import Cookies from 'universal-cookie';

const cookie = new Cookies();
class Main extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            anchor : false,
            search : "",
            search_response_tracks : [],
            search_response_albums : [],
            search_response_playlists : [],
            search_response_artists : [],
            single_response : [],
            album_response : []
        }
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

    play(url){
        this.audio = new Audio(url);
        this.audio.play();
    }
    pause(){
        this.audio.pause();
    }


    render(){
        const playlists_data = this.props.Response.map((tracks)=>{
            return(
                <div className = 'col-12 col-sm-3 mt-2 tracks search'>
                    <img src = {tracks.images[0].url} alt ="" width = '100%'/> 
                    <b>{tracks.name}</b><br></br>
                    <b>{tracks.artists[0].name}</b><br></br>
                </div>
                
            );
        })
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
                        this.props.onNameChange(songs.album.images[0].url , songs.album.name , songs.artists[0].name , songs.uri , false, "Track",songs.artists[0].id);
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

        // const search_albums = this.state.search_response_albums.map((albums)=>{
        //         return(
        //             <img src = {albums.images[0].url} alt = "" className = 'col-12 col-sm-3 mt-4 tracks' width = '10%'/>
        //         );
        //     })
        // const seach_artists = this.state.search_response_artists.map((artists)=>{
        //         return(
        //             <img src = {artists.images[0].url} alt = "" className = 'col-12 col-sm-4' width = '10%'/>
        //         );
        //     })
        // const search_playlists = this.state.search_response_playlists.map((playlists)=>{
        //         return(
        //             <img src = {playlists.images[0].url} alt = "" className = 'col-12 col-sm-3' width = '10%'/>
        //         );
        //     })
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
                        <Avatar alt ="" src = {user} className = 'avatar'/><h5 className = 'name'>{this.props.User}</h5>
                    </div>
                </div>
                <div className = 'rendering_playlists'>
                    {this.state.search.length < 2 ?
                        <div>
                        <h1 className = 'new_release'>New Releases</h1>
                            {playlists_data} 
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

export default Main;