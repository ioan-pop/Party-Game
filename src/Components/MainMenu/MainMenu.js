import React, {useState, useEffect, useRef} from 'react';
import styles from './MainMenu.module.css';
import db from '../../Utilities/db';
import { v4 as uuid } from 'uuid';
import { withRouter } from 'react-router-dom';

let mounted = true;

function MainMenu(props) {
    const [stage, setStage] = useState();
    const [stageData, setStageData] = useState(
        <div className={styles.MainMenuButtons}>
            <button onClick={() => setStage('create')}>Create Game</button>
            <button onClick={() => setStage('join')}>Join Game</button>
        </div>
    );
    const [title, setTitle] = useState('Main Menu');
    const [gameID, setGameID] = useState();
    const [gameMetaData, setGameMetaData] = useState();
    const [myID, setMyID] = useState();

    const createNameEl = useRef(null);
    const joinNameEl = useRef(null);
    const gameIDEl = useRef(null);

    useEffect(() => {
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        let createGame = () => {
            // Converts the date to an int and converts it to base 36, to make it as short as possible
            let gameID = (+new Date()).toString(36);
            let playerID = uuid();
    
            db().createGame(gameID, { name: createNameEl.current.value, id: playerID });
            db().getMetaUpdates(gameID, gameLobbyUpdate);
    
            setGameID(gameID);
            setStage('lobby');
            setMyID(playerID);
            sessionStorage.setItem('playerID', playerID);
        };
    
        let joinGame = () => {
            let playerID = uuid();
    
            db().joinGame(gameIDEl.current.value, { name: joinNameEl.current.value, id: playerID })
            db().getMetaUpdates(gameIDEl.current.value, gameLobbyUpdate);
            
            setGameID(gameIDEl.current.value);
            setStage('lobby');
            setMyID(playerID);
            sessionStorage.setItem('playerID', playerID);
        };
    
        let gameLobbyUpdate = (gameMD) => {
            if(mounted) {
                setGameMetaData(gameMD);
            }
        };

        let startGame = () => {
            db().startGame(gameID);
            props.history.push('/game/' + gameID);
        };

        switch(stage) {
            case 'create':
                setTitle('Create Game');
                setStageData(
                    <div>
                        Your Name
                        <input ref={createNameEl} />
                        <button onClick={createGame}>Create Game</button>
                    </div>
                );
                break;
            case 'join':
                setTitle('Join Game');
                setStageData(
                    <div>
                        Game ID
                        <br/>
                        <input ref={gameIDEl} />
                        Your Name
                        <br/>
                        <input ref={joinNameEl} />
                        <button onClick={joinGame}>Join Game</button>
                    </div>
                );
                break;
            case 'lobby':
                setTitle('Lobby');
                setStageData(
                    <div>
                        {
                            gameID ? (
                                <div>
                                    Game ID
                                    <div style={{fontSize: "50px", marginTop: "10px"}}>{gameID}</div>
                                </div>
                            ) : null
                        }
                        <div className="blurredBackground">
                            <h3>Players ({(gameMetaData && gameMetaData.players.length) || '-'})</h3>
                            {
                                gameMetaData ? (
                                    <ul style={{listStyleType: "none", padding: "0px"}}>
                                        {gameMetaData.players.map(player => (
                                            <li style={{marginTop: "15px"}} key={player.id}>
                                                {player.name}
                                                {
                                                    player.id === myID ? <span> (You)</span> : 
                                                    (player.id === gameMetaData.hostID ? <span> (Host)</span> : null)
                                                }
                                            </li>
                                        ))}
                                    </ul>
                                ) : <div>Loading...</div>
                            }
                        </div>
                        {
                            gameMetaData && (myID === gameMetaData.hostID) ? 
                            <button onClick={startGame}>Start Game</button> : 
                            <div>Waiting for host to start game</div>
                        }
                    </div>
                );
                break;
            default:
                break;
        }

        return () => {
            // If a player is in the lobby and the game has started, route to the game page
            if(stage === 'lobby' && gameMetaData && gameMetaData.startedAt) {
                props.history.push('/game/' + gameID);
            }
        };
    }, [stage, gameID, gameMetaData, myID, props.history]);

    return (
        <div>
            <h1 className={styles.MainMenuTitle}>
                {title}
            </h1>
            {stageData}
        </div>
    );
}

export default withRouter(MainMenu);