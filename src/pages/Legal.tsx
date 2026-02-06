import { Link } from "react-router-dom";

export default function Legal() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold">Legal & Trademark</h1>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-xl font-semibold">PartnerAI™</h2>
          <p className="mt-3 text-slate-400">
            PartnerAI™ is a proprietary, trademarked platform developed and owned by MarketEdge. MarketEdge
            continuously evolves the platform through live delivery, ensuring relevance, rigor, and operational
            credibility.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold">Ownership and Status</h3>
          <p className="mt-2 text-slate-400">
            PartnerAI™ is developed and maintained by MarketEdge. Use of the PartnerAI name and marks is reserved.
            For permissions or partnership inquiries, please contact MarketEdge directly.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold">Trademark</h3>
          <p className="mt-2 text-slate-400">
            PartnerAI™ is a trademark of MarketEdge. All rights reserved. Any unauthorized use of the PartnerAI
            name or logos is prohibited.
          </p>
        </div>

        <div>
          <Link className="text-indigo-400 hover:underline" to="/">Back to home</Link>
        </div>
      </div>
    </section>
  );
}
