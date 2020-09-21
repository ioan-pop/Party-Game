import React, { useState, useEffect } from 'react';
import db from '../../Utilities/db';
import styles from './Game.module.css';
import { withRouter } from 'react-router-dom';
import Notification from '../Notification/Notification';
import usePrevious from '../UsePrevious/UsePrevious';

function Game(props) {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [questionCards, setQuestionCards] = useState();
    const [answerCards, setAnswerCards] = useState();
    const [countdown, setCountdown] = useState();
    const [playerCards, setPlayerCards] = useState();
    const [gameMetaData, setGameMetaData] = useState();
    const [myTurn, setMyTurn] = useState(false);
    const [canPickCard, setCanPickCard] = useState(true);
    const [notification, setNotification] = useState({text: ''});
    const [answers, setAnswers] = useState();
    const previousGameMetaData = usePrevious(gameMetaData);

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

    useEffect(() => {
        if ((countdown <= 0) && (gameMetaData.currentTurn.player.id === sessionStorage.getItem('playerID'))) {
            if (!(gameMetaData.currentTurn.pickPhaseStarted)) {
                db().setCurrentTurnPickPhase(gameMetaData.gameID);
            } else {
                // TODO: End turn
                console.log('end turn');
            }
        }
    }, [countdown]);

    useEffect(() => {
        if(notification.text) {
            setNotification({text: ''});
        }
    }, [notification]);

    useEffect(() => {
        // Reset the game if it's a new players turn
        if(previousGameMetaData && (previousGameMetaData.currentTurn.player.id !== gameMetaData.currentTurn.player.id)) {
            setCountdown(gameMetaData.turnTimeLimit);
            setPlayerCards();
            setMyTurn(false);
            setCanPickCard(true);
            setAnswers();
            clearInterval(countdownInterval);
        }

        if(gameMetaData && gameMetaData.currentTurn.pickPhaseStarted) {
            let secondsDiff = parseInt((gameMetaData.currentTurn.pickPhaseStarted / 1000 + gameMetaData.pickPhaseTimeLimit) - +new Date()/1000);
            setCountdown(secondsDiff <= 0 ? 0 : secondsDiff);
        }
    }, [gameMetaData]);

    let gameDataChange = (gameData) => {
        // Game is over, navigate to post game
        if(!gameData.currentTurn) {
            props.history.push('/postgame/' + gameData.gameID);
            clearInterval(countdownInterval);
            return;
        }

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
        setAnswers(gameData.currentTurn.answers);

        if(!countdownInterval) {
            startCountdown(gameData);
        }
        
        checkIfMyTurn(gameData);
        checkIfCanPickCard(gameData);
    };

    let startCountdown = (gameData) => {
        // If the current round is in the pick phase, set the countdown relative to that
        // otherwise set it relative to the start of turn timestamp
        let secondsDiff = gameData.currentTurn.pickPhaseStarted ? 
            parseInt((gameData.currentTurn.pickPhaseStarted / 1000 + gameData.pickPhaseTimeLimit) - +new Date()/1000) :
            parseInt((gameData.currentTurn.startTime / 1000 + gameData.turnTimeLimit) - +new Date()/1000);

        setCountdown(secondsDiff <= 0 ? 0 : secondsDiff);

        countdownInterval = setInterval(() => {
            setCountdown(prevState => prevState <= 0 ? 0 : prevState - 1);
        }, 1000);
    };

    let checkIfMyTurn = (gameData) => {
        let currentTurnPlayerID = gameData.currentTurn.player.id;
        let myID = sessionStorage.getItem('playerID');

        if (currentTurnPlayerID === myID) {
            setMyTurn(true);
            let questionIndex = Math.floor(Math.random() * (questionCards.length));
            db().setCurrentTurnQuestion(gameData.gameID, questionCards[questionIndex].data);
        }
    };

    let checkIfCanPickCard = (gameData) => {
        if(gameData.currentTurn.pickPhaseStarted) {
            setCanPickCard(false);
        } else {
            if(!gameData.currentTurn.answers) {
                setCanPickCard(true);
            } else {
                setCanPickCard(gameData.currentTurn.answers.findIndex(answer => answer.playerID === sessionStorage.getItem('playerID')) === -1);
            }
        }
    };

    let getGameID = () => {
        let pathNameSplit = props.location.pathname.split('/');
        let gameID = pathNameSplit[pathNameSplit.length - 1];
        return gameID;
    }

    let answerQuestion = (index) => {
        if(canPickCard) {
            let pCards = [...playerCards];
            let currentAnswer = pCards[index];
            
            if(currentAnswer.selected) {
                db().answerQuestion(gameMetaData.gameID, sessionStorage.getItem('playerID'), currentAnswer.data).then(() => {
                    delete pCards[index].selected;
                    
                    // Gets all available cards that are not in the hand
                    let availableCards = answerCards.filter(card => pCards.findIndex(pCard => pCard.data === card.data) === -1);
                    
                    pCards.splice(index, 1);
                    pCards.push(availableCards[Math.floor(Math.random() * (availableCards.length))]);
    
                    db().setCards(gameMetaData.gameID, sessionStorage.getItem('playerID'), pCards);
    
                    setPlayerCards(pCards);                
                });
            } else {
                pCards.map(a => delete a.selected);
                currentAnswer.selected = true;
                setPlayerCards(pCards);
            }
        } else {
            if (gameMetaData.currentTurn.pickPhaseStarted) {
                setNotification({text: 'Can\'t answer during pick phase!'});
            } else {
                setNotification({text: 'Already picked a card this turn!'});
            }
        }
    };

    let pickWinner = (index) => {
        if (gameMetaData.currentTurn.pickPhaseStarted) {
            let aCards = [...answers];
            let currentPick = aCards[index];
            
            if(currentPick.selected) {
                db().pickTurnWinner(gameMetaData.gameID, sessionStorage.getItem('playerID'), currentPick.playerID);
            } else {
                aCards.map(a => delete a.selected);
                currentPick.selected = true;
                setAnswers(aCards);
            }
        } else {
            setNotification({text: 'Can\'t pick a winner until pick phase!'});
        }
    };

    let cancelSelect = (index) => {
        let pCards = [...playerCards];
        delete pCards[index].selected;
        setPlayerCards(pCards);
    };

    let cancelPick = (index) => {
        let aCards = [...answers];
        delete aCards[index].selected;
        setAnswers(aCards);
    };

    let aCards = (
        gameMetaData && answers && answers.length ? 
        answers.map((answer, index) => (
            <div key={index} className={styles.playerCard}>
                {
                    answer.selected ? 
                    <div className={styles.selectedCard}>
                        <div className={styles.selectedCardNo} onClick={() => {cancelPick(index)}}>
                            <span className={styles.selectedCardText}>
                                Cancel
                            </span>
                        </div>
                        <div className={styles.selectedCardYes} onClick={() => {pickWinner(index)}}>
                            <span className={styles.selectedCardText}>
                                Select
                            </span>
                        </div>
                    </div> :
                    <div className={styles.playerCardText} onClick={() => {pickWinner(index)}}>
                        <span className={styles.selectedCardText}>
                            {answer.data}
                        </span>
                    </div>
                }
            </div>
        )) : 
        <div className={styles.cardsHandPlaceholder}>Players are picking answers...</div>
    );

    let pCards = (
        playerCards ?
        playerCards.map((card, index) => (
            <div key={index} className={styles.playerCard}>
                {
                    card.selected ?
                    <div className={styles.selectedCard}>
                        <div className={styles.selectedCardNo} onClick={() => {cancelSelect(index)}}>
                            <span className={styles.selectedCardText}>
                                Cancel
                            </span>
                        </div>
                        <div className={styles.selectedCardYes} onClick={() => {answerQuestion(index)}}>
                            <span className={styles.selectedCardText}>
                                Select
                            </span>
                        </div>
                    </div> :
                    <div className={styles.playerCardText} onClick={() => {answerQuestion(index)}}>
                        <span className={styles.selectedCardText}>
                            {card.data}
                        </span>
                    </div>
                }
            </div>
        )) : <div className={styles.cardsHandPlaceholder}>Loading your cards...</div>
    );

    return (
        <div>
            <Notification text={notification.text}/>
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
                        <div style={{marginTop: "20px"}}>
                            {gameMetaData && gameMetaData.currentTurn.pickPhaseStarted ? 'Pick phase' : 'Answer phase'}
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
                            myTurn ? aCards : pCards
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