import React from 'react';
import './Player.css';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import RepeatIcon from '@material-ui/icons/Repeat';
import track from '../../media/track.png';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import Axios from 'axios';
import Cookies from 'universal-cookie';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';

const cookie = new Cookies();

class Player extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            Paused : true,
            volume : 50,
            progress : 0,
            isPlaying: false
        }
    }
    componentDidMount(){
        Axios.get('https://api.spotify.com/v1/me/player/currently-playing',{
            headers:{
                'Authorization' : 'Bearer ' + cookie.get('Spotify_token'),
            }
        }).then((res)=>{
            // console.log(res);
            this.setState({
                isPlaying : res.is_playing
            })
        }).catch((err)=>{
            console.log(err.message);
        })
        
    }
    handleClick(e){
        
        var pause = this.state.Paused;
        this.setState({
            Paused : !pause,
        });
        if(!this.state.Paused){
            const params = {
                "uris" : this.props.currently_playing_songUri
            }
            const device_id = "e13c3d1079366711e539af09518d42bf6ac88d98";
            const url = `https://api.spotify.com/v1/me/player/pause?q=${device_id}`;
            Axios.put(url,params,{
                headers:{
                    'Authorization' : 'Bearer ' + cookie.get('Spotify_token'),
                }
            }).then((res)=>{
                console.log(res);
                this.setState({
                    isPlaying : false
                })
            }).catch((err)=>{
                console.log(err.message);
            })
        }
        else{
            const params = {
                "uris" : [this.props.currently_playing_songUri]
            }
            const device_id = "e13c3d1079366711e539af09518d42bf6ac88d98";
            const url = `https://api.spotify.com/v1/me/player/play?q=${device_id}`;
            Axios.put(url , params , {
                headers:{
                    'Authorization' : 'Bearer ' + cookie.get('Spotify_token'),
                }
            }).then((res)=>{
                console.log(res);
                this.setState({
                    isPlaying : true
                })
            }).catch((err)=>{
                console.log(err.message);
            })
        }
    }
    handleChange(event,value){
        this.setState({
            volume:value
        });
        const params = {
            "uris" : [this.props.currently_playing_songUri]
        }
        Axios.put(`https://api.spotify.com/v1/me/player/volume?volume_percent=${this.state.volume}`,params,{
            headers:{
                'Authorization' : 'Bearer ' + cookie.get('Spotify_token'),
            }
        }).then((res)=>{
            console.log(res);
        }).catch((err)=>{
            console.log(err.message);
        })
    }
    nextSong(){
        
        const device_id = "e13c3d1079366711e539af09518d42bf6ac88d98";
        const url = `https://api.spotify.com/v1/me/player/next?q=${device_id}`;
        Axios.post(url, {
            headers:{
                'Authorization' : 'Bearer ' + cookie.get('Spotify_token'),
            }
        }).then((res)=>{
            console.log(res.is_playing);
            
        }).catch((err)=>{
            console.log(err.message);
        })
    }
    handleChangeProps(){
        this.props.onNameChange();
    }
    render(){
        return(
            <div className = 'Player'>
                <div className = 'player_left' onClick = {this.handleChangeProps.bind(this)}>
                    {this.props.currently_playing !== "" ? 
                        <img src = {this.props.currently_playing} alt ="" width = '15%'/>
                        :<img src = {track} alt ="" width = '15%'/>}
                    <b className = 'trackname'>{this.props.currently_playing_name} {this.props.currently_playing_artist}</b>
                    
                </div>
                <div className = 'player_center'>
                        <ShuffleIcon className = 'shuffle controls'/>
                        <SkipPreviousIcon className = 'SkipPrev controls'/>
                        {!this.state.isPlaying ? <PlayCircleOutlineIcon fontSize = 'large' className = 'play' onClick = {this.handleClick.bind(this)}/> : <PauseCircleOutlineIcon className ='play' fontSize = 'large' onClick = {this.handleClick.bind(this)}/>}
                        <SkipNextIcon className = 'SkipNext controls' onClick = {this.nextSong}/>
                        <RepeatIcon className = 'repeat controls'/>
                        {/* <LinearProgress variant = 'buffer' value = {this.state.progress}/> */}
                </div>
                <div className = 'player_right'>
                    <Grid container spacing = {2} >
                        <Grid item><VolumeDownIcon/></Grid>
                        <Grid item sm><Slider value = {this.state.volume} onChange = {(event,value)=>this.handleChange(event,value)} aria-labelledby="continuous-slider"/></Grid>
                        <Grid item><VolumeUpIcon/></Grid>
                    </Grid>

                </div>
            </div>
        );
    }
}
export default Player;