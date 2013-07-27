var pcConfig = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
var localPeerConnection, remotePeerConnection, offer, answer;

// Streams
function onRemoteStreamAdded(event) {
  console.log('Remote stream added.');
  remoteStream = event.stream;
  attachMediaStream(remoteScreenShare, event.stream);
  // waitForRemoteVideo();
}

function onRemoteStreamRemoved(event) {
  console.log('Remote stream removed.');
}
//==============

function createPeerConnection() {
  localPeerConnection = new webkitRTCPeerConnection(pcConfig);
  remotePeerConnection = new webkitRTCPeerConnection(pcConfig);

  localPeerConnection.onaddstream = onRemoteStreamAdded;
  localPeerConnection.onremovestream = onRemoteStreamRemoved;
  remotePeerConnection.onaddstream = onRemoteStreamAdded;
  remotePeerConnection.onremovestream = onRemoteStreamRemoved;
}

//================================
var localScreenShare = document.querySelector("video.local");
var remoteScreenShare = document.querySelector("video.remote");

console.log(remoteScreenShare);
console.log(localScreenShare);

createPeerConnection();

setTimeout(function(){
  console.log('adding stream');
  console.log(testStream);
  debugger
  localPeerConnection.addStream(testStream);
},2000);

//================================

localPeerConnection.onicecandidate = function(event) {
  console.log('localPeerConnection.onicecandidate');
  if (event.candidate) {
    var iceCandidate = new RTCIceCandidate(event.candidate);
    remotePeerConnection.addIceCandidate(iceCandidate);
  } else {
    console.log('End of candidates.');
  }
};

remotePeerConnection.onicecandidate = function(event) {
  console.log('remotePeerConnection.onicecandidate');
  if (event.candidate) {
    var iceCandidate = new RTCIceCandidate(event.candidate);
    localPeerConnection.addIceCandidate(iceCandidate);
  } else {
    console.log('End of candidates.');
  }
};

localPeerConnection.createOffer(onOfferCreated, onError);

function onError(err) {
  window.alert(err.message);
}

function onOfferCreated(description) {
  offer = description;
  localPeerConnection.setLocalDescription(offer, onlocalPeerConnectionLocalDescriptionSet, onError);
}

function onlocalPeerConnectionLocalDescriptionSet() {
  // after this function returns, localPeerConnection will start firing icecandidate events
  remotePeerConnection.setRemoteDescription(offer, onremotePeerConnectionRemoteDescriptionSet, onError);
}

function onremotePeerConnectionRemoteDescriptionSet() {
  remotePeerConnection.createAnswer(onAnswerCreated, onError);
}

function onAnswerCreated(description) {
  answer = description;
  remotePeerConnection.setLocalDescription(answer, onremotePeerConnectionLocalDescriptionSet, onError);
}

function onremotePeerConnectionLocalDescriptionSet() {
  // after this function returns, you'll start getting icecandidate events on remotePeerConnection
  localPeerConnection.setRemoteDescription(answer, onlocalPeerConnectionRemoteDescriptionSet, onError);
}

function onlocalPeerConnectionRemoteDescriptionSet() {
  // window.alert('Yay, we finished signaling offers and answers');
}


  // Attach a media stream to an element.
  attachMediaStream = function(element, stream) {
    if (typeof element.srcObject !== 'undefined') {
      element.srcObject = stream;
    } else if (typeof element.src !== 'undefined') {
      element.src = URL.createObjectURL(stream);
    } else {
      console.log('Error attaching stream to element.');
    }
  };
