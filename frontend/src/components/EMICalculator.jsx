import { useState, useEffect } from 'react';
import { api, formatPrice } from '../lib/api.js';

function Slider({ label, value, onChange, min, max, step, unit = '', ticks }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-ink">{label}</span>
        <span className="rounded-lg border border-primary pl-2 pr-1 py-0.5 text-secondary text-sm font-bold">
          {value}
          {unit}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative z-10"
          style={{ background: `linear-gradient(to right, #008000 0%, #008000 ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)` }}
        />
      </div>
      {ticks && (
        <div className="flex justify-between text-[10px] text-gray-secondary mt-0.5">
          {ticks.map((t) => <span key={t}>{t}</span>)}
        </div>
      )}
    </div>
  );
}

const AMOUNT_TICKS = ['0', '5L', '10L', '15L', '20L', '25L', '30L'];
const TENURE_TICKS = ['0', '5', '10', '15', '20', '25', '30'];
const RATE_TICKS = ['0%', '5%', '10%', '15%', '20%', '25%', '30%'];

export default function EMICalculator() {
  const [amount, setAmount] = useState(500000);
  const [tenure, setTenure] = useState(5);
  const [rate, setRate] = useState(10);
  const [result, setResult] = useState({ monthlyEmi: 0, totalPayment: 0, totalInterest: 0 });

  useEffect(() => {
    let alive = true;
    api.emi(amount, tenure, rate).then((r) => alive && setResult(r)).catch(() => {});
    return () => { alive = false; };
  }, [amount, tenure, rate]);

  const emi = result.monthlyEmi || 0;
  const pct = Math.min(100, amount > 0 ? 100 : 0);
  const R = 70; // ring radius
  const CIRC = 2 * Math.PI * R;
  const filled = amount > 0 && emi > 0 ? 100 : 0;
  const dash = (filled / 100) * CIRC;

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Left: sliders */}
      <div>
        <Slider label="Loan Amount" value={amount} onChange={setAmount} min={10000} max={3000000} step={10000}
          ticks={AMOUNT_TICKS} />
        <Slider label="Loan Tenure (Years)" value={tenure} onChange={setTenure} min={1} max={30} step={1} unit=" Yr"
          ticks={TENURE_TICKS} />
        <Slider label="Rate of Interest" value={rate} onChange={setRate} min={5} max={30} step={0.5} unit="%"
          ticks={RATE_TICKS} />
      </div>

      {/* Right: ring + breakdown */}
      <div className="flex flex-col items-center lg:items-start">
        <div className="relative h-[250px] w-[250px]">
          <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90 drop-shadow-lg">
            <circle cx="100" cy="100" r={R} fill="none" stroke="#FFFFFF" strokeWidth="18" />
            <circle cx="100" cy="100" r={R} fill="none" stroke="#008000" strokeWidth="18" strokeLinecap="round"
              strokeDasharray={`${dash} ${CIRC}`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm text-[#616161]">Total EMI</span>
            <span className="text-xl font-bold text-ink">{formatPrice(emi)}</span>
            <span className="text-xs text-[#616161]">/ Month</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-primary" /> Principal – {formatPrice(amount)}</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-gray-light bg-white" /> Interest – {formatPrice(result.totalInterest)}</span>
        </div>

        <div className="mt-4 w-full max-w-[340px] space-y-2">
          {[
            ['Monthly EMI', formatPrice(emi)],
            ['6 Monthly EMI', formatPrice(emi * 6)],
            ['Total Interest', formatPrice(result.totalInterest)],
            ['Total Amount', formatPrice(result.totalPayment)]
          ].map(([l, v]) => (
            <div key={l} className="flex items-center justify-between border-b border-dashed border-gray-light pb-1.5 text-sm">
              <span className="text-gray-main">{l}</span>
              <span className="font-bold text-ink">{v}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 w-full max-w-[340px] rounded-lg bg-green-gradient p-4 text-center text-white">
          <div className="flex items-center justify-around text-sm">
            <div><div className="text-white/70 text-xs">Loan Amount</div><div className="font-bold">{formatPrice(amount)}</div></div>
            <div><div className="text-white/70 text-xs">Loan Tenure</div><div className="font-bold">{tenure} Yr</div></div>
            <div><div className="text-white/70 text-xs">Rate of Interest</div><div className="font-bold">{rate}%</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
