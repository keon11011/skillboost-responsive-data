import * as React from "react";
const SvgBellClose = (props) => (
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
      d="M15 17v1a3 3 0 1 1-6 0v-1m6 0H9m6 0h3.59c.383 0 .575 0 .73-.052a1 1 0 0 0 .628-.628c.052-.156.052-.348.052-.734 0-.169 0-.253-.013-.334a1 1 0 0 0-.174-.42c-.048-.067-.108-.127-.227-.246l-.39-.39a.67.67 0 0 1-.196-.474V10a7 7 0 1 0-14 0v3.722a.67.67 0 0 1-.196.474l-.39.39c-.12.12-.179.179-.226.245a1 1 0 0 0-.175.421c-.013.08-.013.165-.013.334 0 .386 0 .578.052.734a1 1 0 0 0 .628.628c.155.052.347.052.73.052H9m1-5 2-2m0 0 2-2m-2 2-2-2m2 2 2 2"
    />
  </svg>
);
export default SvgBellClose;
