import React, { useState, useEffect } from 'react';
import db from '../../Utilities/db';
import styles from './Game.module.css';
import { withRouter } from 'react-router-dom';

function Game(props) {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [questionCards, setQuestionCards] = useState();
    const [answerCards, setAnswerCards] = useState();
    const [countdown, setCountdown] = useState();
    const [playerCards, setPlayerCards] = useState();

    let countdownInterval = undefined;

    useEffect(() => {
        // TODO: Check local storage for game id and connect them to it if game is active
        let promises = [];

        promises.push(new Promise((resolve, reject) => {
            db().getQuestionCards().then(result => {
                setQuestionCards(result);
                resolve();
            });
        }));
        
        promises.push(new Promise((resolve, reject) => {
            db().getAnswerCards().then(result => {
                setAnswerCards(result);
                resolve();
            });
        }));
        
        Promise.all(promises).then(() => {
            setDataLoaded(true);
            startCountdown();
        });

        return () => {
            clearInterval(countdownInterval);
        };
    }, []);

    useEffect(() => {
        if(dataLoaded) {
            db().getMetaUpdates(getGameID(), gameDataChange);
        }
    }, [dataLoaded]);

    let gameDataChange = (gameData) => {
        let firstNoCardPlayerIndex = gameData.players.findIndex(playerData => playerData.cards === undefined);
        let playerID = sessionStorage.getItem('playerID');
        let currentPlayerIndex = gameData.players.findIndex(playerData => playerData.id === playerID);
        
        // If someone still needs to draw cards, and that someone is me, then draw the cards and set them
        if ((firstNoCardPlayerIndex !== -1) && (gameData.players[firstNoCardPlayerIndex].id === playerID)) {
            // Gets 5 random cards from the answerCards array
            let playersHand = [...answerCards].sort(() => Math.random() - Math.random()).slice(0, 5);
            db().setCards(getGameID(), playerID, playersHand);
        }

        if (gameData.players[currentPlayerIndex].cards) {
            setPlayerCards(gameData.players[currentPlayerIndex].cards);
        }
    };

    let startCountdown = () => {
        setCountdown(60);

        countdownInterval = setInterval(() => {
            setCountdown(prevState => prevState <= 0 ? 0 : prevState - 1);
        }, 1000);
    };

    let getGameID = () => {
        let pathNameSplit = props.location.pathname.split('/');
        let gameID = pathNameSplit[pathNameSplit.length - 1];
        return gameID;
    }

    return (
        <div>
            <h1>Game</h1>
            {dataLoaded ? (
                <div>
                    <div>
                        Bob's turn
                        <div style={{marginTop: "25px", fontSize: "2em"}} className={countdown <= 5 ? 'redText' : null}>
                            {countdown}
                        </div>
                    </div>
                    <div className={styles.activeCard}>
                        <div className={styles.activeCardText}>
                            Test Question
                        </div>
                    </div>
                    <div className={styles.playerHand}>
                        {
                            playerCards ?
                            playerCards.map((card, index) => (
                                <div key={index} className={styles.playerCard}>
                                    <div className={styles.playerCardText}>
                                        {card.data}
                                    </div>
                                </div>
                            )) : <div style={{width: "100%"}}>Loading your cards...</div>
                        }
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default withRouter(Game);