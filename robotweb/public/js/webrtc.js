// This code is from the uv4l streaming server
var signalling_server_hostname = location.hostname;
var signalling_server_address = signalling_server_hostname + ':' + (9000);

addEventListener("DOMContentLoaded", function() {
    document.getElementById('signalling_server').value = signalling_server_address;
});

var ws = null;
var pc;
var audio_stream;
var pcConfig = {"iceServers": [
        {urls: ["stun:stun.l.google.com:19302", "stun:" + signalling_server_hostname + ":3478"]}
    ]};
var pcOptions = {
    optional: [
        {DtlsSrtpKeyAgreement: true}
    ]
};
var mediaConstraints = {
    optional: [],
    mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
    }
};

RTCPeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
RTCSessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
URL = window.webkitURL || window.URL;

function createPeerConnection() {
    try {
        pc = new RTCPeerConnection(pcConfig, pcOptions);
        pc.onicecandidate = onIceCandidate;
        pc.onaddstream = onRemoteStreamAdded;
        pc.onremovestream = onRemoteStreamRemoved;
        console.log("peer connection successfully created!");
    } catch (e) {
        console.log("createPeerConnection() failed");
    }
}

function onIceCandidate(event) {
    if (event.candidate) {
        var candidate = {
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            sdpMid: event.candidate.sdpMid,
            candidate: event.candidate.candidate
        };
        var command = {
            command_id: "addicecandidate",
            data: JSON.stringify(candidate)
        };
        ws.send(JSON.stringify(command));
    } else {
        console.log("End of candidates.");
    }
}

function onRemoteStreamAdded(event) {
    console.log("Remote stream added:", URL.createObjectURL(event.stream));
    var remoteVideoElement = document.getElementById('remote-video');
    remoteVideoElement.src = URL.createObjectURL(event.stream);
    remoteVideoElement.play();
}

function onRemoteStreamRemoved(event) {
    var remoteVideoElement = document.getElementById('remote-video');
    remoteVideoElement.src = '';
}

function start() {
    if ("WebSocket" in window) {
        document.getElementById("stop").disabled = false;
        document.getElementById("start").disabled = true;
        document.documentElement.style.cursor ='wait';
        server = document.getElementById("signalling_server").value.toLowerCase();

        ws = new WebSocket('ws://' + server + '/stream/webrtc');
        
        function offer(stream) {
            createPeerConnection();
            if (stream) {
                pc.addStream(stream);
            }
            var command = {
                command_id: "offer"
            };
            ws.send(JSON.stringify(command));                        
            console.log("offer(), command=" + JSON.stringify(command));
        }

        ws.onopen = function () {
            console.log("onopen()");

            audio_stream = null;
            if (document.getElementById("twoway_audio").checked === true) {
                if (navigator.getUserMedia) {
                    navigator.getUserMedia({audio: true, video: false}, function(stream) {
                        audio_stream = stream;
                        offer(stream);
                    }, function(error) {
                        alert(error);
                    });
                } else {
                    console.log("getUserMedia not supported");
                }
            } else {
                offer();
            }
        };

        ws.onmessage = function (evt) {
            var msg = JSON.parse(evt.data);
            //console.log("message=" + msg);
            console.log("type=" + msg.type);

            switch (msg.type) {
                case "offer":
                    pc.setRemoteDescription(new RTCSessionDescription(msg),
                        function onRemoteSdpSuccess() {
                            console.log('onRemoteSdpSucces()');
                            pc.createAnswer(function (sessionDescription) {
                                pc.setLocalDescription(sessionDescription);
                                var command = {
                                    command_id: "answer",
                                    data: JSON.stringify(sessionDescription)
                                };
                                ws.send(JSON.stringify(command));
                                console.log(command);

                            }, function (error) {
                                alert("Failed to createAnswer: " + error);

                            }, mediaConstraints);
                        },
                        function onRemoteSdpError(event) {
                            alert('Failed to setRemoteDescription: ' + event);
                        }
                    );

                    var command = {
                        command_id: "geticecandidate"
                    };
                    console.log(command);
                    ws.send(JSON.stringify(command));
                    break;

                case "answer":
                    break;

                case "message":
                    alert(msg.data);
                    break;

                case "geticecandidate":
                    var candidates = JSON.parse(msg.data);
                    for (var i = 0; i < candidates.length; i++) {
                        var elt = candidates[i];
                        var candidate = new RTCIceCandidate({sdpMLineIndex: elt.sdpMLineIndex, candidate: elt.candidate});
                        pc.addIceCandidate(candidate,
                            function () {
                                console.log("IceCandidate added: " + JSON.stringify(candidate));
                            },
                            function (error) {
                                console.log("addIceCandidate error: " + error);
                            }
                        );
                    }
                    document.documentElement.style.cursor ='default';
                    break;
            }
        };

        ws.onclose = function (evt) {
            if (pc) {
                pc.close();
                pc = null;
            }
            document.getElementById("stop").disabled = true;
            document.getElementById("start").disabled = false;
            document.documentElement.style.cursor ='default';
        };

        ws.onerror = function (evt) {
            alert("An error has occurred!");
            ws.close();
        };

    } else {
        alert("Sorry, this browser does not support WebSockets.");
    }
}

function stop() {
    if (audio_stream) {
        audio_stream.stop()
        audio_stream = null;
    }
    if (pc) {
        pc.close();
        pc = null;
    }
    if (ws) {
        ws.close();
        ws = null;
    }
    document.getElementById("stop").disabled = true;
    document.getElementById("start").disabled = false;
    document.documentElement.style.cursor ='default';
}

function mute() {
    var remoteVideo = document.getElementById("remote-video");
    remoteVideo.muted = !remoteVideo.muted;
}

/*function fullscreen() {
    var remoteVideo = document.getElementById("remote-video");
    if(remoteVideo.requestFullScreen){
        remoteVideo.requestFullScreen();
    } else if(remoteVideo.webkitRequestFullScreen){
        remoteVideo.webkitRequestFullScreen();
    } else if(remoteVideo.mozRequestFullScreen){
        remoteVideo.mozRequestFullScreen();
}
}*/

window.onbeforeunload = function() {
    if (ws) {
        ws.onclose = function () {}; // disable onclose handler first
        stop();
    }
};