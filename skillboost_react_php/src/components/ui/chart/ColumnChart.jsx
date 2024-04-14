import axios from "axios";
import { useEffect, useState } from "react";
import Filter from "../../icons/Interface/Filter";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement, // Register the ArcElement for bar charts
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          align: "center",
        },
      },
    },
  };

  // State to store top courses data
  const [topCourses, setTopCourses] = useState([]);

  // Fetch top courses data when component mounts
  useEffect(() => {
    getTopCourses();
  }, []);

  // Function to fetch top courses data from the API
  function getTopCourses() {
    axios
      .get("http://localhost:80/SkillBoost-API/api/Dashboard/read_top_courses.php")
      .then((response) => {
        console.log("Top khóa học được mua nhiều nhất:", response.data);
        setTopCourses(response.data);
      });
  }

  // Create labels and data arrays from topCourses state
  const labels = topCourses.map((course) => course.TenKhoaHoc);
  const data = topCourses.map((course) => parseInt(course.so_luong_mua, 10));

  // Create BarChartData object using dynamic labels and data
  const BarChartData = {
    labels,
    datasets: [
      {
        label: "Số lượng bán ra",
        data,
        backgroundColor: "rgb(92, 118, 255)",
        borderColor: "rgb(92, 118, 255)",
        borderRadius: 10,
        hoverBackgroundColor: "rgb(255, 255, 255)",
        hoverBorderDashOffset: 3,
      },
    ],
  };

  return (
    <main className="w-full h-full">
      <div className="text-primary flex flex-row items-center pb-5">
        <div className="font-bold">Top khóa học được mua nhiều nhất</div>
        <div className="ml-auto cursor-pointer">
          <Filter />
        </div>
      </div>
      <Bar options={options} data={BarChartData}></Bar>
    </main>
  );
};

export default BarChart;
