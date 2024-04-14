import * as React from "react";
const SvgWindowSidebar = (props) => (
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
      d="M3 6h.02m0 0H9M3.02 6C3 6.314 3 6.702 3 7.2v9.6c0 1.12 0 1.68.218 2.107.192.377.497.683.874.875.427.218.987.218 2.105.218H9M3.02 6c.023-.392.077-.67.198-.908.192-.377.497-.682.874-.874C4.52 4 5.08 4 6.2 4h11.6c1.12 0 1.68 0 2.107.218.377.192.683.497.875.874.121.237.175.516.199.908M9 6h11.98M9 6v14M20.98 6H21m-.02 0c.02.314.02.7.02 1.197v9.606c0 1.118 0 1.677-.218 2.104a2 2 0 0 1-.875.875c-.427.218-.986.218-2.104.218H9"
    />
  </svg>
);
export default SvgWindowSidebar;
