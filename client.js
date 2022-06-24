



function handleLogin(success) { 
   if (success === false) { 
      alert("Ooops...try a different username"); 
   } else { 
      loginPage.style.display = "none"; 
      callPage.style.display = "block"; 
		
      //********************** 
      //Starting a peer connection 
      //********************** 
		
      //getting local audio stream 
      navigator.webkitGetUserMedia({ video: false, audio: true }, function (myStream) { 
         stream = myStream; 
			
         //displaying local audio stream on the page 
         localAudio.src = window.URL.createObjectURL(stream);
			
         //using Google public stun server 
         var configuration = { 
            "iceServers": [{ "url": "stun:stun2.1.google.com:19302" }] 
         }; 
			
         yourConn = new webkitRTCPeerConnection(configuration); 
			
         // setup stream listening 
         yourConn.addStream(stream); 
			
         //when a remote user adds stream to the peer connection, we display it 
         yourConn.onaddstream = function (e) { 
            remoteAudio.src = window.URL.createObjectURL(e.stream); 
         }; 
			
         // Setup ice handling 
         yourConn.onicecandidate = function (event) { 
            if (event.candidate) { 
               send({ 
                  type: "candidate", 
                  candidate: event.candidate 
               }); 
            } 
         }; 
			
      }, function (error) { 
         console.log(error); 
      }); 
		
   } 
};

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
