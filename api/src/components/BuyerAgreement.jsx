/**
 * @file BuyerAgreement.jsx
 * @description A 3-step wizard modal that generates a printable property
 *   purchase agreement for "buy" listing type properties.
 *   Opened from PropertyDetails via the "Generate Buyer Agreement" button.
 *
 * ── Flow ──────────────────────────────────────────────────────────────────────
 *  Step 1 | Template Selection
 *          Three agreement templates:
 *          • Standard Sale Agreement      – basic residential purchase deed
 *          • Premium Sale Agreement        – title warranty, inspection, possession
 *          • Commercial Purchase Agreement – GST, arbitration, fit-out handover
 *
 *  Step 2 | Payment Structure
 *          • Full Payment       – 10% token + 90% at registration
 *          • Installment Plan   – 10% + 40% (day 30) + 50% at registration
 *          • Home Loan Purchase – token + loan disbursement at registration
 *
 *  Step 3 | Preview & Print
 *          Auto-filled with seller, buyer, property, price, and payment details.
 *          "Print / Save PDF" opens a clean print-ready page in a new tab.
 *
 * ── Props ─────────────────────────────────────────────────────────────────────
 *  @prop {Object}   property – full property object from PropertyDetails state
 *  @prop {Object}   user     – logged-in user object from AuthContext
 *  @prop {Function} onClose  – callback to unmount the modal
 *
 * ── Helpers ───────────────────────────────────────────────────────────────────
 *  fmt(date)  – formats Date to "DD Month YYYY" (en-IN locale)
 *  inr(n)     – formats number to Indian Rupee string  ₹X,XX,XXX
 *  addDays(d, n) – returns new Date n days ahead
 */

import { useState, useRef } from "react";
import {
  FiX, FiPrinter, FiFileText, FiCheckCircle,
  FiChevronRight, FiChevronLeft, FiCreditCard,
} from "react-icons/fi";
import "./BuyerAgreement.css";

/* ──────────────────────────────────────────────────────
   CONSTANTS
────────────────────────────────────────────────────── */
const TEMPLATES = [
  {
    id: "standard",
    name: "Standard Sale Agreement",
    tag: "Most Popular",
    tagColor: "#3b82f6",
    description:
      "A concise, legally-valid agreement for straightforward residential property purchases — apartments, floors, and houses.",
    features: ["Sale & purchase clauses", "Token advance terms", "Possession date", "Default & penalty", "Stamp duty note"],
  },
  {
    id: "premium",
    name: "Premium Sale Agreement",
    tag: "Recommended",
    tagColor: "#10b981",
    description:
      "Comprehensive agreement with title warranty, property inspection rights, encumbrance-free guarantee, and detailed handover checklist.",
    features: [
      "All Standard clauses",
      "Title warranty clause",
      "Encumbrance-free guarantee",
      "Pre-possession inspection rights",
      "Fixtures & fittings handover",
      "Force majeure clause",
    ],
  },
  {
    id: "commercial",
    name: "Commercial Purchase Agreement",
    tag: "Business",
    tagColor: "#f59e0b",
    description:
      "Designed for offices, shops, plots, and commercial spaces. Covers GST, business-use handover, and arbitration.",
    features: [
      "Commercial use clauses",
      "GST & tax compliance",
      "Fit-out / shell handover",
      "Signage & parking rights",
      "Arbitration clause",
    ],
  },
];

const PAYMENT_PLANS = [
  {
    id: "full",
    label: "Full Payment",
    icon: "💰",
    description: "10% token at signing + 90% balance on registration day.",
    steps: ["10% Token Advance — at signing", "90% Balance — on registration day"],
  },
  {
    id: "installment",
    label: "Installment Plan",
    icon: "📆",
    description: "10% token + 40% within 30 days + 50% at registration.",
    steps: [
      "10% Token Advance — at signing",
      "40% Part Payment — within 30 days",
      "50% Balance — on registration day",
    ],
  },
  {
    id: "homeloan",
    label: "Home Loan Purchase",
    icon: "🏦",
    description: "Token advance by buyer + remaining via bank loan disbursed at registration.",
    steps: [
      "10% Token Advance — by buyer at signing",
      "Loan sanction letter required within 15 days",
      "Balance — bank disbursement on registration day",
    ],
  },
];

