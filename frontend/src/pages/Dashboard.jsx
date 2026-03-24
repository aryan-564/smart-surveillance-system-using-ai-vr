import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { Camera, StopCircle, Download, Activity, Users, Box } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { useAuth } from '../context/AuthContext';

const socket = io('http://localhost:5000');

const Dashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState({ person_count: 0, product_count: 0, timestamp: '', employees_status: [] });
    const [isRecording, setIsRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [timer, setTimer] = useState(0);

    const canvasRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const timerIntervalRef = useRef(null);

    // Draw the incoming base64 AI frames onto the recording canvas
    useEffect(() => {
        if (data.frame && canvasRef.current) {
            const img = new Image();
            img.onload = () => {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = `data:image/jpeg;base64,${data.frame}`;
        }
    }, [data.frame]);

    useEffect(() => {
        socket.on('ai_data', (incoming) => {
            setData(incoming);
            // alert sound playing logic
            if (incoming.person_count > 5) {
                new Audio('data:audio/mp3;base64,...').play().catch(() => { });
            }
        });

        return () => socket.off('ai_data');
    }, []);

    const handleStartCamera = async () => {
        try {
            if (!canvasRef.current) return;
            // Get stream directly from the canvas with AI boxes already drawn!
            const stream = canvasRef.current.captureStream(30);

            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            mediaRecorderRef.current = mediaRecorder;
            const chunks = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                setDownloadUrl(url);
            };

            mediaRecorder.start(1000); // collect 1s chunks
            setIsRecording(true);
            setRecordedChunks([]);

            // Setup timer
            setTimer(0);
            timerIntervalRef.current = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);

        } catch (err) {
            console.error('Error accessing media devices.', err);
        }
    };

    const handleStopCamera = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
        setIsRecording(false);
        clearInterval(timerIntervalRef.current);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const chartData = {
        labels: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25'],
        datasets: [
            {
                label: 'Productivity Level',
                data: [65, 59, 80, 81, 56, 90],
                borderColor: '#00f0ff',
                backgroundColor: 'rgba(0, 240, 255, 0.2)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm">Persons Detected</p>
                        <h3 className="text-3xl font-bold text-neonBlue mt-1">{data.person_count}</h3>
                    </div>
                    <div className="p-4 rounded-full bg-neonBlue bg-opacity-10 text-neonBlue"><Users /></div>
                </div>
                <div className="glass p-6 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm">Products Identified</p>
                        <h3 className="text-3xl font-bold text-neonBlue mt-1">{data.product_count}</h3>
                    </div>
                    <div className="p-4 rounded-full bg-neonBlue bg-opacity-10 text-neonBlue"><Box /></div>
                </div>
                <div className="glass p-6 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm">System Status</p>
                        <h3 className="text-xl font-bold text-green-400 mt-2 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span> Active
                        </h3>
                    </div>
                    <div className="p-4 rounded-full bg-green-500 bg-opacity-10 text-green-400"><Activity /></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Camera Feed */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="glass p-4 rounded-xl flex items-center justify-between">
                        <h3 className="font-bold flex items-center gap-2">
                            <Camera className="w-5 h-5 text-neonBlue" /> Live Feed
                        </h3>
                        {user?.role === 'Admin' && ( // Admin check for camera controls
                            <div className="flex gap-3">
                                {!isRecording ? (
                                    <button onClick={handleStartCamera} className="bg-neonBlue text-black px-4 py-2 rounded-lg font-bold hover:bg-opacity-90 transition flex items-center gap-2">
                                        <Camera className="w-4 h-4" /> Start Camera
                                    </button>
                                ) : (
                                    <button onClick={handleStopCamera} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-opacity-90 transition flex items-center gap-2">
                                        <StopCircle className="w-4 h-4" /> Stop Camera
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="glass rounded-xl overflow-hidden aspect-video relative bg-black flex items-center justify-center border-t border-t-neonBlue/30">
                        {/* Real-time AI feed transmitted via Sockets */}
                        <canvas ref={canvasRef} className={`w-full h-full object-cover ${data.frame ? '' : 'hidden'}`}></canvas>

                        {!data.frame && (
                            <p className="text-gray-500 flex flex-col items-center gap-2">
                                <Camera className="w-10 h-10 opacity-50" />
                                Wait for AI Camera Stream...
                            </p>
                        )}

                        {/* Recording Indicator */}
                        {isRecording && (
                            <div className="absolute top-4 right-4 bg-black/60 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm z-10 border border-white/10 backdrop-blur-md">
                                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="font-mono text-red-100">{formatTime(timer)} REC</span>
                            </div>
                        )}
                    </div>

                    {/* Download Controls */}
                    {user?.role === 'Admin' && downloadUrl && (
                        <div className="glass p-4 rounded-xl flex items-center justify-between mt-4">
                            <div>
                                <h4 className="font-bold">Latest Recording Available</h4>
                                <p className="text-sm text-gray-400 text-xs mt-1">Ready for download locally</p>
                            </div>
                            <a href={downloadUrl} download={`recorded_stream.webm`} className="bg-green-500 bg-opacity-20 text-green-400 font-bold px-4 py-2 rounded-lg border border-green-500 border-opacity-30 hover:bg-opacity-30 transition flex items-center gap-2">
                                <Download className="w-4 h-4" /> Download Recording
                            </a>
                        </div>
                    )}
                </div>

                {/* Right Sidebar Elements */}
                <div className="space-y-6">

                    {/* Employee Status */}
                    <div className="glass p-6 rounded-xl">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-neonBlue" /> Employee Status
                        </h3>
                        <div className="space-y-3">
                            {data.employees_status?.length > 0 ? data.employees_status.map((emp, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-lg border border-white/5">
                                    <div>
                                        <span className="font-semibold block">{emp.employeeId}</span>
                                        <span className="text-xs text-gray-400 mt-1">Work: {emp.work_duration}s | Break: {emp.break_duration}s</span>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full font-bold ${emp.status === 'Working' ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-red-500 bg-opacity-20 text-red-400'}`}>
                                        {emp.status}
                                    </span>
                                </div>
                            )) : (
                                <p className="text-sm text-gray-400 italic text-center py-4">No employees detected yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Analysis Graph */}
                    <div className="glass p-6 rounded-xl">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-neonBlue" /> Productivity Chart
                        </h3>
                        <div className="w-full h-48">
                            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </div>

                    {/* Alerts Panel */}
                    <div className="glass p-6 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-neonBlue"></div>
                        <h3 className="font-bold text-lg mb-3">Live Alerts</h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                            {data.person_count > 5 ? (
                                <div className="text-sm p-3 bg-red-500 bg-opacity-10 text-red-500 rounded border border-red-500/20">
                                    Crowd detected: {data.person_count} persons in frame
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No recent alerts.</p>
                            )}
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default Dashboard;
