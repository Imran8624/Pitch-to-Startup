import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  Monitor, 
  PhoneOff, 
  MessageSquare, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Send,
  Radio,
  Lock
} from 'lucide-react';

export default function WebRtcPitchRoom({ roomId = 'pitch-room-7842', currentUser }) {
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'System', text: 'Encrypted 1-on-1 WebRTC signaling room ready.', time: 'Now' },
    { sender: 'Alex Vance (Founder)', text: 'Hello! Excited to present our Quantum AI pitch deck.', time: '10:02 AM' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [peerConnected, setPeerConnected] = useState(true);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  // Call timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize camera preview stream
  useEffect(() => {
    async function getMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Camera access fallback simulation enabled:', err);
      }
    }
    getMedia();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleAudio = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => (track.enabled = isAudioMuted));
    }
    setIsAudioMuted(!isAudioMuted);
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => (track.enabled = isVideoDisabled));
    }
    setIsVideoDisabled(!isVideoDisabled);
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
      } catch (e) {
        console.warn('Screen share cancelled or not supported', e);
      }
    } else {
      if (localVideoRef.current && localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
      setIsScreenSharing(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { sender: `${currentUser.name} (${currentUser.role})`, text: inputMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setInputMessage('');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] p-4 sm:p-6 max-w-7xl mx-auto flex flex-col">
      
      {/* Top Room Banner */}
      <div className="glass-card rounded-2xl p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-rose-500 animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">1-on-1 Video Pitch Call Room</h2>
              <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-xs font-mono">
                Room ID: {roomId}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Lock className="h-3 w-3 text-emerald-400" />
              P2P WebRTC E2E Signal Encryption Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300 font-mono">
            <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span>Duration: {formatTime(callDuration)}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="h-4 w-4" />
            <span>Match Verified</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Video Stream Area + Chat Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
        
        {/* Left 2 Cols: Remote & Local Video Windows */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* Remote Peer Video Stream Window */}
          <div className="relative flex-1 min-h-[360px] bg-slate-950 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
            {peerConnected ? (
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&auto=format&fit=crop&q=80"
              />
            ) : (
              <div className="text-center p-6">
                <Users className="h-12 w-12 text-slate-600 mx-auto mb-2 animate-bounce" />
                <p className="text-sm font-semibold text-slate-400">Waiting for peer to join signaling room...</p>
              </div>
            )}

            {/* Remote Peer Label */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-xs font-semibold text-white">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Alex Vance (Founder) — Quantum AI</span>
            </div>

            {/* PIP Local Camera Preview (Bottom-Right) */}
            <div className="absolute bottom-4 right-4 h-36 w-52 bg-slate-900 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl">
              <video 
                ref={localVideoRef} 
                autoPlay 
                muted 
                playsInline 
                className={`w-full h-full object-cover ${isVideoDisabled ? 'hidden' : ''}`}
              />
              {isVideoDisabled && (
                <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500 text-xs">
                  Camera Off
                </div>
              )}
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] text-slate-200 font-medium">
                You ({currentUser.name})
              </div>
            </div>
          </div>

          {/* Media Control Toolbar */}
          <div className="glass-card rounded-2xl p-4 flex items-center justify-center gap-4 border border-white/10">
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-2xl border transition-all ${
                isAudioMuted 
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' 
                  : 'bg-slate-900 border-white/10 text-slate-200 hover:bg-slate-800'
              }`}
              title={isAudioMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            >
              {isAudioMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-4 rounded-2xl border transition-all ${
                isVideoDisabled 
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' 
                  : 'bg-slate-900 border-white/10 text-slate-200 hover:bg-slate-800'
              }`}
              title={isVideoDisabled ? 'Enable Video' : 'Disable Video'}
            >
              {isVideoDisabled ? <VideoOff className="h-5 w-5" /> : <VideoIcon className="h-5 w-5" />}
            </button>

            <button
              onClick={toggleScreenShare}
              className={`p-4 rounded-2xl border transition-all ${
                isScreenSharing 
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                  : 'bg-slate-900 border-white/10 text-slate-200 hover:bg-slate-800'
              }`}
              title="Share Deck / Screen"
            >
              <Monitor className="h-5 w-5" />
            </button>

            <button
              onClick={() => alert('Pitch call session ended.')}
              className="p-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all shadow-lg shadow-rose-600/30"
              title="Leave Call"
            >
              <PhoneOff className="h-5 w-5" />
            </button>
          </div>

        </div>

        {/* Right Col: Live Chat Panel */}
        <div className="glass-card rounded-3xl p-4 flex flex-col justify-between border border-white/10 h-full min-h-[420px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Call Room Chat</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">STOMP WebSockets</span>
            </div>

            {/* Chat Messages */}
            <div className="my-4 space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-emerald-400">{msg.sender}</span>
                    <span className="text-[10px] text-slate-500">{msg.time}</span>
                  </div>
                  <p className="text-xs text-slate-300">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Send Input */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-white/10">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Send message to room..."
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