/* ──────────────────────────────────────────────────────
   HELPERS
────────────────────────────────────────────────────── */
function fmt(date) {
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}
function inr(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

/* ──────────────────────────────────────────────────────
   AGREEMENT DOCUMENT GENERATORS
────────────────────────────────────────────────────── */

/* ── 1. Standard ── */
function StandardSaleAgreement({ p, user, today, refNo, plan }) {
  const token     = inr(Math.round(p.price * 0.1));
  const balance   = inr(Math.round(p.price * 0.9));
  const totalPrice = inr(p.price);

  return (
    <div className="ba-body">
      <div className="ba-header-block standard">
        <div className="ba-logo">🏠</div>
        <h1 className="ba-title">AGREEMENT FOR SALE</h1>
        <p className="ba-subtitle">Standard Residential Property Purchase</p>
      </div>

      <div className="ba-meta">
        <span>Date: {fmt(today)}</span>
        <span>Agreement No: SA-{refNo}</span>
      </div>

      <section className="ba-section">
        <h2>1. PARTIES</h2>
        <p>This Agreement for Sale ("Agreement") is made on <strong>{fmt(today)}</strong> between:</p>
        <div className="ba-party">
          <strong>VENDOR (Seller):</strong>
          <p>Name: {p.owner?.name || "Property Owner"}</p>
          <p>Contact: {p.owner?.phone || "—"} | {p.owner?.email || "—"}</p>
          <p>Company / Agency: {p.owner?.companyName || "Individual Owner"}</p>
        </div>
        <div className="ba-party">
          <strong>PURCHASER (Buyer):</strong>
          <p>Name: {user?.name || "Buyer Name"}</p>
          <p>Contact: {user?.phone || "—"} | {user?.email || "—"}</p>
          <p>ID Proof: (Aadhaar / PAN / Passport – to be provided at signing)</p>
        </div>
      </section>

      <section className="ba-section">
        <h2>2. SCHEDULE OF PROPERTY</h2>
        <div className="ba-property">
          <p><strong>Title:</strong> {p.title}</p>
          <p><strong>Type:</strong> {p.propertyType} | Listed as: {p.listingType}</p>
          <p><strong>Address:</strong> {p.location?.address}, {p.location?.city}, {p.location?.state} – {p.location?.pincode}</p>
          {p.area      && <p><strong>Area:</strong> {p.area} sq.ft.</p>}
          {p.bedrooms  && <p><strong>Bedrooms:</strong> {p.bedrooms}</p>}
          {p.bathrooms && <p><strong>Bathrooms:</strong> {p.bathrooms}</p>}
          <p><strong>Furnishing:</strong> {p.furnishing || "As-Is (unfurnished)"}</p>
        </div>
      </section>

      <section className="ba-section">
        <h2>3. SALE CONSIDERATION & PAYMENT</h2>
        <table className="ba-table">
          <tbody>
            <tr><td>Total Sale Price</td><td>{totalPrice}</td></tr>
            <tr><td>Token Advance (10%)</td><td>{token}</td></tr>
            <tr><td>Balance Amount (90%)</td><td>{balance}</td></tr>
            <tr><td>Payment Mode</td><td>NEFT / RTGS / Account Payee Cheque</td></tr>
          </tbody>
        </table>
        <p>Payment schedule as per: <strong>{plan?.label || "Full Payment"}</strong></p>
        <ul>
          {plan?.steps?.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </section>

      <section className="ba-section">
        <h2>4. POSSESSION</h2>
        <p>
          The Vendor agrees to hand over vacant physical possession of the property to the Purchaser on
          or before <strong>{fmt(addDays(today, 30))}</strong>, subject to receipt of full sale
          consideration and completion of registration formalities.
        </p>
      </section>

      <section className="ba-section">
        <h2>5. VENDOR'S OBLIGATIONS</h2>
        <ul>
          <li>The Vendor confirms clear and marketable title to the property.</li>
          <li>The property is free from all encumbrances, litigation, and dues.</li>
          <li>Original title documents shall be handed over at the time of registration.</li>
          <li>All property tax, utility, and society dues up to the possession date shall be paid by the Vendor.</li>
        </ul>
      </section>

      <section className="ba-section">
        <h2>6. PURCHASER'S OBLIGATIONS</h2>
        <ul>
          <li>The Purchaser shall pay the sale consideration as per the agreed payment schedule.</li>
          <li>The Purchaser shall bear stamp duty, registration charges, and legal fees.</li>
          <li>The Purchaser shall arrange for inspection of the property before final payment.</li>
        </ul>
      </section>

      <section className="ba-section">
        <h2>7. DEFAULT & CANCELLATION</h2>
        <ul>
          <li>If the Purchaser defaults, the Vendor may forfeit the token advance after a 15-day notice.</li>
          <li>If the Vendor defaults, the token advance shall be refunded double (2×) to the Purchaser.</li>
          <li>Either party may cancel by written notice; all payments shall be settled within 7 working days.</li>
        </ul>
      </section>

      <section className="ba-section">
        <h2>8. STAMP DUTY & REGISTRATION</h2>
        <p>
          This agreement shall be executed on appropriate non-judicial stamp paper. The sale deed shall be
          registered before the Sub-Registrar of Assurances having jurisdiction over the property.
          Stamp duty and registration charges shall be borne by the <strong>Purchaser</strong> as per
          applicable state laws.
        </p>
      </section>

      <div className="ba-signature">
        <div className="ba-sig-col">
          <p>Vendor (Seller)</p>
          <div className="ba-sig-line" />
          <p className="ba-sig-name">{p.owner?.name || "Seller"}</p>
          <p className="ba-sig-date">Date: ___________</p>
        </div>
        <div className="ba-sig-col">
          <p>Purchaser (Buyer)</p>
          <div className="ba-sig-line" />
          <p className="ba-sig-name">{user?.name || "Buyer"}</p>
          <p className="ba-sig-date">Date: ___________</p>
        </div>
        <div className="ba-sig-col">
          <p>Witness</p>
          <div className="ba-sig-line" />
          <p className="ba-sig-name">Name: ___________</p>
          <p className="ba-sig-date">Date: ___________</p>
        </div>
      </div>

      <p className="ba-footnote">
        Governed by the Transfer of Property Act, 1882; Registration Act, 1908; and applicable state
        stamp legislation. This document does not constitute the final registered sale deed.
      </p>
    </div>
  );
}

/* ── 2. Premium ── */
function PremiumSaleAgreement({ p, user, today, refNo, plan }) {
  const token      = inr(Math.round(p.price * 0.1));
  const balance    = inr(Math.round(p.price * 0.9));
  const totalPrice = inr(p.price);

  return (
    <div className="ba-body">
      <div className="ba-header-block premium">
        <div className="ba-logo">🏡</div>
        <h1 className="ba-title">PREMIUM AGREEMENT FOR SALE</h1>
        <p className="ba-subtitle">Comprehensive Residential Property Purchase</p>
      </div>

      <div className="ba-meta">
        <span>Execution Date: {fmt(today)}</span>
        <span>Reference No: PSA-{refNo}</span>
      </div>

      <section className="ba-section">
        <h2>1. CONTRACTING PARTIES</h2>
        <div className="ba-party">
          <strong>VENDOR (Seller):</strong>
          <p>Name: {p.owner?.name || "Property Owner"}</p>
          <p>PAN: _______________ | Aadhaar: _______________</p>
          <p>Phone: {p.owner?.phone || "—"} | Email: {p.owner?.email || "—"}</p>
        </div>
        <div className="ba-party">
          <strong>PURCHASER (Buyer):</strong>
          <p>Name: {user?.name || "Buyer Name"}</p>
          <p>PAN: _______________ | Aadhaar: _______________</p>
          <p>Phone: {user?.phone || "—"} | Email: {user?.email || "—"}</p>
        </div>
      </section>

      <section className="ba-section">
        <h2>2. PROPERTY SCHEDULE</h2>
        <div className="ba-property">
          <p><strong>Property:</strong> {p.title}</p>
          <p><strong>Type:</strong> {p.propertyType}</p>
          <p><strong>Address:</strong> {p.location?.address}, {p.location?.city}, {p.location?.state} – {p.location?.pincode}</p>
          {p.area && <p><strong>Carpet / Super Built-up Area:</strong> {p.area} sq.ft.</p>}
          <p><strong>Floor:</strong> {p.floor || "—"} | <strong>Furnishing:</strong> {p.furnishing || "As-Is"}</p>
          <p><strong>Parking:</strong> {p.parking || "As per society norms"}</p>
        </div>
      </section>

      <section className="ba-section">
        <h2>3. SALE CONSIDERATION</h2>
        <table className="ba-table">
          <tbody>
            <tr><td>Total Sale Price</td><td>{totalPrice}</td></tr>
            <tr><td>Token Advance (10%)</td><td>{token}</td></tr>
            <tr><td>Balance (90%)</td><td>{balance}</td></tr>
            <tr><td>Payment Plan</td><td>{plan?.label}</td></tr>
            <tr><td>Accepted Modes</td><td>NEFT / RTGS / IMPS / A/c Payee Cheque</td></tr>
          </tbody>
        </table>
        <strong>Payment Schedule:</strong>
        <ol className="ba-payment-steps">
          {plan?.steps?.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      </section>

      <section className="ba-section">
        <h2>4. TITLE WARRANTY</h2>
        <ul>
          <li>The Vendor warrants absolute, clear, and marketable title to the property.</li>
          <li>There are no pending litigations, court orders, government acquisitions, or mortgages on the property.</li>
          <li>All approvals (building plan, occupancy certificate, RERA registration) are in place.</li>
          <li>The Vendor shall indemnify the Purchaser against any defect in title arising post-sale.</li>
        </ul>
      </section>

      <section className="ba-section">
        <h2>5. ENCUMBRANCE-FREE GUARANTEE</h2>
        <p>
          The Vendor certifies that the property is free from all encumbrances including mortgages, charges,
          liens, attachments, claims, and dues. An encumbrance certificate dated within 30 days of this
          agreement shall be furnished to the Purchaser.
        </p>
      </section>

      <section className="ba-section">
        <h2>6. INSPECTION RIGHTS</h2>
        <ul>
          <li>The Purchaser has the right to conduct a pre-possession physical inspection.</li>
          <li>Any structural defects or discrepancies found shall be rectified by the Vendor at their cost.</li>
          <li>Inspection shall be completed at least <strong>3 days before</strong> the possession date.</li>
        </ul>
      </section>

      <section className="ba-section">
        <h2>7. FIXTURES, FITTINGS & HANDOVER</h2>
        <ul>
          <li>All permanent fixtures, built-in wardrobes, and modular kitchen (if any) shall be handed over to the Purchaser.</li>
          <li>A handover checklist agreed by both parties shall be signed at possession.</li>
          <li>Keys, parking sticker, society NOC, and original documents shall be handed over on registration day.</li>
        </ul>
      </section>

      <section className="ba-section">
        <h2>8. POSSESSION</h2>
        <p>
          Possession on or before: <strong>{fmt(addDays(today, 30))}</strong>, subject to full payment
          and completed registration. Any delay by the Vendor beyond 15 days attracts a penalty of
          <strong> ₹500/day</strong>.
        </p>
      </section>

      <section className="ba-section">
        <h2>9. DEFAULT</h2>
        <ul>
          <li>Purchaser default: Token forfeited after 15-day cure notice.</li>
          <li>Vendor default: Double token refund within 7 working days.</li>
          <li>Either party may seek specific performance before a competent court.</li>
        </ul>
      </section>

      <section className="ba-section">
        <h2>10. FORCE MAJEURE</h2>
        <p>
          Neither party is liable for delays caused by natural disasters, epidemic, government orders, or
          other events beyond reasonable control. Timelines shall be extended by the duration of such event.
        </p>
      </section>

      <section className="ba-section">
        <h2>11. STAMP DUTY & REGISTRATION</h2>
        <p>
          Stamp duty and registration charges shall be borne by the Purchaser as per applicable state laws.
          Registration to be completed within <strong>30 days of this agreement</strong>.
        </p>
      </section>

      <div className="ba-signature">
        <div className="ba-sig-col">
          <p>Vendor (Seller)</p>
          <div className="ba-sig-line" />
          <p className="ba-sig-name">{p.owner?.name || "Seller"}</p>
          <p className="ba-sig-date">Date: ___________</p>
        </div>
        <div className="ba-sig-col">
          <p>Purchaser (Buyer)</p>
          <div className="ba-sig-line" />
          <p className="ba-sig-name">{user?.name || "Buyer"}</p>
          <p className="ba-sig-date">Date: ___________</p>
        </div>
        <div className="ba-sig-col">
          <p>Witness 1</p>
          <div className="ba-sig-line" />
          <p className="ba-sig-name">Name: ___________</p>
          <p className="ba-sig-date">Date: ___________</p>
        </div>
      </div>

      <p className="ba-footnote">
        Governed by Transfer of Property Act 1882, Registration Act 1908, and applicable state Stamp Act.
        RERA-registered projects are additionally governed by the Real Estate (Regulation & Development)
        Act, 2016.
      </p>
    </div>
  );
}

/* ── 3. Commercial ── */
function CommercialPurchaseAgreement({ p, user, today, refNo, plan }) {
  const totalPrice = inr(p.price);
  const gst        = inr(Math.round(p.price * 0.12));
  const token      = inr(Math.round(p.price * 0.1));

  return (
    <div className="ba-body">
      <div className="ba-header-block commercial">
        <div className="ba-logo">🏢</div>
        <h1 className="ba-title">COMMERCIAL PROPERTY PURCHASE AGREEMENT</h1>
        <p className="ba-subtitle">Corporate / Business Asset Acquisition</p>
      </div>

      <div className="ba-meta">
        <span>Date of Execution: {fmt(today)}</span>
        <span>Agreement Ref: CPA-{refNo}</span>
      </div>

      <section className="ba-section">
        <h2>1. CONTRACTING PARTIES</h2>
        <div className="ba-party">
          <strong>VENDOR (Seller / Developer):</strong>
          <p>Name / Entity: {p.owner?.name || "Owner / Developer"}</p>
          <p>GSTIN: _______________ | PAN: _______________</p>
          <p>Phone: {p.owner?.phone || "—"} | Email: {p.owner?.email || "—"}</p>
        </div>
        <div className="ba-party">
          <strong>PURCHASER (Buyer / Business Entity):</strong>
          <p>Name / Entity: {user?.name || "Buyer / Company Name"}</p>
          <p>Company Reg. No.: _______________ | GSTIN: _______________</p>
          <p>Phone: {user?.phone || "—"} | Email: {user?.email || "—"}</p>
        </div>
      </section>

      <section className="ba-section">
        <h2>2. PROPERTY DETAILS</h2>
        <div className="ba-property">
          <p><strong>Property:</strong> {p.title}</p>
          <p><strong>Type:</strong> {p.propertyType}</p>
          <p><strong>Address:</strong> {p.location?.address}, {p.location?.city}, {p.location?.state} – {p.location?.pincode}</p>
          {p.area && <p><strong>Super Built-up Area:</strong> {p.area} sq.ft.</p>}
          <p><strong>Permitted Use:</strong> Commercial / Office / Retail purposes</p>
        </div>
      </section>

      <section className="ba-section">
        <h2>3. SALE PRICE & TAXATION</h2>
        <table className="ba-table">
          <tbody>
            <tr><td>Base Sale Price</td><td>{totalPrice}</td></tr>
            <tr><td>GST (@12% on under-construction / applicable)</td><td>{gst}</td></tr>
            <tr><td>Token Advance (10%)</td><td>{token}</td></tr>
            <tr><td>Payment Plan</td><td>{plan?.label}</td></tr>
            <tr><td>Mode of Payment</td><td>NEFT / RTGS / A/c Payee Cheque</td></tr>
          </tbody>
        </table>
        <strong>Payment Milestones:</strong>
        <ol className="ba-payment-steps">
          {plan?.steps?.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
        <p>TDS under Section 194-IA of Income Tax Act shall be deducted by the Purchaser where applicable.</p>
      </section>

      <section className="ba-section">
        <h2>4. TITLE & APPROVALS</h2>
        <ul>
          <li>Vendor warrants free and clear commercial title to the property.</li>
          <li>All building plan approvals, occupancy certificate, and fire NOC are in place.</li>
          <li>No pending litigation, acquisition, or encumbrance exists on the property.</li>
          <li>Vendor shall furnish an encumbrance certificate (EC) within 7 days of this agreement.</li>
        </ul>
      </section>

      <section className="ba-section">
        <h2>5. FIT-OUT & HANDOVER</h2>
        <ul>
          <li>Property shall be handed over in shell-and-core / as-agreed condition.</li>
          <li>Handover checklist (electrical load, water connection, common areas) shall be signed by both parties.</li>
          <li>All keys, access cards, and society-related documents shall be transferred on possession day.</li>
        </ul>
      </section>

      <section className="ba-section">
        <h2>6. SIGNAGE & PARKING</h2>
        <ul>
          <li>Purchaser is entitled to install external signage subject to building management regulations.</li>
          <li>Designated parking spaces (if any) as per schedule shall be included in the sale.</li>
        </ul>
      </section>

      <section className="ba-section">
        <h2>7. POSSESSION</h2>
        <p>
          Possession on or before <strong>{fmt(addDays(today, 45))}</strong>, subject to full
          payment. Penalty of ₹1,000/day beyond agreed possession date unless due to force majeure.
        </p>
      </section>

      <section className="ba-section">
        <h2>8. DEFAULT</h2>
        <ul>
          <li>Purchaser default: Token forfeited after 15 days written notice.</li>
          <li>Vendor default: 2× token refund within 10 working days.</li>
          <li>Either party may seek specific performance or damages before competent courts.</li>
        </ul>
      </section>

      <section className="ba-section">
        <h2>9. STAMP DUTY, REGISTRATION & COMPLIANCE</h2>
        <p>
          Stamp duty and registration charges as per state law shall be borne by the Purchaser. GST, if
          applicable, shall be paid by the Purchaser. Registration to be completed within
          <strong> 45 days</strong> of this agreement.
        </p>
      </section>

      <section className="ba-section">
        <h2>10. ARBITRATION</h2>
        <p>
          Disputes shall be resolved by arbitration under the Arbitration and Conciliation Act, 1996,
          with a sole arbitrator mutually appointed, seated at{" "}
          <strong>{p.location?.city}</strong>. The award shall be final and binding.
        </p>
      </section>

      <div className="ba-signature">
        <div className="ba-sig-col">
          <p>Vendor / Authorised Signatory</p>
          <div className="ba-sig-line" />
          <p className="ba-sig-name">{p.owner?.name || "Vendor"}</p>
          <p className="ba-sig-date">Seal & Date: ___________</p>
        </div>
        <div className="ba-sig-col">
          <p>Purchaser / Authorised Signatory</p>
          <div className="ba-sig-line" />
          <p className="ba-sig-name">{user?.name || "Purchaser"}</p>
          <p className="ba-sig-date">Seal & Date: ___________</p>
        </div>
        <div className="ba-sig-col">
          <p>Witness</p>
          <div className="ba-sig-line" />
          <p className="ba-sig-name">Name: ___________</p>
          <p className="ba-sig-date">Date: ___________</p>
        </div>
      </div>

      <p className="ba-footnote">
        This agreement is governed by the Transfer of Property Act, 1882; Registration Act, 1908;
        RERA Act, 2016 (where applicable); and the laws of India. This is a pre-registration
        agreement and does not substitute the registered sale deed.
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────
   MAIN COMPONENT
────────────────────────────────────────────────────── */
const BuyerAgreement = ({ property, user, onClose }) => {
  const [step, setStep]                     = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedPlan, setSelectedPlan]     = useState(null);
  const printRef                            = useRef();
  const [refNo]                             = useState(() => Date.now().toString().slice(-8));
  const [today]                             = useState(() => new Date());

  /* ── Print ─────────────────────────────────── */
  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Buyer Agreement – ${property?.title || "Property"}</title>
          <style>
            * { margin:0; padding:0; box-sizing:border-box; }
            body { font-family:'Book Antiqua','Palatino Linotype',Palatino,serif; color:#1a1a1a; padding:40px; font-size:14px; line-height:1.7; }
            h1 { font-size:20px; text-align:center; margin-bottom:6px; }
            h2 { font-size:14px; border-bottom:1px solid #999; padding-bottom:4px; margin:18px 0 8px; text-transform:uppercase; letter-spacing:.5px; }
            .ba-header-block { text-align:center; margin-bottom:20px; border-bottom:3px double #1e3a5f; padding-bottom:12px; }
            .ba-logo { font-size:36px; margin-bottom:6px; }
            .ba-meta { display:flex; justify-content:space-between; font-size:11px; color:#555; margin-bottom:18px; border-top:1px solid #ccc; padding-top:6px; }
            .ba-party,.ba-property { background:#f8f8f8; padding:10px 14px; border-left:3px solid #2563eb; border-radius:4px; margin:6px 0; }
            .ba-property { border-left-color:#10b981; }
            .ba-party p,.ba-property p { margin:2px 0; font-size:13px; }
            table { width:100%; border-collapse:collapse; margin:8px 0; }
            td { padding:7px 10px; border:1px solid #ddd; font-size:13px; }
            td:first-child { font-weight:600; background:#f9f9f9; width:45%; }
            ul,ol { margin-left:18px; } li { margin-bottom:3px; }
            ol.ba-payment-steps { margin:8px 0 0 18px; }
            .ba-signature { display:flex; justify-content:space-between; margin-top:48px; gap:16px; }
            .ba-sig-col { flex:1; text-align:center; font-size:12px; color:#555; }
            .ba-sig-line { border-top:1.5px solid #333; margin:46px 8px 6px; }
            .ba-sig-name { font-weight:700; font-size:13px; color:#1a1a1a; }
            .ba-sig-date { font-size:11px; color:#888; }
            .ba-footnote { font-size:10px; color:#888; text-align:center; margin-top:28px; border-top:1px solid #ccc; padding-top:8px; font-style:italic; }
            @media print { body { padding:20px; } }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  /* ── Render selected agreement ─────────────── */
  const renderAgreement = () => {
    const props = { p: property, user, today, refNo, plan: selectedPlan };
    if (selectedTemplate?.id === "premium")    return <PremiumSaleAgreement    {...props} />;
    if (selectedTemplate?.id === "commercial") return <CommercialPurchaseAgreement {...props} />;
    return <StandardSaleAgreement {...props} />;
  };

  const canGoNext =
    (step === 1 && selectedTemplate) ||
    (step === 2 && selectedPlan);

  return (
    <div className="ba-overlay">
      <div className="ba-modal">

        {/* ── Header ── */}
        <div className="ba-header">
          <div className="ba-header-left">
            <FiCreditCard className="ba-header-icon" />
            <div>
              <h2>Buyer Agreement</h2>
              <p>{property?.title}</p>
            </div>
          </div>
          <button className="ba-close-btn" onClick={onClose}><FiX /></button>
        </div>

        {/* ── Step Indicator ── */}
        <div className="ba-steps">
          {["Choose Template", "Payment Plan", "Preview & Print"].map((label, i) => {
            const idx  = i + 1;
            const done = step > idx;
            const active = step === idx;
            return (
              <div key={idx} className={`ba-step ${active ? "active" : ""} ${done ? "done" : ""}`}>
                <div className="ba-step-circle">
                  {done ? <FiCheckCircle /> : <span>{idx}</span>}
                </div>
                <span className="ba-step-label">{label}</span>
                {i < 2 && <div className={`ba-step-line ${done ? "done" : ""}`} />}
              </div>
            );
          })}
        </div>

        {/* ── Step 1: Template ── */}
        {step === 1 && (
          <div className="ba-step-content">
            <h3 className="ba-step-heading">Choose a Purchase Agreement Template</h3>
            <p className="ba-step-sub">Select the template that best matches the property type</p>
            <div className="ba-templates">
              {TEMPLATES.map((t) => (
                <div
                  key={t.id}
                  className={`ba-template-card ${selectedTemplate?.id === t.id ? "selected" : ""}`}
                  onClick={() => setSelectedTemplate(t)}
                >
                  <div className="ba-template-tag" style={{ background: t.tagColor }}>{t.tag}</div>
                  <h4>{t.name}</h4>
                  <p className="ba-template-desc">{t.description}</p>
                  <ul className="ba-template-features">
                    {t.features.map((f, fi) => (
                      <li key={fi}><FiCheckCircle className="ba-feature-check" />{f}</li>
                    ))}
                  </ul>
                  {selectedTemplate?.id === t.id && (
                    <div className="ba-selected-badge"><FiCheckCircle /> Selected</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 2: Payment Plan ── */}
        {step === 2 && (
          <div className="ba-step-content">
            <h3 className="ba-step-heading">Select Payment Structure</h3>
            <p className="ba-step-sub">Choose how the purchase will be financed</p>

            <div className="ba-plans">
              {PAYMENT_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`ba-plan-card ${selectedPlan?.id === plan.id ? "selected" : ""}`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <div className="ba-plan-icon">{plan.icon}</div>
                  <h4>{plan.label}</h4>
                  <p className="ba-plan-desc">{plan.description}</p>
                  <ol className="ba-plan-steps">
                    {plan.steps.map((s, i) => <li key={i}>{s}</li>)}
                  </ol>
                  {selectedPlan?.id === plan.id && (
                    <div className="ba-selected-badge"><FiCheckCircle /> Selected</div>
                  )}
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="ba-summary-box">
              <div className="ba-summary-row">
                <span>Template</span>
                <strong>{selectedTemplate?.name}</strong>
              </div>
              <div className="ba-summary-row">
                <span>Property</span>
                <strong>{property?.title}</strong>
              </div>
              <div className="ba-summary-row">
                <span>Sale Price</span>
                <strong>{inr(property?.price)}</strong>
              </div>
              <div className="ba-summary-row">
                <span>Token Advance (10%)</span>
                <strong>{inr(Math.round((property?.price || 0) * 0.1))}</strong>
              </div>
              {selectedPlan && (
                <div className="ba-summary-row total">
                  <span>Payment Plan</span>
                  <strong>{selectedPlan.label}</strong>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Step 3: Preview ── */}
        {step === 3 && (
          <div className="ba-step-content ba-preview-content">
            <div className="ba-preview-toolbar">
              <div className="ba-preview-info">
                <span className="ba-badge" style={{ background: selectedTemplate?.tagColor }}>
                  {selectedTemplate?.name}
                </span>
                <span className="ba-badge plan">{selectedPlan?.label}</span>
              </div>
              <button className="ba-print-btn" onClick={handlePrint}>
                <FiPrinter /> Print / Save PDF
              </button>
            </div>
            <div className="ba-agreement-preview" ref={printRef}>
              {renderAgreement()}
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="ba-footer">
          {step > 1 && (
            <button className="ba-btn-secondary" onClick={() => setStep(step - 1)}>
              <FiChevronLeft /> Back
            </button>
          )}
          <div className="ba-footer-right">
            {step < 3 ? (
              <button
                className="ba-btn-primary"
                disabled={!canGoNext}
                onClick={() => setStep(step + 1)}
              >
                Continue <FiChevronRight />
              </button>
            ) : (
              <button className="ba-btn-success" onClick={handlePrint}>
                <FiPrinter /> Print Agreement
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BuyerAgreement;
