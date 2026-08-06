import EMICalculator from '../components/EMICalculator.jsx';

export default function EMI() {
  return (
    <div className="container-x pt-6 pb-8">
      <h1 className="sec-title mb-6">Tractor EMI Calculator</h1>
      <p className="text-sm text-gray-main">Calculate your monthly tractor loan installment</p>
      <div className="mt-6">
        <EMICalculator />
      </div>
    </div>
  );
}
