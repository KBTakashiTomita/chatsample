/*
// １）モジュール読み込み
var fs = require("fs");
var http = require("http");
var socketio = require("socket.io");

// ２）サーバー構築
var server = http.createServer( function( req, res ) {
	res.writeHead( 200, { "Content-Type": "text/html" } );
	var output = fs.readFileSync( "index.html", "utf-8" );
	res.end( output );
}).listen( 3000 );

var io = socketio.listen( server );

// ３）クライアントから受信したデータを、すべてのクライアントへ送信
io.sockets.on( "connection", function ( socket ) {

	socket.on("ClientToServer", function ( data ) {
		io.sockets.emit( "ServerToClient", data );
	});

});

*/
var WebSocketServer = require('ws').Server
    , http = require('http')
    , express = require('express')
    , app = express();
 
app.use(express.static(__dirname + '/'));
var server = http.createServer(app);
var wss = new WebSocketServer({server:server});
 
//Websocket接続を保存しておく
var connections = [];
 
//接続時
wss.on('connection', function (ws) {
    //配列にWebSocket接続を保存
    connections.push(ws);
    //切断時
    ws.on('close', function () {
        connections = connections.filter(function (conn, i) {
            return (conn === ws) ? false : true;
        });
    });
    //メッセージ送信時
    ws.on('message', function (message) {
        console.log('message:', message);
        broadcast(JSON.stringify(message));
    });
});
 
//ブロードキャストを行う
function broadcast(message) {
    connections.forEach(function (con, i) {
        con.send(message);
    });
};
 
server.listen(8000);
