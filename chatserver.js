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