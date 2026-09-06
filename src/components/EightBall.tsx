export default function EightBall({ size = 38 }: { size?: number }) {
  const discSize = Math.round(size * 0.53);
  const fontSize = Math.round(size * 0.37);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#14201A",
        border: "1px solid rgba(243,241,232,0.14)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: discSize,
          height: discSize,
          borderRadius: "50%",
          background: "#F3F1E8",
          color: "#0C0F0D",
          fontFamily: "var(--font-oswald)",
          fontSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 1,
        }}
      >
        8
      </div>
    </div>
  );
}
