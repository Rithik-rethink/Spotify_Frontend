import React from 'react';
import './Player.css';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import RepeatIcon from '@material-ui/icons/Repeat';
import track from '../../media/track.png';

class Player extends React.Component{
    render(){
        return(
            <div className = 'Player'>
                <div className = 'player_left'>
                    {this.props.currently_playing !== "" ? 
                        <img src = {this.props.currently_playing} alt ="" width = '15%'/>
                        :<img src = {track} alt ="" width = '15%'/>}
                    <b className = 'trackname'>{this.props.currently_playing_name}</b><br></br>
                    <p>{this.props.currently_playing_aritist}</p>
                </div>
                <div className = 'player_center'>
                    <ShuffleIcon/>
                    <SkipPreviousIcon/>
                    <PlayCircleOutlineIcon fontSize = 'large'/>
                    <SkipNextIcon/>
                    <RepeatIcon/>
                </div>
                <div className = 'player_right'>
                </div>
            </div>
        );
    }
}
export default Player;