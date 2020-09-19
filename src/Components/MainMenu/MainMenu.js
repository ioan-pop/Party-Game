import React, {useState, useEffect, useRef} from 'react';
import styles from './MainMenu.module.css';
import db from '../../Utilities/db';
import { v4 as uuid } from 'uuid';
import { withRouter } from 'react-router-dom';

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
        let createGame = () => {
            // Converts the date to an int and converts it to base 36, to make it as short as possible
            let gameID = (+new Date()).toString(36);
            let playerID = uuid();
    
            db().createGame(gameID, { name: createNameEl.current.value, id: playerID });
            db().getMetaUpdates(gameID, gameLobbyUpdate);
    
            setGameID(gameID);
            setStage('lobby');
            setMyID(playerID);
        };
    
        let joinGame = () => {
            let playerID = uuid();
    
            db().joinGame(gameIDEl.current.value, { name: joinNameEl.current.value, id: playerID })
            db().getMetaUpdates(gameIDEl.current.value, gameLobbyUpdate);
    
            setStage('lobby');
            setMyID(playerID);
        };
    
        let gameLobbyUpdate = (gameMD) => {
            setGameMetaData(gameMD);
        };

        let startGame = () => {
            props.history.push('/game');
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
                        <div style={{backgroundColor: "rgba(255,255,255,0.1)", padding: "10px 0px", margin: "20px 0px"}}>
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
                            myID === gameMetaData.hostID ? <button onClick={startGame}>Start Game</button> : null
                        }
                    </div>
                );
                break;
            default:
                break;
        }
    }, [stage, gameID, gameMetaData, myID]);

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