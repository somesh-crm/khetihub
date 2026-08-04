import { useState, useEffect } from 'react';
import { api, formatPrice } from '../lib/api.js';

export default function EMI() {
  const [amount, setAmount] = useState(500000);
  const [tenure, setTenure] = useState(5);
  const [rate, setRate] = useState(10);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let alive = true;
    api.emi(amount, tenure, rate).then((r) => alive && setResult(r)).catch(() => {});
    return () => { alive = false; };
  }, [amount, tenure, rate]);

  const Slider = ({ label, value, onChange, min, max, step, unit, fmt }) => (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <span className="text-sm font-extrabold text-kheti-900">{fmt ? fmt(value) : `${value} ${unit}`}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))} />
      <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
        <span>{min === 0 ? '₹ 0' : min + (unit || '')}</span>
        <span>{max + (unit || '')}</span>
      </div>
    </div>
  );

  return (
    <div className="container-x pt-6 pb-8">
      <h1 className="text-xl font-extrabold text-gray-900">Tractor EMI Calculator</h1>
      <p className="text-sm text-gray-500 mt-1">Calculate your monthly tractor loan installment</p>

      <div className="bg-kheti-900 text-white rounded-2xl p-5 mt-5 text-center">
        <div className="text-xs text-white/60 uppercase tracking-wide">Total EMI</div>
        <div className="text-4xl font-black mt-1">{formatPrice(result?.monthlyEmi || 0)}</div>
        <div className="text-xs text-white/60 mt-1">Monthly</div>
      </div>

      <div className="card p-5 mt-5">
        <Slider label="Loan Amount" value={amount} onChange={setAmount} min={100000} max={3000000} step={25000}
          fmt={(v) => formatPrice(v)} />
        <Slider label="Loan Tenure (Years)" value={tenure} onChange={setTenure} min={1} max={10} step={1} unit=" Yr" />
        <Slider label="Rate of Interest" value={rate} onChange={setRate} min={5} max={18} step={0.5} unit="%" />
      </div>

      <div className="card p-5 mt-5">
        <h3 className="font-extrabold text-gray-900 mb-4">EMI Breakdown</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-kheti-50 rounded-xl p-4">
            <div className="text-[10px] font-bold text-gray-400 uppercase">Monthly EMI</div>
            <div className="text-base font-extrabold text-kheti-900 mt-1">{formatPrice(result?.monthlyEmi || 0)}</div>
          </div>
          <div className="bg-kheti-50 rounded-xl p-4">
            <div className="text-[10px] font-bold text-gray-400 uppercase">Total Interest</div>
            <div className="text-base font-extrabold text-accent-500 mt-1">{formatPrice(result?.totalInterest || 0)}</div>
          </div>
          <div className="bg-kheti-50 rounded-xl p-4">
            <div className="text-[10px] font-bold text-gray-400 uppercase">Total Amount</div>
            <div className="text-base font-extrabold text-gray-900 mt-1">{formatPrice(result?.totalPayment || 0)}</div>
          </div>
        </div>
        <div className="mt-4 bg-gray-50 rounded-xl p-4 text-xs text-gray-500">
          <p className="flex justify-between py-1"><span>Loan Amount</span><b className="text-gray-800">{formatPrice(amount)}</b></p>
          <p className="flex justify-between py-1"><span>Loan Tenure</span><b className="text-gray-800">{tenure} Years</b></p>
          <p className="flex justify-between py-1"><span>Rate of Interest</span><b className="text-gray-800">{rate}%</b></p>
          <p className="flex justify-between py-1"><span>Number of Payments</span><b className="text-gray-800">{tenure * 12}</b></p>
        </div>
        <p className="text-[11px] text-gray-400 mt-3">
          EMI calculations are indicative. Actual EMI depends on bank policy, down payment and processing fees.
        </p>
      </div>
    </div>
  );
}
