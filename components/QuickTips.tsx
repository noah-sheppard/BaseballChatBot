import React from 'react';

export const QuickTips: React.FC = () => {
  const tips = [
    { title: "Force Play", desc: "If a runner must advance because the batter became a runner, the defense only needs to touch the base." },
    { title: "Tag Up", desc: "Runners must wait until a fly ball is caught before advancing to the next base." },
    { title: "Infield Fly", desc: "Prevents defense from intentionally dropping a pop-up to get a double play." },
    { title: "DH Rule", desc: "Designated Hitter bats in place of the pitcher." }
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Quick Rules</h2>
      <div className="grid grid-cols-1 gap-2">
        {tips.map((tip, idx) => (
          <div key={idx} className="bg-slate-700/30 border border-slate-700/50 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
            <h3 className="text-xs font-bold text-slate-300 mb-1">{tip.title}</h3>
            <p className="text-[10px] text-slate-400 leading-snug">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};