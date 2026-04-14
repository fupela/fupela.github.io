export default function Starfield() {
  return (
    <div className="starfield">
      {/* Star layers at different depths */}
      <div className="stars-layer stars-small" />
      <div className="stars-layer stars-medium" />
      <div className="stars-layer stars-large" />

      {/* Nebula glow effects */}
      <div className="nebula nebula-1" />
      <div className="nebula nebula-2" />
      <div className="nebula nebula-3" />
    </div>
  );
}
