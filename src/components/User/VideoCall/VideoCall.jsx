import React, { useEffect, useRef, useState } from "react";
import { socket } from "../../../Lib/Socket";


const VideoCall = () => {
  const myVideoRef = useRef(null);
  const peerVideoRef = useRef(null);
  const connectionRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [userId, setUserId] = useState("");
  const [myId, setMyId] = useState("");
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [incomingCallInfo, setIncomingCallInfo] = useState(null);

  useEffect(() => {
    // Get user media (camera & mic)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = mediaStream;
        }
      })
      .catch((err) => console.error("Error accessing media:", err));

    // Listen for socket events
    socket.on("me", (id) => setMyId(id));
    socket.on("callIncoming", handleIncomingCall);
    socket.on("callEnded", endCall);
    socket.on("receiveIceCandidate", handleIceCandidate);

    return () => {
      socket.off("callIncoming", handleIncomingCall);
      socket.off("callEnded", endCall);
      socket.off("receiveIceCandidate", handleIceCandidate);
    };
  }, []);

  const handleIncomingCall = ({ from, signal }) => {
    if (!signal || !signal.sdp || !signal.type) {
      console.error("Invalid incoming call signal:", signal);
      return;
    }
    setIncomingCallInfo({ from, signal });
  };

  const createPeerConnection = () => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.ontrack = (event) => {
      if (peerVideoRef.current) {
        peerVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("sendIceCandidate", { to: userId, candidate: event.candidate });
      }
    };

    if (stream) {
      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
    }

    return peerConnection;
  };

  const initiateCall = async () => {
    if (!userId) {
      alert("Enter a user ID to call");
      return;
    }

    const peerConnection = createPeerConnection();
    connectionRef.current = peerConnection;

    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit("callUser", { userToCall: userId, signalData: offer, from: myId });
    } catch (error) {
      console.error("Error initiating call:", error);
    }

    socket.once("callAccepted", async (signal) => {
      if (!signal || !signal.sdp || !signal.type) {
        console.error("Received invalid SDP signal:", signal);
        return;
      }
      console.log("Received SDP answer:", signal);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(signal));
    });
  };

  const answerCall = async () => {
    if (!incomingCallInfo || !incomingCallInfo.signal || !incomingCallInfo.signal.sdp) {
      console.error("Invalid SDP in incoming call:", incomingCallInfo);
      return;
    }
  
    setIsCallAccepted(true);
    const peerConnection = createPeerConnection();
    connectionRef.current = peerConnection;
  
    await peerConnection.setRemoteDescription(new RTCSessionDescription(incomingCallInfo.signal));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit("answerCall", { to: incomingCallInfo.from, answer });
  
    // Process stored ICE candidates
    if (window.iceCandidateQueue) {
      console.log("Adding buffered ICE candidates:", window.iceCandidateQueue.length);
      for (let candidate of window.iceCandidateQueue) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
      window.iceCandidateQueue = []; // Clear queue after processing
    }
  };
  
  const handleIceCandidate = async ({ candidate }) => {
    if (!candidate) return;
  
    // Ensure connectionRef.current exists
    if (!connectionRef.current) {
      console.warn("ICE candidate received but peer connection is not initialized. Storing for later.");
  
      // Store ICE candidates in a temporary queue
      if (!window.iceCandidateQueue) {
        window.iceCandidateQueue = [];
      }
      window.iceCandidateQueue.push(candidate);
      return;
    }
  
    if (connectionRef.current.remoteDescription) {
      try {
        await connectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("ICE candidate added successfully");
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    } else {
      console.warn("ICE candidate received but remote description is not set. Storing for later.");
      
      // Store candidates in a queue for later use
      connectionRef.current.iceCandidateQueue = connectionRef.current.iceCandidateQueue || [];
      connectionRef.current.iceCandidateQueue.push(candidate);
    }
  };
  

  const endCall = () => {
    socket.emit("endCall", { to: incomingCallInfo?.from || userId });
    connectionRef.current?.close();
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center gap-4">
  <h2 className="text-xl font-bold">WebRTC Video Call</h2>
  
  <input
    type="text"
    value={userId}
    onChange={(e) => setUserId(e.target.value)}
    placeholder="Enter User ID to Call"
    className="border px-3 py-2 rounded-md w-80"
  />

  <button onClick={initiateCall} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-2">
    Call User
  </button>

  <p className="text-gray-600 text-sm mt-2">Your ID: <b className="text-blue-600">{myId}</b></p>

  <div className="flex gap-4 mt-4">
    {/* Your Video */}
    <div className="flex flex-col items-center">
      <video ref={myVideoRef} autoPlay playsInline muted className="border w-64 h-48 rounded-md shadow-md" />
      <p className="text-sm font-semibold text-gray-700 mt-1">You ({myId})</p>
    </div>

    {/* Peer Video (only show when call is accepted) */}
    {isCallAccepted && (
      <div className="flex flex-col items-center">
        <video ref={peerVideoRef} autoPlay playsInline className="border w-64 h-48 rounded-md shadow-md transform scale-x-[-1]" />
        <p className="text-sm font-semibold text-gray-700 mt-1">Other User ({userId})</p>
      </div>
    )}
  </div>

  {/* Call Action Buttons */}
  {incomingCallInfo && !isCallAccepted && (
    <button onClick={answerCall} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md mt-3">
      Answer Call
    </button>
  )}

  {isCallAccepted && (
    <button onClick={endCall} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mt-3">
      End Call
    </button>
  )}
</div>

  );
};

export default VideoCall;