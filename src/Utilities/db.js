import firebase from 'firebase';
import 'firebase/database';
import 'firebase/firestore';

// TODO: Figure out how to authenticate per user and only allow access to their game session
var config = {
	apiKey: "AAAAyl7O1-c:APA91bHcg_n9IfCQ-2ZlUpV-XyA4DO0edIATym5QZjKmK31FzY-FZGtNu0BatRh-MLMU2UWeXAgHS6K5ovZ1TDD-D67nTJUQNurEdk4VHWBzk7nINLxXgv1I0fsFvpmsTNfdJpgsK9Ur",
	authDomain: "party-game-ip.firebaseapp.com",
	databaseURL: "https://party-game-ip.firebaseio.com/",
    storageBucket: "party-game-ip.appspot.com",
    projectId: "party-game-ip"
};

firebase.initializeApp(config);

let fbRealtimeDB = firebase.database();
let fbFirestore = firebase.firestore();

let dbFunctions = () => {
    return {
        createGame: (gameID, host) => {
            fbRealtimeDB.ref('activeGames/' + gameID).set({
                gameID,
                hostID: host.id,
                createdOn: +new Date(),
                currentTurn: {
                    player: {
                        id: host.id,
                        name: host.name
                    }
                },
                players: [
                    {
                        id: host.id,
                        name: host.name
                    }
                ]
            });
        },
        joinGame: (gameID, player) => {
            // TODO: Don't let new player join if the game as started (ie there is a startedAt time)
            fbRealtimeDB.ref('activeGames/' + gameID + '/players').once('value', (snapshot) => {
                // TODO: Figure out a way to implement concurrency. Maybe last updated timestamp
                let currentUsers = snapshot.val();
                currentUsers.push(player);

                fbRealtimeDB.ref('activeGames/' + gameID + '/players').set(
                    currentUsers
                );
            });
        },
        startGame: (gameID) => {
            // TODO: Pass in number of turns. This can be configured in pre game lobby by host (and maybe other settings)
            fbRealtimeDB.ref('activeGames/' + gameID).once('value', (snapshot) => {
                let gameSnapshot = snapshot.val();
                gameSnapshot.startedAt = +new Date();
                gameSnapshot.turnsLeft = 20;
                gameSnapshot.turnTimeLimit = 60;
                gameSnapshot.pickPhaseTimeLimit = 15;
                gameSnapshot.currentTurn.startTime = +new Date();

                fbRealtimeDB.ref('activeGames/' + gameID).set(
                    gameSnapshot
                );
            });
        },
        setCards: (gameID, playerID, playersHand) => {
            fbRealtimeDB.ref('activeGames/' + gameID + '/players').once('value', (snapshot) => {
                let currentUsers = snapshot.val();
                let playerIndex = currentUsers.findIndex(user => {
                    return user.id === playerID;
                });
                currentUsers[playerIndex].cards = playersHand;

                fbRealtimeDB.ref('activeGames/' + gameID + '/players').set(
                    currentUsers
                );
            });
        },
        getMetaUpdates: (gameID, cb) => {
            fbRealtimeDB.ref('activeGames/' + gameID).on('value', (snapshot) => {
                cb(snapshot.val());
            });
        },
        getQuestionCards: () => {
            return new Promise((resolve, reject) => {
                fbFirestore.collection("questionCards").get().then(snapshot => {
                    let questionCards = [];
            
                    snapshot.forEach(doc => {
                        questionCards.push(doc.data());
                    });
    
                    resolve(questionCards);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        getAnswerCards: () => {
            return new Promise((resolve, reject) => {
                fbFirestore.collection("answerCards").get().then(snapshot => {
                    let answerCards = [];
            
                    snapshot.forEach(doc => {
                        answerCards.push(doc.data());
                    });
    
                    resolve(answerCards);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        setCurrentTurnQuestion: (gameID, question) => {
            fbRealtimeDB.ref('activeGames/' + gameID + '/currentTurn').once('value', (snapshot) => {
                let currentTurnData = snapshot.val();

                if(!currentTurnData.question) {
                    currentTurnData.question = question;

                    fbRealtimeDB.ref('activeGames/' + gameID + '/currentTurn').set(
                        currentTurnData
                    );
                }
            });
        },
        answerQuestion: (gameID, playerID, answer) => {
            return new Promise((resolve, reject) => {
                fbRealtimeDB.ref('activeGames/' + gameID + '/currentTurn/answers').once('value', (snapshot) => {
                    let currentTurnAnswers = snapshot.val();
    
                    if (!currentTurnAnswers) {
                        currentTurnAnswers = [{playerID, data: answer}];
                    } else {
                        currentTurnAnswers.push({playerID, data: answer});
                    }
    
                    // TODO: Prevent the user from answering twice
                    fbRealtimeDB.ref('activeGames/' + gameID + '/currentTurn/answers').set(
                        currentTurnAnswers
                    ).then(() => {
                        resolve();
                    }).catch(error => {
                        reject(error);
                    });
                });
            });
        },
        setCurrentTurnPickPhase: (gameID) => {
            fbRealtimeDB.ref('activeGames/' + gameID + '/currentTurn').once('value', (snapshot) => {
                let currentTurnData = snapshot.val();
                currentTurnData.pickPhaseStarted = +new Date();

                fbRealtimeDB.ref('activeGames/' + gameID + '/currentTurn').set(
                    currentTurnData
                );
            });
        },
        pickTurnWinner: (gameID, currentTurnPlayerID, playerID) => {
            fbRealtimeDB.ref('activeGames/' + gameID).once('value', (snapshot) => {
                let activeGameData = snapshot.val();
                let winnerIndex = activeGameData.players.findIndex(player => player.id === playerID);
                let currentPlayerIndex = activeGameData.players.findIndex(player => player.id === currentTurnPlayerID);
                let nextPlayerIndex = currentPlayerIndex === activeGameData.players.length - 1 ? 0 : currentPlayerIndex + 1;
                
                // Increment points of the winner
                activeGameData.players[winnerIndex].points = activeGameData.players[winnerIndex].points ? activeGameData.players[winnerIndex].points + 1 : 1;
                
                // Reset current turn metadata
                activeGameData.currentTurn = {
                    player: {
                        id: activeGameData.players[nextPlayerIndex].id,
                        name: activeGameData.players[nextPlayerIndex].name,
                    },
                    startTime: +new Date()
                };

                activeGameData.turnsLeft = activeGameData.turnsLeft - 1;
                // TODO: End the game

                fbRealtimeDB.ref('activeGames/' + gameID).set(
                    activeGameData
                );
            });
        }
    }
};

export default dbFunctions;