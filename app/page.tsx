import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 🔥 change this later to your real bankroll
const BANKROLL = 1000;

export default async function Home() {
  const { data } = await supabase.from("signals").select("*");

  const sorted = data?.sort((a: any, b: any) => b.edge - a.edge);
  const strongBuys = sorted?.filter((row: any) => row.signal === "Strong Buy");

  const getSignalColor = (signal: string) => {
    if (signal === "Strong Buy") return "bg-green-500";
    if (signal === "Lean Buy") return "bg-yellow-400 text-black";
    if (signal === "Avoid") return "bg-red-500";
    return "bg-gray-500";
  };

  const getBetSize = (edge: number) => {
    if (edge >= 20) return "High ($$$)";
    if (edge >= 10) return "Medium ($$)";
    if (edge >= 5) return "Low ($)";
    return "No Bet";
  };

  // 🔥 NEW: actual dollar recommendation
  const getBetAmount = (edge: number) => {
    if (edge >= 20) return BANKROLL * 0.1;   // 10%
    if (edge >= 10) return BANKROLL * 0.05;  // 5%
    if (edge >= 5) return BANKROLL * 0.02;   // 2%
    return 0;
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 space-y-8">
      <h1 className="text-3xl font-bold">Kalshi Trading Command Center</h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Best Trade</div>
          <div className="text-2xl font-bold text-green-400">
            {sorted?.[0]?.market ?? "None"}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Strong Buys</div>
          <div className="text-2xl font-bold">{strongBuys?.length ?? 0}</div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Best Edge</div>
          <div className="text-2xl font-bold text-green-400">
            {sorted?.[0]?.edge ? `+${sorted[0].edge}%` : "0%"}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Bankroll</div>
          <div className="text-2xl font-bold">${BANKROLL}</div>
        </div>
      </div>

      {/* TOP OPPORTUNITIES */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-green-400">
          🔥 Top Opportunities (Strong Buy)
        </h2>

        <div className="grid gap-4">
          {strongBuys?.map((row: any) => (
            <div
              key={row.id}
              className="border border-gray-700 p-4 rounded-lg bg-gray-900"
            >
              <div className="text-lg font-bold">{row.market}</div>
              <div className="text-sm text-gray-400 mb-2">{row.category}</div>

              <div className="flex gap-6 text-sm flex-wrap">
                <div>Model: {row.model_probability}%</div>
                <div>Market: {row.market_probability}%</div>
                <div className="text-green-400 font-bold">
                  Edge: +{row.edge}%
                </div>
                <div>EV: ${row.ev}</div>
              </div>

              <div className="mt-2 text-sm text-blue-400 font-semibold">
                Bet Size: {getBetSize(row.edge)}
              </div>

              <div className="mt-1 text-sm text-purple-400 font-semibold">
                💰 Bet Amount: ${getBetAmount(row.edge).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div>
        <h2 className="text-xl font-bold mb-4">📊 All Markets</h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th className="p-3 text-left">Market</th>
                <th className="p-3">Category</th>
                <th className="p-3">Model %</th>
                <th className="p-3">Market %</th>
                <th className="p-3">Edge</th>
                <th className="p-3">EV</th>
                <th className="p-3">Signal</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Bet Size</th>
                <th className="p-3">Bet $</th>
              </tr>
            </thead>

            <tbody>
              {sorted?.map((row: any) => (
                <tr key={row.id} className="border-t border-gray-700">
                  <td className="p-3">{row.market}</td>
                  <td className="p-3 text-center">{row.category}</td>
                  <td className="p-3 text-center">{row.model_probability}%</td>
                  <td className="p-3 text-center">{row.market_probability}%</td>
                  <td className="p-3 text-center">
                    {row.edge > 0 ? "+" : ""}
                    {row.edge}%
                  </td>
                  <td className="p-3 text-center">${row.ev}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded ${getSignalColor(
                        row.signal
                      )}`}
                    >
                      {row.signal}
                    </span>
                  </td>
                  <td className="p-3 text-center">{row.confidence}%</td>
                  <td className="p-3 text-center">{getBetSize(row.edge)}</td>
                  <td className="p-3 text-center">
                    ${getBetAmount(row.edge).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
// the end