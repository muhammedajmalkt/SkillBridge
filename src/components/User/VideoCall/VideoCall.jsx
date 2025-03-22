
import { useEffect, useRef, useState } from "react";
import { socket } from "../../../Lib/Socket";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const VideoCall = ({ receiverId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [peerUserId, setPeerUserId] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user?._id) return;
    if (!socket.connected) socket.connect();

    socket.emit("user_connected", user._id); // Register user ID

    if (receiverId) {
      setPeerUserId(receiverId);
      startCall(receiverId);
    }

    socket.on("start_call", async (data) => {
      console.log("Received start call event", data);
      setPeerUserId(data.to);

      if (!peerConnectionRef.current) await initializePeerConnection();

      if (data.to === user._id) {
        console.log("Waiting for offer...");
        return; // If you're the receiver, wait for an offer.
      }

      await startCall(data.to);
    });

    socket.on("signal", async (data) => {
      console.log("📡 Signal received:", data);
    
      if (!peerConnectionRef.current) return;
    
      if (data.type === "offer") {
        await handleIncomingOffer(data);
      } else if (data.type === "answer") {
        if (peerConnectionRef.current.signalingState === "have-local-offer") {
          console.log("💬 Setting remote description (answer)");
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        }
      } else if (data.type === "candidate") {
        console.log("📶 Adding ICE Candidate:", data.candidate);
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });
    

    return () => {
      socket.off("start_call");
      socket.off("signal");
    };
  }, [user, receiverId]);

  const initializePeerConnection = async () => {
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
  
      setTimeout(() => {
        if (remoteVideoRef.current) {
          console.log("🔄 Updating remote video...");
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      }, 500);
    };
  };
  

  const startCall = async (userId) => {
    if (!userId) return;
    setPeerUserId(userId);

    if (!peerConnectionRef.current) await initializePeerConnection();

    console.log("Creating offer...");
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    console.log("Sending offer to:", userId);
    socket.emit("signal", { to: userId, type: "offer", offer });
    setConnected(true);
  };

  const handleIncomingOffer = async (data) => {
    if (!peerConnectionRef.current) await initializePeerConnection();
    setPeerUserId(data.from);
  
    // Ensure stable state before processing the offer
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
    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
  
    console.log("Creating answer...");
    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);
  
    console.log("Sending answer to:", data.from);
    socket.emit("signal", { to: data.from, type: "answer", answer });
    setConnected(true);
  };
  

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <p>My User ID: <strong>{user?._id}</strong></p>

      {connected ? <p>Connected to: <strong>{peerUserId}</strong></p> : <p>Waiting for another user...</p>}

      <div className="mt-4 flex gap-4">
        <div>
          <video ref={localVideoRef} autoPlay playsInline className="w-1/2 border border-blue-500 rounded" />
          You
        </div>
        <video ref={remoteVideoRef} autoPlay playsInline className="w-1/3 border border-red-500 rounded" style={{ width: "200px" }} />
      </div>
    </div>
  );
};

export default VideoCall;
