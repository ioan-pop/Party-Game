import React, { useState, useEffect } from 'react';
import db from '../../Utilities/db';
import styles from './Game.module.css';

function Game() {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [questionCards, setQuestionCards] = useState();
    const [answerCards, setAnswerCards] = useState();
    const [countdown, setCountdown] = useState();

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
    }, []);

    let startCountdown = () => {
        setCountdown(60);

        countdownInterval = setInterval(() => {
            setCountdown(prevState => prevState <= 0 ? 0 : prevState - 1);
        }, 1000);
    };

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
                        <div className={styles.playerCard}>
                            <div className={styles.playerCardText}>
                                Test
                            </div>
                        </div>
                        <div className={styles.playerCard}>
                            <div className={styles.playerCardText}>
                                Test
                            </div>
                        </div>
                        <div className={styles.playerCard}>
                            <div className={styles.playerCardText}>
                                Test
                            </div>
                        </div>
                        <div className={styles.playerCard}>
                            <div className={styles.playerCardText}>
                                Test
                            </div>
                        </div>
                        <div className={styles.playerCard}>
                            <div className={styles.playerCardText}>
                                Test
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default Game;