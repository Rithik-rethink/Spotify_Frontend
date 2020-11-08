import React from 'react';
import './Dashboard.css';
import Axios from 'axios';
import {Redirect} from 'react-router-dom';
import Player from './Player/Player.js';
import Main from './Main Body/Main.js';
import Sidebar from './Sidebar/Sidebar.js';
import client from '../client_info.js';
import spotify from '../media/spotify.svg';
import Cookies from 'universal-cookie';
import Browse from './Main Body/Browse.js';
import Library from './Main Body/Library';
import Track from './Main Body/Track.js';

const authEndpoint = client.authEndpoint;
const clientId = client.CLIENT_ID;
const redirectUri = client.redirectURI;
const scopes = client.scopes
// Get the hash of the url
const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function(initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
window.location.hash = "";
const cookie = new Cookies();

class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show_page : false,
            redirect_error : false,
            token : "",
            token_present : false,
            user : "",
            currently_playing : "",
            currently_playing_name : "",
            currently_playing_artist : "" ,
            currently_playing_songUri : "",
            response : [],
            isPaused : true,
            isPlaying:false,
            currentPage : 'Home',
            currently_playing_artist_id : "",
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
        Axios.get('http://localhost:8080/api/user/currentPlayingFetch', {withCredentials: true}).then((res)=>{
            // console.log(res);
            this.setState({
                currently_playing : res.data.url,
                currently_playing_name : res.data.name,
                currently_playing_artist : res.data.artist,
                currently_playing_songUri : res.data.songUri,
                currently_playing_artist_id : res.data.songId
            })
        }).catch((err)=>{
            console.log(err.message);
        })
        let _token = hash.access_token;
        if (_token) {
        // Set token
            this.setState({
                token: _token,
                token_present : true
            });
            cookie.set('Spotify_token' , _token , { path : '/'});
        }
        Axios.get('https://api.spotify.com/v1/browse/new-releases' , {
            headers : {'Authorization' : 'Bearer ' + cookie.get('Spotify_token')}
        }).then((res)=>{
            this.setState({
                response : res.data.albums.items
            })
        }).catch((err)=>{
            console.log(err.message);
        })
    }
    onChange(newName , TrackName , Trackartist ,SongLink , Paused , currentPage , id){
        Trackartist = "(" + Trackartist + ")";
        this.setState({
            currently_playing : newName,
            currently_playing_name : TrackName,
            currently_playing_artist : Trackartist,
            currently_playing_songUri : SongLink,
            isPaused : Paused,
            currentPage : currentPage,
            currently_playing_artist_id : id
        })
        let form_data = {
            'image':this.state.currently_playing,
            'title': this.state.currently_playing_name,
            'artist':this.state.currently_playing_artist,
            'songUri':this.state.currently_playing_songUri,
            'artistId':this.state.currently_playing_artist_id
        };
        const url = 'http://localhost:8080/api/user/currentPlaying';

        Axios.post(url,form_data,{
            headers: {
                'content-type': 'application/json'
            },
            withCredentials: true
        }).then((res)=>{
            console.log(res);
        }).catch((err)=>{
            console.log(err.message);
        })
        Axios.get('https://api.spotify.com/v1/me/player/currently-playing',{
            headers:{
                'Authorization' : 'Bearer ' + cookie.get('Spotify_token'),
            }
        }).then((res)=>{
            console.log(res);
            this.setState({
                isPlaying : res.is_playing
            })
        }).catch((err)=>{
            console.log(err.message);
        })
    }
    responseChange(page){
        this.setState({
            currentPage : page
        })
        console.log(this.state.currentPage);
    }
    onClickSong(){
        this.setState({
            currentPage : 'Track',
        })

    }
    NewClick(currentPage,img,name,artist,uri,artistId){
        this.setState({
            currentPage : currentPage,
            currently_playing : img,
            currently_playing_name : name ,
            currently_playing_artist : artist ,
            currently_playing_songUri : uri ,
            currently_playing_artist_id : artistId
        })
    }
    render(){
        if(this.state.redirect_error){
            return(
                <Redirect to = "/login"/>
            );
        }
        var body = <Main Response = {this.state.response} User = {this.state.user} currently_playing = {this.state.currently_playing} currently_playing_name = {this.state.currently_playing_name} currently_playing_artist = {this.state.currently_playing_artist} currently_playing_songUri = {this.state.currently_playing_songUri} isPaused = {this.state.isPaused} currentPage = {this.state.currentPage} currently_playing_artist_id = {this.state.currently_playing_artist_id} onNameChange = {this.onChange.bind(this)}/>
        
        if(this.state.currentPage === 'Home'){
            body = <Main Response = {this.state.response} User = {this.state.user} currently_playing = {this.state.currently_playing} currently_playing_name = {this.state.currently_playing_name} currently_playing_artist = {this.state.currently_playing_artist} currently_playing_songUri = {this.state.currently_playing_songUri} isPaused = {this.state.isPaused} currently_playing_artist_id = {this.state.currently_playing_artist_id} onNameChange = {this.onChange.bind(this)}/>
        }
        else if(this.state.currentPage === 'Browse'){
            body = <Browse/>
        }
        else if(this.state.currentPage === 'Library'){
            body = <Library currentPage = {this.state.currentPage} currently_playing = {this.state.currently_playing} currently_playing_name = {this.state.currently_playing_name} currently_playing_artist = {this.state.currently_playing_artist} currently_playing_songUri = {this.state.currently_playing_songUri} isPaused = {this.state.isPaused} currently_playing_artist_id = {this.state.currently_playing_artist_id}  onNameChange = {this.NewClick.bind(this)}/>
        }
        else if(this.state.currentPage === 'Track'){
            body = <Track Response = {this.state.response} User = {this.state.user} currently_playing = {this.state.currently_playing} currently_playing_name = {this.state.currently_playing_name} currently_playing_artist = {this.state.currently_playing_artist} currently_playing_songUri = {this.state.currently_playing_songUri} isPaused = {this.state.isPaused} currentPage = {this.state.currentPage} currently_playing_artist_id = {this.state.currently_playing_artist_id} onNameChange = {this.onChange.bind(this)}/>
        }
        return(
            <div>

                {!cookie.get('Spotify_token')?<div className = 'spotify'>
                    <img src = {spotify} alt = '' width = '50%'/>
                    <a href = {`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}>Login with spotify</a>
                </div>:
                    <div className = 'dashboard'>
                        <div className = 'dashboard_body'>
                            <Sidebar Response = {this.state.response} currentPage = {this.state.currentPage} onNameChange = {this.responseChange.bind(this)}/>
                            {/* {this.state.currentPage === 'Home' ? <Main Response = {this.state.response} User = {this.state.user} currently_playing = {this.state.currently_playing} currently_playing_name = {this.state.currently_playing_name} currently_playing_artist = {this.state.currently_playing_artist} currently_playing_songUri = {this.state.currently_playing_songUri} isPaused = {this.state.isPaused} onNameChange = {this.onChange.bind(this)}/>:<Browse/>} */}
                            {body}
                        </div>
                        <Player currently_playing = {this.state.currently_playing} currently_playing_name = {this.state.currently_playing_name} currently_playing_artist = {this.state.currently_playing_artist} currently_playing_songUri = {this.state.currently_playing_songUri} is_Playing = {this.state.isPlaying} onNameChange = {this.onClickSong.bind(this)}/>
                    </div>
                }
            </div>
        );
        
    }
}

export default Dashboard;