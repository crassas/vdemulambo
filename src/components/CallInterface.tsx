import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Maximize, MessageSquare, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

interface CallInterfaceProps {
  onEndCall: () => void;
  isCartomante?: boolean;
}

export function CallInterface({ onEndCall, isCartomante = false }: CallInterfaceProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const pipVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const offerProcessedRef = useRef(false);

  // Timer for active call
  useEffect(() => {
    const timer = setInterval(() => setCallDuration(d => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Helper to attach local stream to video tags
  const attachLocalStream = () => {
    if (localStreamRef.current) {
      if (localVideoRef.current && localVideoRef.current.srcObject !== localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
        localVideoRef.current.play().catch(() => {});
      }
      if (pipVideoRef.current && pipVideoRef.current.srcObject !== localStreamRef.current) {
        pipVideoRef.current.srcObject = localStreamRef.current;
        pipVideoRef.current.play().catch(() => {});
      }
    }
  };

  // Keep local video elements updated
  useEffect(() => {
    if (isCameraActive && !isVideoOff) {
      attachLocalStream();
    }
  }, [isCameraActive, isVideoOff]);

  // 1. Initialize Real Device Camera with graceful fallback
  const setupCamera = async () => {
    try {
      setCameraError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("O seu navegador não suporta acesso direto à câmera e microfone.");
      }

      let stream: MediaStream | null = null;

      // Attempt 1: HD Video + Audio
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true
        });
      } catch (err1) {
        console.warn("Attempt 1 (HD video + audio) failed, trying standard video + audio...", err1);
        // Attempt 2: Simple Video + Audio
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          });
        } catch (err2) {
          console.warn("Attempt 2 (video + audio) failed, trying video only...", err2);
          // Attempt 3: Video Only (if audio source is failing or occupied)
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false
            });
            setIsMuted(true);
          } catch (err3) {
            console.warn("Attempt 3 (video only) failed, trying audio only...", err3);
            // Attempt 4: Audio Only
            try {
              stream = await navigator.mediaDevices.getUserMedia({
                video: false,
                audio: true
              });
              setIsVideoOff(true);
            } catch (err4) {
              throw err1; // Throw original or best descriptive error
            }
          }
        }
      }

      if (!stream) {
        throw new Error("Não foi possível aceder aos dispositivos de multimédia.");
      }

      localStreamRef.current = stream;
      setIsCameraActive(true);

      // Ensure streams are bound after state update
      setTimeout(() => {
        attachLocalStream();
      }, 100);

      // Setup WebRTC peer connection signaling
      setupWebRTC(stream);
    } catch (err: any) {
      console.error("Camera/Audio access error:", err);
      let msg = "Não foi possível aceder à câmera ou microfone.";
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = "Permissão de câmera/microfone negada no navegador. Por favor autorize o acesso.";
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = "Nenhum dispositivo de câmera/microfone foi encontrado.";
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError' || (err.message && err.message.includes('audio source'))) {
        msg = "O microfone ou câmera já está a ser utilizado por outra aplicação.";
      } else if (err.message) {
        msg = err.message;
      }
      setCameraError(msg);
    }
  };

  useEffect(() => {
    offerProcessedRef.current = false;
    setupCamera();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (pcRef.current) {
        pcRef.current.close();
      }
    };
  }, []);

  // WebRTC P2P connection via Firestore
  const setupWebRTC = async (localStream: MediaStream) => {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });
      pcRef.current = pc;

      // Add local tracks to peer connection
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });

      // Handle remote tracks
      pc.ontrack = (event) => {
        if (event.streams[0]) {
          remoteStreamRef.current = event.streams[0];
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
            remoteVideoRef.current.play().catch(() => {});
          }
        }
      };

      const signalDocRef = doc(db, 'calls', 'webrtc_signal');

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const candidateData = JSON.parse(JSON.stringify(event.candidate));
          updateDoc(signalDocRef, {
            [isCartomante ? 'mentorCandidate' : 'clientCandidate']: candidateData
          }).catch(() => {});
        }
      };

      if (isCartomante) {
        // Mentora creates offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await setDoc(signalDocRef, {
          offer: { type: offer.type, sdp: offer.sdp },
          updatedAt: Date.now()
        }, { merge: true });

        // Listen for answer
        onSnapshot(signalDocRef, async (snapshot) => {
          const data = snapshot.data();
          if (data?.answer) {
            try {
              if (pc.signalingState === 'have-local-offer') {
                await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
              }
            } catch (err) {
              console.error("Failed to set remote description (answer):", err);
            }
          }
          if (data?.clientCandidate) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(data.clientCandidate));
            } catch (e) {}
          }
        });
      } else {
        // Client listens for offer and sends answer
        onSnapshot(signalDocRef, async (snapshot) => {
          const data = snapshot.data();
          if (data?.offer && !offerProcessedRef.current) {
            try {
              if (pc.signalingState === 'stable') {
                offerProcessedRef.current = true;
                await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                await updateDoc(signalDocRef, {
                  answer: { type: answer.type, sdp: answer.sdp }
                });
              }
            } catch (err) {
              console.error("Failed to set remote description (offer):", err);
              offerProcessedRef.current = false;
            }
          }
          if (data?.mentorCandidate) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(data.mentorCandidate));
            } catch (e) {}
          }
        });
      }
    } catch (e) {
      console.warn("WebRTC p2p init notice:", e);
    }
  };

  // Toggle Mute Audio Track
  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !newMuted;
      });
    }
  };

  // Toggle Video Track
  const handleToggleVideo = () => {
    const newVideoOff = !isVideoOff;
    setIsVideoOff(newVideoOff);
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !newVideoOff;
      });
    }
  };

  // Auto-hide controls when idle
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const resetIdleTimer = () => {
      setIsControlsVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsControlsVisible(false), 4000);
    };

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('touchstart', resetIdleTimer);
    resetIdleTimer();

    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('touchstart', resetIdleTimer);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      {/* Main Video Feed (Remote Video or Local Mirror) */}
      <div className="absolute inset-0 overflow-hidden bg-zinc-950 flex items-center justify-center">
        {/* Remote Video Stream */}
        <video 
          ref={remoteVideoRef}
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />

        {/* Fallback mirror if remote stream not yet attached */}
        {!remoteVideoRef.current?.srcObject && (
          <div className="absolute inset-0 flex items-center justify-center">
            {isCameraActive && !isVideoOff ? (
              <video 
                ref={localVideoRef}
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="text-center p-6 space-y-4 max-w-sm">
                <div className="w-20 h-20 rounded-3xl bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto text-accent">
                  <VideoOff className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-white font-bold">Transmissão em Direto</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {cameraError ? cameraError : "Câmera desativada ou a aguardar sinal da contraparte."}
                  </p>
                  {cameraError && (
                    <button
                      onClick={() => setupCamera()}
                      className="mt-4 px-4 py-2 rounded-xl bg-accent/20 border border-accent/40 text-accent text-xs font-bold hover:bg-accent/30 transition-all cursor-pointer"
                    >
                      Tentar Novamente
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* Top Bar */}
      <div className={`absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10 transition-opacity duration-500 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-widest">
            {isCartomante ? "Consulta Mentora • Direto" : "Atendimento Privado"}
          </span>
          <span className="text-xs text-white/60 border-l border-white/20 pl-3 font-mono">
            {formatTime(callDuration)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {cameraError && (
            <div className="bg-red-500/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-red-400/30 text-white text-[10px] font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Erro de Câmera</span>
            </div>
          )}
          <button 
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                document.documentElement.requestFullscreen();
              }
            }}
            className="w-10 h-10 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Self Preview Floating Picture-in-Picture */}
      <motion.div 
        drag
        dragConstraints={{ left: 20, right: 20, top: 20, bottom: 20 }}
        className={`absolute top-24 right-6 w-32 h-44 rounded-[14px] overflow-hidden border border-gold-dim shadow-2xl cursor-grab active:cursor-grabbing z-20 bg-[#0d071c] transition-opacity duration-500 glow-gold-lg ${isControlsVisible ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
      >
        {!isVideoOff && isCameraActive ? (
          <video 
            ref={pipVideoRef}
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover transform -scale-x-100"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 p-2 text-center">
            <VideoOff className="w-6 h-6 text-white/40 mb-1" />
            <span className="text-[9px] text-zinc-400 uppercase font-bold">Sem Vídeo</span>
          </div>
        )}
        {isMuted && (
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-red-500/90 rounded-full flex items-center justify-center backdrop-blur-md">
            <MicOff className="w-3.5 h-3.5 text-white" />
          </div>
        )}
        <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded-full border border-white/10 text-[8px] text-white/90 font-bold uppercase tracking-wider">
          Eu
        </div>
      </motion.div>

      {/* Controls Bar */}
      <div 
        className={`absolute bottom-10 left-0 right-0 z-20 px-6 flex justify-center transition-all duration-500 ${isControlsVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-30 hover:opacity-100 hover:translate-y-0'}`}
        onMouseEnter={() => setIsControlsVisible(true)}
      >
        <div className="bg-panel backdrop-blur-xl px-6 py-4 rounded-[2rem] border border-gold-dim flex items-center gap-6 shadow-2xl shadow-black/50">
          {/* Camera Toggle */}
          <button 
            onClick={handleToggleVideo}
            className={`w-[54px] h-[54px] rounded-full flex items-center justify-center transition-all ${
              isVideoOff ? 'bg-white text-black' : 'bg-white/15 text-white hover:bg-white/25 border border-gold-dim'
            }`}
            title={isVideoOff ? 'Ligar Câmera' : 'Desligar Câmera'}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6 text-accent" />}
          </button>

          {/* Mic Toggle */}
          <button 
            onClick={handleToggleMute}
            className={`w-[54px] h-[54px] rounded-full flex items-center justify-center transition-all ${
              isMuted ? 'bg-white text-black' : 'bg-white/15 text-white hover:bg-white/25 border border-gold-dim'
            }`}
            title={isMuted ? 'Ativar Microfone' : 'Desativar Microfone'}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6 text-accent" />}
          </button>

          {/* End Call */}
          <button 
            onClick={() => {
              if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
              }
              onEndCall();
            }}
            className="w-[54px] h-[54px] rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-700 hover:scale-105 transition-all shadow-[0_0_20px_rgba(239,68,68,0.5)] cursor-pointer"
            title="Encerrar Chamada"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

