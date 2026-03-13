import { useMemo, useState } from 'react';
import { FiZap } from 'react-icons/fi';
import mlService from '../services/mlservice';
import './AiPriceMatchSection.css';

const formatPrice = (value) => {
  const p = Number(value || 0);
  if (!p) return '₹0';
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
  if (p >= 100000) return `₹${(p / 100000).toFixed(2)} L`;
  return `₹${p.toLocaleString('en-IN')}`;
};

const computeMatch = (askingPrice, predictedPrice) => {
  const asking = Number(askingPrice);
  const predicted = Number(predictedPrice);

  if (
    !asking ||
    !predicted ||
    Number.isNaN(asking) ||
    Number.isNaN(predicted)
  ) {
    return null;
  }

  const diffPct = ((asking - predicted) / predicted) * 100;
  const absDiff = Math.abs(diffPct);
  const matchScore = Math.max(0, Math.round(100 - absDiff * 2));

  let status = 'Fairly priced';
  if (diffPct <= -8) status = 'Good value';
  if (diffPct >= 10) status = 'Premium priced';

  return {
    status,
    diffPct: diffPct.toFixed(1),
    matchScore,
  };
};

const AiPriceMatchSection = () => {
  const [form, setForm] = useState({
    city: '',
    area: '',
    bedrooms: '2',
    bathrooms: '2',
    amenitiesCount: '0',
    askingPrice: '',
  });
  const [predicting, setPredicting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const match = useMemo(
    () => computeMatch(form.askingPrice, result?.predictedPrice),
    [form.askingPrice, result?.predictedPrice]
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const runPrediction = async () => {
    setPredicting(true);
    setError('');
    setResult(null);

    const prediction = await mlService.predictPrice({
      city: form.city,
      area: Number(form.area) || 1000,
      bedrooms: Number(form.bedrooms) || 2,
      bathrooms: Number(form.bathrooms) || 2,
      amenitiesCount: Number(form.amenitiesCount) || 0,
      listedPrice: Number(form.askingPrice) || undefined,
    });

    setPredicting(false);
    if (!prediction.success) {
      setError(prediction.error || 'Unable to get prediction right now.');
      return;
    }

    setResult(prediction.data);
  };

  return (
    <section className="ai-match-wrap">
      <div className="ai-match-card">
        <div className="ai-match-head">
          <FiZap className="ai-match-icon" />
          <div>
            <h3>AI Price Match</h3>
            <p>Estimate fair price and compare with your asking price.</p>
          </div>
        </div>

        <div className="ai-match-grid">
          <label className="ai-match-field">
            <span>City</span>
            <input
              name="city"
              value={form.city}
              onChange={onChange}
              placeholder="Enter city"
            />
          </label>
          <label className="ai-match-field">
            <span>Area (sq.ft)</span>
            <input
              name="area"
              value={form.area}
              onChange={onChange}
              placeholder="e.g. 1200"
              type="number"
            />
          </label>
          <label className="ai-match-field">
            <span>Bedrooms</span>
            <input
              name="bedrooms"
              value={form.bedrooms}
              onChange={onChange}
              placeholder="e.g. 2"
              type="number"
            />
          </label>
          <label className="ai-match-field">
            <span>Bathrooms</span>
            <input
              name="bathrooms"
              value={form.bathrooms}
              onChange={onChange}
              placeholder="e.g. 2"
              type="number"
            />
          </label>
          <label className="ai-match-field">
            <span>Amenities Count</span>
            <input
              name="amenitiesCount"
              value={form.amenitiesCount}
              onChange={onChange}
              placeholder="e.g. 6"
              type="number"
            />
          </label>
          <label className="ai-match-field">
            <span>Asking Price (optional)</span>
            <input
              name="askingPrice"
              value={form.askingPrice}
              onChange={onChange}
              placeholder="e.g. 8500000"
              type="number"
            />
          </label>
        </div>

        <button
          type="button"
          className="ai-match-btn"
          onClick={runPrediction}
          disabled={predicting || !form.city || !form.area}
        >
          {predicting ? 'Analysing...' : 'Get AI Estimate'}
        </button>

        {error && <p className="ai-match-error">{error}</p>}

        {result && (
          <div className="ai-match-result">
            <p>
              <strong>Suggested Price:</strong>{' '}
              {formatPrice(result.predictedPrice)}
            </p>
            {result.priceRange && (
              <p>
                <strong>Range:</strong> {formatPrice(result.priceRange.min)} -{' '}
                {formatPrice(result.priceRange.max)}
              </p>
            )}
            {match && (
              <p>
                <strong>Price Match:</strong> {match.status} ({match.diffPct}%
                vs AI estimate) - Match Score {match.matchScore}/100
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default AiPriceMatchSection;
