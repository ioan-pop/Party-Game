import firebase from 'firebase';

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
                players: [
                    {
                        id: host.id,
                        name: host.name
                    }
                ]
            });
        },
        joinGame: (gameID, player) => {
            fbRealtimeDB.ref('activeGames/' + gameID + '/players').once('value', (snapshot) => {
                // TODO: Figure out a way to implement concurrency. Maybe last updated timestamp
                let currentUsers = snapshot.val();
                currentUsers.push(player);

                fbRealtimeDB.ref('activeGames/' + gameID + '/players').set(
                    currentUsers
                );
            });
        },
        getMetaUpdates: (gameID, cb) => {
            // TODO: Rename variables and plug in game id
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
        }
    }
};

export default dbFunctions;