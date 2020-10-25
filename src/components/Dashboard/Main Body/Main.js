import React from 'react';
import './Main.css';
import Avatar from '@material-ui/core/Avatar';
import user from '../../media/user.png';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import Axios from 'axios';
import Cookies from 'universal-cookie';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const cookie = new Cookies();
class Main extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            anchor : false,
            response : [],
            search : "",
            search_response_tracks : [],
            search_response_albums : [],
            search_response_playlists : [],
            search_response_artists : [],
        }
    }
    componentDidMount(){
        Axios.get('https://api.spotify.com/v1/browse/featured-playlists' , {
            headers : {'Authorization' : 'Bearer ' + cookie.get('Spotify_token')}
        }).then((res)=>{
            this.setState({
                response : res.data.playlists.items
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
        Axios.get(`https://api.spotify.com/v1/search?q=${this.state.search}&type=album,artist,playlist,track&include_external=audio&limit=8`,{
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
        const playlists_data = this.state.response.map((tracks)=>{
            return(
                <img src = {tracks.images[0].url} className = 'col-12 col-sm-3 mt-4 tracks' alt =""/>
                
            );
        })
        const search_tracks = this.state.search_response_tracks.map((songs)=>{
            return(
                <div className = 'col-12 col-sm-3 mt-4 tracks search'>
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
                        className ='search'
                        id="input-with-icon-textfield"
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
                        <Avatar alt ="" src = {user} className = 'avatar'/><h5>{this.props.User}</h5>
                    </div>
                </div>
                <div className = 'rendering_playlists'>
                    {this.state.search.length < 2 ? playlists_data : search_tracks}
                    
                </div>

            </div>
        );
    }
}

export default Main;