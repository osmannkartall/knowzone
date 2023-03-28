function AppLogo({ width, height }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={width}
      height={height}
      viewBox="0 0 330 330"
    >
      <g>
        <rect
          width={330}
          height={330}
          rx={49.5}
          ry={49.5}
          fill="#1563ff"
          stroke="none"
          pointerEvents="none"
        />
        <path
          d="M 168 273 L 168 168.5"
          fill="none"
          stroke="#ffffff"
          strokeWidth={48}
          strokeMiterlimit={10}
          pointerEvents="none"
        />
        <ellipse
          cx={168}
          cy={128}
          rx={40.5}
          ry={40.5}
          fill="#ffffff"
          stroke="#ffffff"
          strokeWidth={48}
          pointerEvents="none"
        />
      </g>
    </svg>
  );
}

export default AppLogo;
