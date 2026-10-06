export function DeckPreview({ title, subtitle }: { title: string; subtitle: string }) {
  const bars = [38, 62, 50, 84, 72];
  return (
    <div className="pv-deck">
      <div className="pv-deck-bar" />
      <div className="pv-deck-kicker">Foundever · 2026</div>
      <h1 className="pv-deck-title">{title}</h1>
      <p className="pv-deck-sub">{subtitle}</p>
      <div className="pv-deck-chart">
        {bars.map((h, i) => (
          <div key={i} className="pv-deck-col">
            <div className="pv-deck-fill" style={{ height: `${h}%` }} />
            <span>Q{(i % 4) + 1}</span>
          </div>
        ))}
      </div>
      <div className="pv-deck-foot">
        <span>EverGPT</span>
        <span>1 / 12</span>
      </div>
    </div>
  );
}
