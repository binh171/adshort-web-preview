export default function Stub({ tab, desc, icon }: { tab: string; desc: string; icon: string }) {
  return (
    <div className="stage">
      <div className="stub">
        <div className="ic">{icon}</div>
        <h3>{tab} tab</h3>
        <p>{desc}</p>
      </div>
    </div>
  )
}
