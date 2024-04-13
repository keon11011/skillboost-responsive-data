import * as React from "react";
const SvgGift = (props) => (
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
      d="M12 5.5V8m0-2.5A2.5 2.5 0 1 1 14.5 8M12 5.5A2.5 2.5 0 1 0 9.5 8M12 8h2.5M12 8H9.5M12 8v6m2.5-6h3.3c1.12 0 1.68 0 2.107.218.377.192.683.497.875.874.218.427.218.987.218 2.105V14M9.5 8H6.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C3 9.52 3 10.08 3 11.2V14m0 0v2.8c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.427.218.987.218 2.105.218H12m-9-6h9m0 0v6m0-6h9m-9 6h5.803c1.118 0 1.677 0 2.104-.218.377-.192.683-.498.875-.874.218-.428.218-.986.218-2.104V14"
    />
  </svg>
);
export default SvgGift;
