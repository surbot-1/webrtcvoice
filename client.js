





//initiating a call 
callBtn.addEventListener("click", function () { 
   var callToUsername = callToUsernameInput.value; 
	
   if (callToUsername.length > 0) { 
      connectedUser = callToUsername; 
		
      // create an offer 
      yourConn.createOffer(function (offer) { 
         send({
            type: "offer", 
            offer: offer 
         }); 
			
         yourConn.setLocalDescription(offer); 
      }, function (error) { 
         alert("Error when creating an offer"); 
      }); 
   } 
});
 
//when somebody sends us an offer 
function handleOffer(offer, name) { 
   connectedUser = name; 
   yourConn.setRemoteDescription(new RTCSessionDescription(offer)); 
	
   //create an answer to an offer 
   yourConn.createAnswer(function (answer) { 
      yourConn.setLocalDescription(answer); 
		
      send({ 
         type: "answer", 
         answer: answer 
      });
		
   }, function (error) { 
      alert("Error when creating an answer"); 
   }); 
	
};
 
//when we got an answer from a remote user 
function handleAnswer(answer) { 
   yourConn.setRemoteDescription(new RTCSessionDescription(answer)); 
};
 
//when we got an ice candidate from a remote user 
function handleCandidate(candidate) { 
   yourConn.addIceCandidate(new RTCIceCandidate(candidate)); 
};
 
//hang up
hangUpBtn.addEventListener("click", function () { 
   send({ 
      type: "leave" 
   }); 
	
   handleLeave(); 
});
 
function handleLeave() { 
   connectedUser = null; 
   remoteAudio.src = null; 
	
   yourConn.close(); 
   yourConn.onicecandidate = null; 
   yourConn.onaddstream = null; 
};
