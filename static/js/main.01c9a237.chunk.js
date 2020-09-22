(this.webpackJsonpparty_game=this.webpackJsonpparty_game||[]).push([[0],{1:function(e,t,a){e.exports={turnCounter:"Game_turnCounter__1z1b9",activeCard:"Game_activeCard__1xphX",activeCardText:"Game_activeCardText__1ORCN",cardsHand:"Game_cardsHand__2QuH5",handHeader:"Game_handHeader__341pw",playerCard:"Game_playerCard__Xq-U8",playerCardText:"Game_playerCardText__1dadI",selectedCard:"Game_selectedCard__H2E_X",cardsHandPlaceholder:"Game_cardsHandPlaceholder__1HsyQ",selectedCardNo:"Game_selectedCardNo__wBE0O",selectedCardYes:"Game_selectedCardYes__3uqGl",selectedCardText:"Game_selectedCardText__3xZgK"}},22:function(e,t,a){e.exports={MainMenuTitle:"MainMenu_MainMenuTitle__2HJxy",MainMenuButtons:"MainMenu_MainMenuButtons__2T6AA"}},25:function(e,t,a){e.exports={notification:"Notification_notification__Tgmlt",activeNotification:"Notification_activeNotification__2J3xf"}},31:function(e,t,a){e.exports=a(47)},36:function(e,t,a){},37:function(e,t,a){},47:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(29),i=a.n(c),s=(a(36),a(37),a(2)),u=a(22),l=a.n(u),o=a(16),d=a.n(o);a(38),a(40);console.log(Object({NODE_ENV:"production",PUBLIC_URL:"/Party-Game",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0}));var m={apiKey:Object({NODE_ENV:"production",PUBLIC_URL:"/Party-Game",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0}).APIKEY,authDomain:Object({NODE_ENV:"production",PUBLIC_URL:"/Party-Game",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0}).AUTHDOMAIN,databaseURL:Object({NODE_ENV:"production",PUBLIC_URL:"/Party-Game",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0}).DATABASEURL,storageBucket:Object({NODE_ENV:"production",PUBLIC_URL:"/Party-Game",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0}).PROJECTID,projectId:Object({NODE_ENV:"production",PUBLIC_URL:"/Party-Game",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0}).STORAGEBUCKET};d.a.initializeApp(m);var f=d.a.database(),p=d.a.firestore(),v=function(){return{createGame:function(e,t){f.ref("activeGames/"+e).set({gameID:e,hostID:t.id,createdOn:+new Date,currentTurn:{player:{id:t.id,name:t.name}},players:[{id:t.id,name:t.name}]})},joinGame:function(e,t){f.ref("activeGames/"+e+"/players").once("value",(function(a){var n=a.val();n.push(t),f.ref("activeGames/"+e+"/players").set(n)}))},startGame:function(e){f.ref("activeGames/"+e).once("value",(function(t){var a=t.val();a.startedAt=+new Date,a.turnsLeft=20,a.turnTimeLimit=60,a.pickPhaseTimeLimit=15,a.currentTurn.startTime=+new Date,f.ref("activeGames/"+e).set(a)}))},setCards:function(e,t,a){f.ref("activeGames/"+e+"/players").once("value",(function(n){var r=n.val(),c=r.findIndex((function(e){return e.id===t}));r[c].cards=a,f.ref("activeGames/"+e+"/players").set(r)}))},getMetaUpdates:function(e,t){f.ref("activeGames/"+e).on("value",(function(e){t(e.val())}))},getQuestionCards:function(){return new Promise((function(e,t){p.collection("questionCards").get().then((function(t){var a=[];t.forEach((function(e){a.push(e.data())})),e(a)})).catch((function(e){t(e)}))}))},getAnswerCards:function(){return new Promise((function(e,t){p.collection("answerCards").get().then((function(t){var a=[];t.forEach((function(e){a.push(e.data())})),e(a)})).catch((function(e){t(e)}))}))},setCurrentTurnQuestion:function(e,t){f.ref("activeGames/"+e+"/currentTurn").once("value",(function(a){var n=a.val();n.question||(n.question=t,f.ref("activeGames/"+e+"/currentTurn").set(n))}))},answerQuestion:function(e,t,a){return new Promise((function(n,r){f.ref("activeGames/"+e+"/currentTurn/answers").once("value",(function(c){var i=c.val();i?i.push({playerID:t,data:a}):i=[{playerID:t,data:a}],f.ref("activeGames/"+e+"/currentTurn/answers").set(i).then((function(){n()})).catch((function(e){r(e)}))}))}))},setCurrentTurnPickPhase:function(e){f.ref("activeGames/"+e+"/currentTurn").once("value",(function(t){var a=t.val();a.pickPhaseStarted=+new Date,f.ref("activeGames/"+e+"/currentTurn").set(a)}))},pickTurnWinner:function(e,t,a){f.ref("activeGames/"+e).once("value",(function(n){var r=n.val(),c=r.players.findIndex((function(e){return e.id===a})),i=r.players.findIndex((function(e){return e.id===t})),s=i===r.players.length-1?0:i+1;r.players[c].points=r.players[c].points?r.players[c].points+1:1,r.turnsLeft=r.turnsLeft-1,0===r.turnsLeft?delete r.currentTurn:r.currentTurn={player:{id:r.players[s].id,name:r.players[s].name},startTime:+new Date},f.ref("activeGames/"+e).set(r)}))}}},E=a(49),T=a(3),O=!0;var h=Object(T.f)((function(e){var t=Object(n.useState)(),a=Object(s.a)(t,2),c=a[0],i=a[1],u=Object(n.useState)(r.a.createElement("div",{className:l.a.MainMenuButtons},r.a.createElement("button",{onClick:function(){return i("create")}},"Create Game"),r.a.createElement("button",{onClick:function(){return i("join")}},"Join Game"))),o=Object(s.a)(u,2),d=o[0],m=o[1],f=Object(n.useState)("Main Menu"),p=Object(s.a)(f,2),T=p[0],h=p[1],_=Object(n.useState)(),y=Object(s.a)(_,2),C=y[0],b=y[1],S=Object(n.useState)(),g=Object(s.a)(S,2),j=g[0],D=g[1],P=Object(n.useState)(),I=Object(s.a)(P,2),x=I[0],N=I[1],G=Object(n.useRef)(null),k=Object(n.useRef)(null),w=Object(n.useRef)(null);return Object(n.useEffect)((function(){return function(){O=!1}}),[]),Object(n.useEffect)((function(){var t=function(e){O&&D(e)};switch(c){case"create":h("Create Game"),m(r.a.createElement("div",null,"Your Name",r.a.createElement("input",{ref:G}),r.a.createElement("button",{onClick:function(){var e=(+new Date).toString(36),a=Object(E.a)();v().createGame(e,{name:G.current.value,id:a}),v().getMetaUpdates(e,t),b(e),i("lobby"),N(a),sessionStorage.setItem("playerID",a)}},"Create Game")));break;case"join":h("Join Game"),m(r.a.createElement("div",null,"Game ID",r.a.createElement("br",null),r.a.createElement("input",{ref:w}),"Your Name",r.a.createElement("br",null),r.a.createElement("input",{ref:k}),r.a.createElement("button",{onClick:function(){var e=Object(E.a)();v().joinGame(w.current.value,{name:k.current.value,id:e}),v().getMetaUpdates(w.current.value,t),b(w.current.value),i("lobby"),N(e),sessionStorage.setItem("playerID",e)}},"Join Game")));break;case"lobby":h("Lobby"),m(r.a.createElement("div",null,C?r.a.createElement("div",null,"Game ID",r.a.createElement("div",{style:{fontSize:"50px",marginTop:"10px"}},C)):null,r.a.createElement("div",{className:"blurredBackground"},r.a.createElement("h3",null,"Players (",j&&j.players.length||"-",")"),j?r.a.createElement("ul",{style:{listStyleType:"none",padding:"0px"}},j.players.map((function(e){return r.a.createElement("li",{style:{marginTop:"15px"},key:e.id},e.name,e.id===x?r.a.createElement("span",null," (You)"):e.id===j.hostID?r.a.createElement("span",null," (Host)"):null)}))):r.a.createElement("div",null,"Loading...")),j&&x===j.hostID?r.a.createElement("button",{onClick:function(){v().startGame(C),e.history.push("/game/"+C)}},"Start Game"):r.a.createElement("div",null,"Waiting for host to start game")))}return function(){"lobby"===c&&j&&j.startedAt&&e.history.push("/game/"+C)}}),[c,C,j,x,e.history]),r.a.createElement("div",null,r.a.createElement("h1",{className:l.a.MainMenuTitle},T),d)})),_=a(9),y=a(1),C=a.n(y),b=a(25),S=a.n(b);var g=function(e){var t=Object(n.useState)({text:"",show:!1}),a=Object(s.a)(t,2),c=a[0],i=a[1];return Object(n.useEffect)((function(){e.text&&i({text:e.text,show:!0})}),[e]),Object(n.useEffect)((function(){c.show&&setTimeout((function(){i({text:c.text,show:!1})}),2e3)}),[c]),r.a.createElement("div",{className:S.a.notification+(c.show?" "+S.a.activeNotification:"")},c.text)};var j=function(e){var t=Object(n.useRef)();return Object(n.useEffect)((function(){t.current=e})),t.current};var D=Object(T.f)((function(e){var t=Object(n.useState)(!1),a=Object(s.a)(t,2),c=a[0],i=a[1],u=Object(n.useState)(),l=Object(s.a)(u,2),o=l[0],d=l[1],m=Object(n.useState)(),f=Object(s.a)(m,2),p=f[0],E=f[1],T=Object(n.useState)(),O=Object(s.a)(T,2),h=O[0],y=O[1],b=Object(n.useState)(),S=Object(s.a)(b,2),D=S[0],P=S[1],I=Object(n.useState)(),x=Object(s.a)(I,2),N=x[0],G=x[1],k=Object(n.useState)(!1),w=Object(s.a)(k,2),L=w[0],M=w[1],H=Object(n.useState)(!0),W=Object(s.a)(H,2),A=W[0],U=W[1],K=Object(n.useState)({text:""}),R=Object(s.a)(K,2),B=R[0],Y=R[1],q=Object(n.useState)(),J=Object(s.a)(q,2),Q=J[0],V=J[1],z=j(N),X=void 0;Object(n.useEffect)((function(){var e=[];e.push(new Promise((function(e,t){v().getQuestionCards().then((function(t){d(t),e()}))}))),e.push(new Promise((function(e,t){v().getAnswerCards().then((function(t){E(t),e()}))}))),Promise.all(e).then((function(){i(!0),v().getMetaUpdates(te(),Z)}))}),[]),Object(n.useEffect)((function(){c&&v().getMetaUpdates(te(),Z)}),[c]),Object(n.useEffect)((function(){h<=0&&N.currentTurn.player.id===sessionStorage.getItem("playerID")&&(N.currentTurn.pickPhaseStarted?console.log("end turn"):v().setCurrentTurnPickPhase(N.gameID))}),[h]),Object(n.useEffect)((function(){B.text&&Y({text:""})}),[B]),Object(n.useEffect)((function(){if(z&&z.currentTurn.player.id!==N.currentTurn.player.id&&(y(N.turnTimeLimit),P(),M(!1),U(!0),V(),clearInterval(X)),N&&N.currentTurn.pickPhaseStarted){var e=parseInt(N.currentTurn.pickPhaseStarted/1e3+N.pickPhaseTimeLimit-+new Date/1e3);y(e<=0?0:e)}}),[N]);var Z=function(t){if(!t.currentTurn)return e.history.push("/postgame/"+t.gameID),void clearInterval(X);var a=t.players.findIndex((function(e){return void 0===e.cards})),n=sessionStorage.getItem("playerID"),r=t.players.findIndex((function(e){return e.id===n}));if(-1!==a&&t.players[a].id===n){var c=Object(_.a)(p).sort((function(){return Math.random()-Math.random()})).slice(0,5);v().setCards(te(),n,c)}t.players[r].cards&&P(t.players[r].cards),G(t),V(t.currentTurn.answers),X||$(t),F(t),ee(t)},$=function(e){var t=e.currentTurn.pickPhaseStarted?parseInt(e.currentTurn.pickPhaseStarted/1e3+e.pickPhaseTimeLimit-+new Date/1e3):parseInt(e.currentTurn.startTime/1e3+e.turnTimeLimit-+new Date/1e3);y(t<=0?0:t),X=setInterval((function(){y((function(e){return e<=0?0:e-1}))}),1e3)},F=function(e){if(o&&e.currentTurn.player.id===sessionStorage.getItem("playerID")){M(!0);var t=Math.floor(Math.random()*o.length);v().setCurrentTurnQuestion(e.gameID,o[t].data)}},ee=function(e){e.currentTurn.pickPhaseStarted?U(!1):e.currentTurn.answers?U(-1===e.currentTurn.answers.findIndex((function(e){return e.playerID===sessionStorage.getItem("playerID")}))):U(!0)},te=function(){var t=e.location.pathname.split("/");return t[t.length-1]},ae=function(e){if(A){var t=Object(_.a)(D),a=t[e];a.selected?v().answerQuestion(N.gameID,sessionStorage.getItem("playerID"),a.data).then((function(){delete t[e].selected;var a=p.filter((function(e){return-1===t.findIndex((function(t){return t.data===e.data}))}));t.splice(e,1),t.push(a[Math.floor(Math.random()*a.length)]),v().setCards(N.gameID,sessionStorage.getItem("playerID"),t),P(t)})):(t.map((function(e){return delete e.selected})),a.selected=!0,P(t))}else N.currentTurn.pickPhaseStarted?Y({text:"Can't answer during pick phase!"}):Y({text:"Already picked a card this turn!"})},ne=function(e){if(N.currentTurn.pickPhaseStarted){var t=Object(_.a)(Q),a=t[e];a.selected?v().pickTurnWinner(N.gameID,sessionStorage.getItem("playerID"),a.playerID):(t.map((function(e){return delete e.selected})),a.selected=!0,V(t))}else Y({text:"Can't pick a winner until pick phase!"})},re=N&&Q&&Q.length?Q.map((function(e,t){return r.a.createElement("div",{key:t,className:C.a.playerCard},e.selected?r.a.createElement("div",{className:C.a.selectedCard},r.a.createElement("div",{className:C.a.selectedCardNo,onClick:function(){!function(e){var t=Object(_.a)(Q);delete t[e].selected,V(t)}(t)}},r.a.createElement("span",{className:C.a.selectedCardText},"Cancel")),r.a.createElement("div",{className:C.a.selectedCardYes,onClick:function(){ne(t)}},r.a.createElement("span",{className:C.a.selectedCardText},"Select"))):r.a.createElement("div",{className:C.a.playerCardText,onClick:function(){ne(t)}},r.a.createElement("span",{className:C.a.selectedCardText},e.data)))})):r.a.createElement("div",{className:C.a.cardsHandPlaceholder},"Players are picking answers..."),ce=D?D.map((function(e,t){return r.a.createElement("div",{key:t,className:C.a.playerCard},e.selected?r.a.createElement("div",{className:C.a.selectedCard},r.a.createElement("div",{className:C.a.selectedCardNo,onClick:function(){!function(e){var t=Object(_.a)(D);delete t[e].selected,P(t)}(t)}},r.a.createElement("span",{className:C.a.selectedCardText},"Cancel")),r.a.createElement("div",{className:C.a.selectedCardYes,onClick:function(){ae(t)}},r.a.createElement("span",{className:C.a.selectedCardText},"Select"))):r.a.createElement("div",{className:C.a.playerCardText,onClick:function(){ae(t)}},r.a.createElement("span",{className:C.a.selectedCardText},e.data)))})):r.a.createElement("div",{className:C.a.cardsHandPlaceholder},"Loading your cards...");return r.a.createElement("div",null,r.a.createElement(g,{text:B.text}),r.a.createElement("h1",null,"Game"),c?r.a.createElement("div",null,r.a.createElement("div",{className:C.a.turnCounter},r.a.createElement("span",{style:{fontWeight:300}},"Turns Left:")," ",r.a.createElement("span",{style:{fontWeight:900}},N?N.turnsLeft:"-")),r.a.createElement("div",null,L?"Your":(N?N.currentTurn.player.name:"-")+"'s"," turn",r.a.createElement("div",{style:{marginTop:"25px",fontSize:"2em"},className:h<=5?"redText":null},h),r.a.createElement("div",{style:{marginTop:"20px"}},N&&N.currentTurn.pickPhaseStarted?"Pick phase":"Answer phase")),r.a.createElement("div",{className:C.a.activeCard},r.a.createElement("div",{className:C.a.activeCardText},N&&N.currentTurn.question?N.currentTurn.question:"Picking question...")),r.a.createElement("div",{className:C.a.handHeader},L?"Player Answers":"Your Cards"),r.a.createElement("div",{className:C.a.cardsHand},L?re:ce)):r.a.createElement("div",null,"Loading..."))}));var P=function(e){var t=Object(n.useState)(),a=Object(s.a)(t,2),c=a[0],i=a[1];Object(n.useEffect)((function(){v().getMetaUpdates(function(){var t=e.location.pathname.split("/");return t[t.length-1]}(),u)}),[e.location.pathname]);var u=function(e){var t=e.players.sort((function(e,t){return void 0===t.points?-1:t.points-e.points}));i(t)};return r.a.createElement("div",null,r.a.createElement("h1",null,"Post Game Lobby"),r.a.createElement("div",null,"Winner: ",r.a.createElement("span",{style:{fontWeight:700}},c?c[0].name:"-")),r.a.createElement("div",{className:"blurredBackground"},r.a.createElement("h3",null,"Leaderboard"),c?r.a.createElement("ul",{style:{listStyleType:"none",padding:"0px"}},c.map((function(e,t){return r.a.createElement("li",{style:{marginTop:"15px"},key:e.id},t+1,". ",e.name," ( ",e.points?e.points:0," point",1===e.points?"":"s"," )")}))):r.a.createElement("div",{style:{marginBottom:"30px"}},"Loading Player List...")))},I=a(14);var x=function(){return r.a.createElement(I.a,null,r.a.createElement("div",{className:"App"},r.a.createElement(T.c,null,r.a.createElement(T.a,{path:"/postgame",component:P}),r.a.createElement(T.a,{path:"/game",component:D}),r.a.createElement(T.a,{path:"/",component:h}))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(x,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[31,1,2]]]);
//# sourceMappingURL=main.01c9a237.chunk.js.map