var pcConfig = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
var pc1, pc2, offer, answer;

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
  pc1 = new webkitRTCPeerConnection(pcConfig);
  pc2 = new webkitRTCPeerConnection(pcConfig);

  pc1.onaddstream = onRemoteStreamAdded;
  pc1.onremovestream = onRemoteStreamRemoved;
  pc2.onaddstream = onRemoteStreamAdded;
  pc2.onremovestream = onRemoteStreamRemoved;
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
  pc1.addStream(testStream);
},2000);

//================================

pc1.onicecandidate = function(event) {
  console.log('pc1.onicecandidate');
  if (event.candidate) {
    pc2.addIceCandidate(event.candidate);
  } else {
    console.log('End of candidates.');
  }
};

pc2.onicecandidate = function(event) {
  console.log('pc2.onicecandidate');
  if (event.candidate) {
    pc1.addIceCandidate(event.candidate);
  } else {
    console.log('End of candidates.');
  }
};

pc1.createOffer(onOfferCreated, onError);

function onError(err) {
  window.alert(err.message);
}

function onOfferCreated(description) {
  offer = description;
  pc1.setLocalDescription(offer, onPc1LocalDescriptionSet, onError);
}

function onPc1LocalDescriptionSet() {
  // after this function returns, pc1 will start firing icecandidate events
  pc2.setRemoteDescription(offer, onPc2RemoteDescriptionSet, onError);
}

function onPc2RemoteDescriptionSet() {
  pc2.createAnswer(onAnswerCreated, onError);
}

function onAnswerCreated(description) {
  answer = description;
  pc2.setLocalDescription(answer, onPc2LocalDescriptionSet, onError);
}

function onPc2LocalDescriptionSet() {
  // after this function returns, you'll start getting icecandidate events on pc2
  pc1.setRemoteDescription(answer, onPc1RemoteDescriptionSet, onError);
}

function onPc1RemoteDescriptionSet() {
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
