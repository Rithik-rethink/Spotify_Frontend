import React from 'react';
import './Player.css';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import RepeatIcon from '@material-ui/icons/Repeat';

class Player extends React.Component{
    render(){
        return(
            <div className = 'Player'>
                <div className = 'player_left'>
                    Song details
                    <FavoriteIcon/>
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