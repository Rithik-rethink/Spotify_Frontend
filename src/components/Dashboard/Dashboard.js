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
            currently_playing_artist : "" 
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
        let _token = hash.access_token;
        if (_token) {
        // Set token
            this.setState({
                token: _token,
                token_present : true
            });
            cookie.set('Spotify_token' , _token , { path : '/'});
        }
    }
    onChange(newName , TrackName , Trackartist){
        this.setState({
            currently_playing : newName,
            currently_playing_name : TrackName,
            currently_playing_artist : Trackartist
        })
        console.log(this.state.currently_playing);
    }
    render(){
        if(this.state.redirect_error){
            return(
                <Redirect to = "/login"/>
            );
        }
        
        return(
            <div>

                {!cookie.get('Spotify_token')?<div className = 'spotify'>
                    <img src = {spotify} alt = '' width = '50%'/>
                    <a href = {`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}>Login with spotify</a>
                </div>:
                    <div className = 'dashboard'>
                        <div className = 'dashboard_body'>
                            <Sidebar/>
                            <Main User = {this.state.user} currently_playing = {this.state.currently_playing} currently_playing_name = {this.state.currently_playing_name} currently_playing_artist = {this.state.currently_playing_artist} onNameChange = {this.onChange.bind(this)}/>
                        </div>
                        <Player currently_playing = {this.state.currently_playing} currently_playing_name = {this.state.currently_playing_name} currently_playing_artist = {this.state.currently_playing_artist}/>
                    </div>
                }
            </div>
        );
        
    }
}

export default Dashboard;