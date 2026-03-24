import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Analytics = () => {
    const lineData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Employees Active',
                data: [12, 19, 15, 20, 22, 10, 8],
                borderColor: '#00f0ff',
                backgroundColor: 'rgba(0, 240, 255, 0.2)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const productData = {
        labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
        datasets: [
            {
                label: 'Product Counting Tracking',
                data: [120, 150, 100, 220, 180, 250],
                backgroundColor: '#3b82f6',
                borderRadius: 4
            },
        ],
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            <div className="glass p-6">
                <h1 className="text-2xl font-bold mb-2">Historical Analytics (Admin Only)</h1>
                <p className="text-gray-400">View performance, crowd density, and tracking metrics over time.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-xl">
                    <h3 className="font-bold text-lg mb-4 text-neonBlue">Employee Tracking Logs</h3>
                    <div className="h-64">
                        <Line data={lineData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>

                <div className="glass p-6 rounded-xl">
                    <h3 className="font-bold text-lg mb-4 text-blue-400">Box/Product Scan History</h3>
                    <div className="h-64">
                        <Bar data={productData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="glass p-6 rounded-xl overflow-x-auto">
                <h3 className="font-bold text-lg mb-4">Detailed Shift Logs</h3>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-800 text-gray-400">
                            <th className="p-3">Employee ID</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Work Duration</th>
                            <th className="p-3">Break Duration</th>
                            <th className="p-3">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-800/50 hover:bg-white/5 transition">
                            <td className="p-3 font-semibold">employee_1</td>
                            <td className="p-3"><span className="text-green-400">Working</span></td>
                            <td className="p-3 text-gray-300">4h 20m</td>
                            <td className="p-3 text-gray-300">30m</td>
                            <td className="p-3 text-gray-500">2026-03-01 10:23</td>
                        </tr>
                        <tr className="border-b border-gray-800/50 hover:bg-white/5 transition">
                            <td className="p-3 font-semibold">employee_2</td>
                            <td className="p-3"><span className="text-red-400">Break</span></td>
                            <td className="p-3 text-gray-300">2h 10m</td>
                            <td className="p-3 text-gray-300">45m</td>
                            <td className="p-3 text-gray-500">2026-03-01 10:25</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default Analytics;
