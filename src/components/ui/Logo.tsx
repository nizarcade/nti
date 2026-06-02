type Props = { size?: number };

export default function Logo({ size = 36 }: Props) {
  return (
    <span
      aria-label="NTI logo"
      role="img"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <img
        src="/logo.png"
        alt=""
        aria-hidden
        style={{
          width: "100%",
          height: "80%",
          objectFit: "contain",
          // PNG has padding around the artwork — scale up so the mark fills.
          transform: "scale(1.55)",
          transformOrigin: "center",
          display: "block",
        }}
      />
    </span>
  );
}
