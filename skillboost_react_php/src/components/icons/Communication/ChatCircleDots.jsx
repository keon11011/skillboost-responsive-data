import * as React from "react";
const SvgChatCircleDots = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7.51 19.802a9 9 0 1 0-3.312-3.312l.003.005c.073.127.11.191.127.252.016.057.02.108.016.168-.004.063-.025.129-.07.26l-.768 2.307-.001.003c-.162.487-.243.73-.186.892.05.142.163.253.304.304.162.057.404-.023.889-.185l.006-.002 2.306-.769c.131-.044.198-.066.262-.07.059-.004.11.001.167.017.06.017.125.054.253.127z"
    />
  </svg>
);
export default SvgChatCircleDots;
