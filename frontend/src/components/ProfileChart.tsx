import Plot from "react-plotly.js";
import type { ProfilePoint } from "@/lib/ocean-data";

export default function ProfileChart({ profile }: { profile: ProfilePoint[] }) {
  return (
    <Plot
      data={[{ x: profile.map((point) => point.temp), y: profile.map((point) => point.depth), type: "scatter", mode: "lines+markers", line: { color: "#22d3ee", width: 3, shape: "spline" }, marker: { color: "#67e8f9", size: 7 }, hovertemplate: "%{x:.1f}°C · %{y}m<extra></extra>" }]}
      layout={{ autosize: true, margin: { l: 58, r: 20, t: 20, b: 48 }, paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)", font: { color: "#8ca8b8", family: "IBM Plex Mono" }, xaxis: { title: { text: "Temperature (°C)" }, gridcolor: "rgba(125,211,252,.1)", zeroline: false }, yaxis: { title: { text: "Depth (m)" }, autorange: "reversed", gridcolor: "rgba(125,211,252,.1)", zeroline: false }, showlegend: false }}
      config={{ responsive: true, displayModeBar: false }}
      useResizeHandler
      className="h-full w-full"
    />
  );
}