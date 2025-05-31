
// import { useEffect, useRef, useState } from "react";
// import { socket } from "../../../Lib/Socket";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";

// const VideoCall = ({ receiverId }) => {
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const peerConnectionRef = useRef(null);
//   const [peerUserId, setPeerUserId] = useState(null);
//   const [connected, setConnected] = useState(false);
//   const { user } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (!user?._id) return;
//     if (!socket.connected) socket.connect();

//     socket.emit("user_connected", user._id); // Register user ID

//     if (receiverId) {
//       setPeerUserId(receiverId);
//       startCall(receiverId);
//     }

//     socket.on("start_call", async (data) => {
//       console.log("Received start call event", data);
//       setPeerUserId(data.to);

//       if (!peerConnectionRef.current) await initializePeerConnection();

//       if (data.to === user._id) {
//         console.log("Waiting for offer...");
//         return; // If you're the receiver, wait for an offer.
//       }

//       await startCall(data.to);
//     });

//     socket.on("signal", async (data) => {
//       console.log("📡 Signal received:", data);
    
//       if (!peerConnectionRef.current) return;
    
//       if (data.type === "offer") {
//         await handleIncomingOffer(data);
//       } else if (data.type === "answer") {
//         if (peerConnectionRef.current.signalingState === "have-local-offer") {
//           console.log("💬 Setting remote description (answer)");
//           await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
//         }
//       } else if (data.type === "candidate") {
//         console.log("📶 Adding ICE Candidate:", data.candidate);
//         await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
//       }
//     });
    

//     return () => {
//       socket.off("start_call");
//       socket.off("signal");
//     };
//   }, [user, receiverId]);

//   const initializePeerConnection = async () => {
//     if (peerConnectionRef.current) return;
  
//     peerConnectionRef.current = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });
  
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     console.log("🎥 Local Stream:", stream);
//     localVideoRef.current.srcObject = stream;
  
//     stream.getTracks().forEach((track) => {
//       console.log("🎤 Adding track to PeerConnection:", track.kind);
//       peerConnectionRef.current.addTrack(track, stream);
//     });
  
//     peerConnectionRef.current.ontrack = (event) => {
//       console.log("📡 Received remote track:", event.streams[0]);
  
//       setTimeout(() => {
//         if (remoteVideoRef.current) {
//           console.log("🔄 Updating remote video...");
//           remoteVideoRef.current.srcObject = event.streams[0];
//         }
//       }, 500);
//     };
//   };
  

//   const startCall = async (userId) => {
//     if (!userId) return;
//     setPeerUserId(userId);

//     if (!peerConnectionRef.current) await initializePeerConnection();

//     console.log("Creating offer...");
//     const offer = await peerConnectionRef.current.createOffer();
//     await peerConnectionRef.current.setLocalDescription(offer);

//     console.log("Sending offer to:", userId);
//     socket.emit("signal", { to: userId, type: "offer", offer });
//     setConnected(true);
//   };

//   const handleIncomingOffer = async (data) => {
//     if (!peerConnectionRef.current) await initializePeerConnection();
//     setPeerUserId(data.from);
  
//     // Ensure stable state before processing the offer
//     if (peerConnectionRef.current.signalingState !== "stable") {
//       console.warn("Waiting for stable state before processing offer...");
//       await new Promise((resolve) => {
//         const checkState = setInterval(() => {
//           if (peerConnectionRef.current.signalingState === "stable") {
//             clearInterval(checkState);
//             resolve();
//           }
//         }, 100);
//       });
//     }
  
//     console.log("Setting remote description...");
//     await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
  
//     console.log("Creating answer...");
//     const answer = await peerConnectionRef.current.createAnswer();
//     await peerConnectionRef.current.setLocalDescription(answer);
  
//     console.log("Sending answer to:", data.from);
//     socket.emit("signal", { to: data.from, type: "answer", answer });
//     setConnected(true);
//   };
  

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//       <p>My User ID: <strong>{user?._id}</strong></p>

//       {connected ? <p>Connected to: <strong>{peerUserId}</strong></p> : <p>Waiting for another user...</p>}

//       <div className="mt-4 flex gap-4">
//         <div>
//           <video ref={localVideoRef} autoPlay playsInline className="w-1/2 border border-blue-500 rounded" />
//           You
//         </div>
//         <video ref={remoteVideoRef} autoPlay playsInline className="w-1/3 border border-red-500 rounded" style={{ width: "200px" }} />
//       </div>
//     </div>
//   );
// };

// export default VideoCall;
import { useEffect, useRef, useState } from "react";
import { socket } from "../../../Lib/Socket";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";

