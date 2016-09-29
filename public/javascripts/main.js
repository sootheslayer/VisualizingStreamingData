var socket = io.connect('http://localhost:3000');

socket.on('kafka-handshake', function (data) {
	$('#avgTimeNum').text(data.value);
});
