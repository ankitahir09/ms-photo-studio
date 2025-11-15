import React, { useEffect, useState } from "react";
import { getApiBaseUrl } from "../utils/apiBase";

function Diagnostics() {
  const [results, setResults] = useState([]);
  const [running, setRunning] = useState(false);

  const tests = [
    { id: "health", label: "API Health", path: "/api/health" },
    { id: "homeBg", label: "Images: homeBg", path: "/api/images?category=homeBg" },
    { id: "child", label: "Images: childphotos", path: "/api/images?category=childphotos" },
  ];

  async function runTests() {
    setRunning(true);
    const base = getApiBaseUrl();
    const startedAt = new Date().toISOString();

    const runners = tests.map(async (t) => {
      const url = `${base}${t.path}`;
      const out = { id: t.id, label: t.label, url, ok: false, status: null, error: null, body: null };
      try {
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        out.status = res.status;
        let bodyText = await res.text();
        try { out.body = JSON.parse(bodyText); } catch { out.body = bodyText?.slice(0, 1000); }
        out.ok = res.ok;
      } catch (e) {
        out.error = e?.message || String(e);
      }
      return out;
    });

    const data = await Promise.all(runners);
    setResults([{ id: "meta", label: "Meta", url: window.location.href, ok: true, status: 200, body: {
      startedAt,
      apiBaseUrl: getApiBaseUrl() || "(same-origin)",
      origin: window.location.origin,
      pathname: window.location.pathname,
      userAgent: navigator.userAgent,
    }}, ...data]);
    setRunning(false);
  }

  useEffect(() => { runTests(); }, []);

  return (
    <section className="min-h-[100svh] px-6 py-10">
      <h1 className="text-2xl font-bold mb-4">Diagnostics</h1>
      <p className="text-sm text-gray-600 mb-6">Quick checks for API reachability and common categories.</p>
      <div className="mb-4">
        <button disabled={running} onClick={runTests} className="px-4 py-2 bg-black text-white rounded disabled:opacity-50">
          {running ? "Running..." : "Re-run tests"}
        </button>
      </div>
      <div className="space-y-4">
        {results.map((r) => (
          <div key={r.id} className="border p-4 rounded">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">{r.label}</div>
              <div className={r.ok ? "text-green-700" : "text-red-700"}>{r.ok ? "OK" : "FAIL"}{r.status ? ` (${r.status})` : ""}</div>
            </div>
            <div className="text-xs break-all text-gray-700 mb-2">URL: {r.url}</div>
            {r.error && <div className="text-xs text-red-700 mb-2">Error: {r.error}</div>}
            {r.body && (
              <pre className="text-xs whitespace-pre-wrap bg-gray-50 p-2 rounded max-h-64 overflow-auto">{typeof r.body === 'string' ? r.body : JSON.stringify(r.body, null, 2)}</pre>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Diagnostics;


