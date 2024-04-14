import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import Filter from "../../icons/Interface/Filter";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const LineChart = () => {
    const [data, setData] = useState([]);
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    useEffect(() => {
        fetchCustomerData();
    }, []);

    function fetchCustomerData() {
        axios.get('http://localhost:80/SkillBoost-API/api/Dashboard/read_customers_last_year_group_by_month.php')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching customer data:', error);
            });
    }

    // Prepare the data for the chart
    const labels = data.map(item => {
        const month = new Date(item.month);
        return month.toLocaleString('default', { month: 'long' }); // Format month name
    });

    const chartData = data.map(item => item.count);

    const LineChartData = {
        labels: labels,
        datasets: [
            {
                label: "Số lượng khách hàng theo tháng",
                data: chartData,
                spanGaps: true,
                borderColor: "rgb(92, 118, 255)",
                backgroundColor: "rgb(92, 118, 255)",
                borderJoinStyle: "round",
                borderWidth: 2,
                hoverBackgroundColor: "rgb(255, 255, 255)",
            },
        ],
    };

    return (
        <main className="w-full h-full">
            <div className="text-primary flex flex-row items-center pb-3">
                <div className="font-bold">Số lượng khách hàng trong năm qua</div>
                <div className="ml-auto cursor-pointer"><Filter /></div>
            </div>
            <Line options={options} data={LineChartData}></Line>
        </main>
    );
};

export default LineChart;
