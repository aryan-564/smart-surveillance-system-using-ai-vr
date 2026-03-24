import { useState, useEffect } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const VRView = () => {
    const [vrMode, setVrMode] = useState(false);
    const [alertText, setAlertText] = useState("Monitoring Active");

    useEffect(() => {
        socket.on('ai_data', (incoming) => {
            if (incoming.person_count > 5) {
                setAlertText(`ALERT: Crowd Detected (${incoming.person_count})`);
            } else {
                setAlertText("Monitoring Active...");
            }
        });
        return () => socket.off('ai_data');
    }, []);

    const initCameraForVR = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.getElementById('vr-video');
            if (video) {
                video.srcObject = stream;
                video.play();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const startVR = () => {
        setVrMode(true);
        setTimeout(initCameraForVR, 500); // init after render
    };

    if (!vrMode) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] glass rounded-xl">
                <div className="w-24 h-24 mb-6 rounded-full bg-neonBlue bg-opacity-10 text-neonBlue flex items-center justify-center shadow-[0_0_50px_rgba(0,240,255,0.4)]">
                    <Camera className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Immersive VR Monitoring</h2>
                <p className="text-gray-400 max-w-md text-center mb-8">
                    Step inside your surveillance feed in full 360° virtual reality. Active AI tracking and real-time alerts appear directly in your field of view.
                </p>
                <button
                    onClick={startVR}
                    className="bg-neonBlue text-black font-bold text-lg px-8 py-4 rounded-full hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transform hover:-translate-y-1 transition-all"
                >
                    Enter VR Mode
                </button>
            </div>
        );
    }

    // A-frame rendering
    return (
        <div className="absolute inset-0 z-50 bg-black">
            <button
                onClick={() => setVrMode(false)}
                className="absolute top-4 right-4 z-[60] bg-red-500 bg-opacity-80 text-white font-bold px-4 py-2 rounded-lg hover:bg-opacity-100 backdrop-blur-md transition-all"
            >
                Exit VR
            </button>

            {/* Hidden video element for texture mapping */}
            <video
                id="vr-video"
                autoPlay
                playsInline
                muted
                style={{ display: 'none' }}
                crossOrigin="anonymous"
            ></video>

            <a-scene embedded className="w-full h-full">
                {/* Assets mapping */}
                <a-assets>
                    {/* video gets connected via JS but a-assets is best practice to contain elements if preloading needed */}
                </a-assets>

                {/* 360 Environment - using video as texture on a curved plane or sphere */}
                <a-videosphere src="#vr-video" rotation="0 -90 0"></a-videosphere>

                {/* Floating AI HUD / Alert Text */}
                <a-text
                    value={alertText}
                    position="0 2 -3"
                    align="center"
                    color="#00f0ff"
                    scale="1.5 1.5 1.5"
                    font="aileronsemibold"
                ></a-text>

                {/* User Camera Rig */}
                <a-entity camera look-controls position="0 1.6 0"></a-entity>
            </a-scene>
        </div>
    );
};

export default VRView;
