export default function About() {
  return (
    <div className="flex-1 p-8 md:p-16 lg:px-32 bg-background overflow-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">About OceanEmbed</h1>
        <p className="text-white/60 text-lg mb-12">
          SIH 2026 — PS26066
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 border border-white/10 rounded-2xl bg-card">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">The Problem</h2>
            <p className="text-white/70 leading-relaxed">
              Satellites give us extensive information about the ocean surface, but they cannot directly observe the complete temperature structure deep below the surface. Argo floats provide subsurface measurements, but they are sparse compared with satellite coverage.
            </p>
          </div>
          
          <div className="p-8 border border-white/10 rounded-2xl bg-card">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">The Solution</h2>
            <p className="text-white/70 leading-relaxed">
              OceanEmbed learns the complex relationship between surface observations and subsurface temperature using historical satellite and Argo data, allowing for high-resolution subsurface reconstruction globally.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">Technology Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { cat: 'Frontend', tech: 'React, Vite, TS' },
            { cat: 'UI', tech: 'Tailwind, shadcn/ui' },
            { cat: '3D & Maps', tech: 'Three.js, Leaflet' },
            { cat: 'Charts', tech: 'Plotly.js' },
            { cat: 'Backend', tech: 'FastAPI (Python)' },
            { cat: 'Machine Learning', tech: 'PyTorch' },
            { cat: 'Data Processing', tech: 'xarray, Pandas' },
            { cat: 'Database', tech: 'Supabase (Optional)' },
          ].map(item => (
            <div key={item.cat} className="p-4 bg-white/5 border border-white/5 rounded-xl">
              <div className="text-white/40 text-xs uppercase mb-1">{item.cat}</div>
              <div className="text-white font-medium">{item.tech}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
