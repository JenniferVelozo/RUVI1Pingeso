import * as React from "react"

const Logo = (props) => (
  <svg
    width={47}
    height={47}
    strokeWidth={1.34}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color="#fff"
    {...props}
  >
    <path
      d="M13.667 16h-3.334v-2.333H8v-3.334h2.333V8h3.334v2.333H16v3.334h-2.333V16z"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 18 3.13 4.913a.996.996 0 0 1 .774-1.114l7.662-1.703a2 2 0 0 1 .868 0L20.096 3.8c.51.113.848.596.774 1.114L19 18c-.07.495-.5 3.5-7 3.5S5.07 18.495 5 18z"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default Logo
