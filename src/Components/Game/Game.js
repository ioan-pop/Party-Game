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
    const [gameMetaData, setGameMetaData] = useState();
    const [myTurn, setMyTurn] = useState(false);

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

        setGameMetaData(gameData);

        if(!countdownInterval) {
            startCountdown(gameData);
        }
        
        checkIfMyTurn(gameData);
    };

    let startCountdown = (gameData) => {
        let secondsDiffToEndOfTurn = parseInt((gameData.currentTurn.startTime / 1000 + gameData.turnTimeLimit) - +new Date()/1000);
        setCountdown(secondsDiffToEndOfTurn <= 0 ? 0 : secondsDiffToEndOfTurn);

        countdownInterval = setInterval(() => {
            setCountdown(prevState => prevState <= 0 ? 0 : prevState - 1);
        }, 1000);
    };

    let checkIfMyTurn = (gameData) => {
        let currentTurnPlayerID = gameData.currentTurn.player.id;
        let myID = sessionStorage.getItem('playerID');

        if (currentTurnPlayerID === myID) {
            setMyTurn(true);
            let questionIndex = Math.floor(Math.random() * (questionCards.length))
            db().setCurrentTurnQuestion(gameData.gameID, questionCards[questionIndex].data);
        }
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
                    <div className={styles.turnCounter}>
                        <span style={{fontWeight:300}}>Turns Left:</span> <span style={{fontWeight:900}}>{gameMetaData ? gameMetaData.turnsLeft : '-'}</span>
                    </div>
                    <div>
                        {myTurn ? 'Your' : ((gameMetaData ? gameMetaData.currentTurn.player.name : '-') + "'s")} turn
                        <div style={{marginTop: "25px", fontSize: "2em"}} className={countdown <= 5 ? 'redText' : null}>
                            {countdown}
                        </div>
                    </div>
                    <div className={styles.activeCard}>
                        <div className={styles.activeCardText}>
                            {gameMetaData && gameMetaData.currentTurn.question ? gameMetaData.currentTurn.question : 'Picking question...'}
                        </div>
                    </div>
                    <div className={styles.handHeader}>
                        {myTurn ? 'Player Answers' : 'Your Cards'}
                    </div>
                    <div className={styles.cardsHand}>
                        {
                            myTurn ?
                            (
                                gameMetaData.currentTurn.answers && gameMetaData.currentTurn.answers.length ? 
                                gameMetaData.currentTurn.answers.map((answer, index) => (
                                    <div key={index} className={styles.playerCard}>
                                        <div className={styles.playerCardText}>
                                            {answer}
                                        </div>
                                    </div>
                                )) : 
                                <div style={{width: "100%", marginTop: "20px"}}>Players are picking answers...</div>
                            ): (
                                playerCards ?
                                playerCards.map((card, index) => (
                                    <div key={index} className={styles.playerCard}>
                                        <div className={styles.playerCardText}>
                                            {card.data}
                                        </div>
                                    </div>
                                )) : <div style={{width: "100%", marginTop: "20px"}}>Loading your cards...</div>
                            )
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