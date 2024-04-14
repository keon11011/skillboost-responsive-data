import axios from "axios";
import { useEffect, useState } from "react";
import { Doughnut } from 'react-chartjs-2';
import Filter from "../../icons/Interface/Filter";

const PieChart = () => {
    // Initial options for the doughnut chart
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
            }
        }
    };

    // Initialize state for the doughnut chart data
    const [PieChartData, setPieChartData] = useState({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [
                "rgb(92, 118, 255)",
                "rgb(0, 255, 194)",
                "rgb(231, 231, 231)",
                "rgb(255, 53, 138)",
                "rgb(54, 162, 235)",
                "rgb(255, 159, 64)",
                "rgb(75, 192, 192)",
                "rgb(153, 102, 255)"
            ],
            hoverOffset: 4,
        }]
    });

    // Fetch data from the API
    useEffect(() => {
        axios.get('http://localhost:80/SkillBoost-API/api/Dashboard/read_cus_occ.php')
            .then(response => {
                console.log('Tỷ lệ khách hàng theo nghề nghiệp', response.data);

                // Extract labels and data from the response
                const labels = response.data.map(item => item.ten_nghe_nghiep);
                const data = response.data.map(item => item.so_luong_khach_hang);

                // Update the PieChartData state
                setPieChartData({
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: [
                            "rgb(92, 118, 255)",
                            "rgb(0, 255, 194)",
                            "rgb(231, 231, 231)",
                            "rgb(255, 53, 138)",
                            "rgb(54, 162, 235)",
                            "rgb(255, 159, 64)",
                            "rgb(75, 192, 192)",
                            "rgb(153, 102, 255)"
                        ],
                        hoverOffset: 4,
                    }]
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <main className="w-full h-full">
            <div className="text-primary flex flex-row items-center pb-3">
                <div className="font-bold">Tỉ lệ phần trăm các loại khách hàng theo nghề nghiệp</div>
                <div className="ml-auto cursor-pointer"><Filter /></div>
            </div>
            <Doughnut options={options} data={PieChartData} />
        </main>
    );
};

export default PieChart;
