export function ReportPreview({ title, subtitle }: { title: string; subtitle: string }) {
  const line = (w: number, k: number) => <div key={k} className="pv-rep-line" style={{ width: `${w}%` }} />;
  return (
    <div className="pv-rep">
      <div className="pv-rep-meta">Report · Foundever internal</div>
      <h1 className="pv-rep-title">{title}</h1>
      <p className="pv-rep-sub">{subtitle}</p>
      <h2 className="pv-rep-h">Summary</h2>
      {[96, 92, 98, 70].map(line)}
      <h2 className="pv-rep-h">Key figures</h2>
      <table className="pv-rep-table">
        <thead>
          <tr>
            <th>Area</th>
            <th>Q2</th>
            <th>Q3</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>EMEA</td>
            <td>82</td>
            <td>86</td>
            <td className="up">+4</td>
          </tr>
          <tr>
            <td>Americas</td>
            <td>79</td>
            <td>84</td>
            <td className="up">+5</td>
          </tr>
          <tr>
            <td>APAC</td>
            <td>81</td>
            <td>80</td>
            <td>−1</td>
          </tr>
        </tbody>
      </table>
      <h2 className="pv-rep-h">Next steps</h2>
      {[94, 88, 60].map(line)}
    </div>
  );
}
