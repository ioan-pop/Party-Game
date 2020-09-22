import React, {useState, useEffect} from 'react';
import db from '../../Utilities/db';

function PostGame(props) {
    const [leaderboardList, setLeaderboardList] = useState();

    useEffect(() => {
        let getGameID = () => {
            let pathNameSplit = props.location.pathname.split('/');
            let gameID = pathNameSplit[pathNameSplit.length - 1];
            return gameID;
        }
        
        db().getMetaUpdates(getGameID(), gameDataChange);
    }, [props.location.pathname]);

    let gameDataChange = (gameData) => {
        let sortedByPoints = gameData.players.sort((a,b) => (b.points === undefined) ? -1 : (b.points - a.points));

        setLeaderboardList(sortedByPoints);
    };

    return (
        <div>
            <h1>Post Game Lobby</h1>
            <div>
                Winner: <span style={{fontWeight: 700}}>{leaderboardList ? leaderboardList[0].name : '-'}</span>
            </div>
            <div className="blurredBackground">
                <h3>Leaderboard</h3>
                {
                    leaderboardList ?
                    (
                        <ul style={{listStyleType: "none", padding: "0px"}}>
                            {leaderboardList.map((player, index) => (
                                <li style={{marginTop: "15px"}} key={player.id}>
                                    {index + 1}. {player.name} ( {player.points ? player.points : 0} point{player.points === 1 ? '' : 's'} )
                                </li>
                            ))}
                        </ul>
                    ) :
                    <div style={{marginBottom: "30px"}}>Loading Player List...</div>
                }
            </div>
        </div>
    );
};

export default PostGame;