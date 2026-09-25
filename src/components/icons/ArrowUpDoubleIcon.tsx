import type { SVGProps } from "react";

export function ArrowUpDoubleIcon({ size = 24, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M18 11.5s-4.419-6-6-6s-6 6-6 6m12 7s-4.419-6-6-6s-6 6-6 6"
      />
    </svg>
  );
}

export default ArrowUpDoubleIcon;