const VideoCall = ({ setStartCall }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [peerUserId, setPeerUserId] = useState(null);
  const [connected, setConnected] = useState(false);
  const [callStatus, setCallStatus] = useState("Waiting for user...");
  const { user } = useSelector((state) => state.auth);
  const {receiverId ,receiver } = useParams();
  const timeoutRef = useRef(null);

  console.log(receiverId);
  
  
  useEffect(() => {
    if (!user?._id) return;
    if (!socket.connected) socket.connect();

    socket.emit("user_connected", user._id);

    if (receiverId) {
      setPeerUserId(receiverId);
      startCall(receiverId);
      // Start timeout to end call if no connection within 10 seconds
      timeoutRef.current = setTimeout(() => {
        if (!connected) {
          setCallStatus("User is offline. Ending call...");
          handleEndCall();
        }
      }, 30000);
    }

    socket.on("signal", async (data) => {
      console.log("📡 Signal received:", data);

      if (!peerConnectionRef.current) return;

      if (data.type === "offer") {
        await handleIncomingOffer(data);
      } else if (data.type === "answer") {
        if (peerConnectionRef.current.signalingState === "have-local-offer") {
          console.log("💬 Setting remote description (answer)");
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(data.answer)
          );
        }
      } else if (data.type === "candidate") {
        console.log("📶 Adding ICE Candidate:", data.candidate);
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    return () => {
      socket.off("signal");
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      if (localVideoRef.current?.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [user, receiverId]);

  const initializePeerConnection = async () => {
    try {
      if (peerConnectionRef.current) return;

      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log("🎥 Local Stream:", stream);
      localVideoRef.current.srcObject = stream;

      stream.getTracks().forEach((track) => {
        console.log("🎤 Adding track to PeerConnection:", track.kind);
        peerConnectionRef.current.addTrack(track, stream);
      });

      peerConnectionRef.current.ontrack = (event) => {
        console.log("📡 Received remote track:", event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setCallStatus("Connected");
          setConnected(true);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current); // Clear timeout on connection
          }
        }
      };

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("📶 Sending ICE Candidate:", event.candidate);
          socket.emit("signal", {
            to: peerUserId,
            type: "candidate",
            candidate: event.candidate,
          });
        }
      };

      peerConnectionRef.current.oniceconnectionstatechange = () => {
        console.log("ICE Connection State:", peerConnectionRef.current.iceConnectionState);
        if (peerConnectionRef.current.iceConnectionState === "disconnected") {
          setConnected(false);
          setCallStatus("Disconnected");
          handleEndCall();
        }
      };
    } catch (error) {
      console.error("Error initializing peer connection:", error);
      setCallStatus("Failed to access camera or microphone. Please check permissions.");
    }
  };

  const startCall = async (userId) => {
    if (!userId) return;
    setPeerUserId(userId);

    if (!peerConnectionRef.current) await initializePeerConnection();

    try {
      console.log("Creating offer...");
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      console.log("Sending offer to:", userId);
      socket.emit("signal", { to: userId, type: "offer", offer });
    } catch (error) {
      console.error("Error starting call:", error);
      setCallStatus("Failed to start call.");
    }
  };

  const handleIncomingOffer = async (data) => {
    if (!peerConnectionRef.current) await initializePeerConnection();
    setPeerUserId(data.from);

    try {
      if (peerConnectionRef.current.signalingState !== "stable") {
        console.warn("Waiting for stable state before processing offer...");
        await new Promise((resolve) => {
          const checkState = setInterval(() => {
            if (peerConnectionRef.current.signalingState === "stable") {
              clearInterval(checkState);
              resolve();
            }
          }, 100);
        });
      }

      console.log("Setting remote description...");
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );

      console.log("Creating answer...");
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);

      console.log("Sending answer to:", data.from);
      socket.emit("signal", { to: data.from, type: "answer", answer });
      setConnected(true);
      setCallStatus("Connected");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Clear timeout on connection
      }
    } catch (error) {
      console.error("Error handling incoming offer:", error);
      setCallStatus("Failed to process call offer.");
    }
  };

  const handleEndCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setConnected(false);
    setPeerUserId(null);
    setStartCall(false); // Update parent state
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
  const [isMuted, setIsMuted] = useState(false);
const [isVideoEnabled, setIsVideoEnabled] = useState(true);

const handleToggleMute = () => {
  const stream = localVideoRef.current?.srcObject;
  if (stream) {
    stream.getAudioTracks().forEach(track => (track.enabled = !isMuted));
    setIsMuted(!isMuted);
  }
};

const handleToggleVideo = () => {
  const stream = localVideoRef.current?.srcObject;
  if (stream) {
    stream.getVideoTracks().forEach(track => (track.enabled = !isVideoEnabled));
    setIsVideoEnabled(!isVideoEnabled);
  }
};
console.log(callStatus);


  return (
  <div className="flex items-center justify-center h-screen bg-white/50  shadow-md shadow-gray-700">
  <div className="relative w-4/5 h-4/5 rounded-2xl overflow-hidden shadow-lg">
    {/* Remote Video */}
    <video
      ref={remoteVideoRef}
      autoPlay
      playsInline
      className="w-full h-full object-cover"
    />

    {/* Local Video Thumbnail */}
    <div className="absolute bottom-4 right-4 w-48 h-32 border-2 border-white rounded-lg overflow-hidden shadow-md bg-black">
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      <p className="absolute bottom-1 left-2 text-white text-xs">You</p>
    </div>

    {/* Info */}
    <div className="absolute top-4 left-4 text-white space-y-1">
      {/* <p>
        My User ID: <strong>{user?._id}</strong>
      </p> */}
      <p>{callStatus}</p>
      {connected && (
        <p>
          Connected to: <strong>{receiver ||"unknown"}</strong>
        </p>
      )}
    </div>

    {/* Controls with Icons */}
    <div className="absolute bottom-4 left-4 flex gap-4">
      {/* Mute / Unmute */}
      <button
        onClick={handleToggleMute}
        className={`p-3 rounded-full text-white transition duration-200 ${
          isMuted ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-600 hover:bg-gray-700'
        }`}
      >
        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
      </button>

      {/* Video On / Off */}
      <button
        onClick={handleToggleVideo}
        className={`p-3 rounded-full text-white transition duration-200 ${
          isVideoEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
        }`}
      >
        {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
      </button>

      {/* End Call */}
      <button
        onClick={handleEndCall}
        className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition duration-200"
      >
        <PhoneOff size={20} />
      </button>
    </div>
  </div>
</div>

  );
};

export default VideoCall;