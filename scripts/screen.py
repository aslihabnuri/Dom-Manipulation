"""CLI: python -m scripts.screen [KODE ...] [--equity 100000000]"""
import argparse
import json

from engine.screener import analyze_one, screen


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("tickers", nargs="*")
    ap.add_argument("--equity", type=float, default=100_000_000)
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()
    if args.tickers:
        for t in args.tickers:
            a = analyze_one(t, equity_idr=args.equity)
            if args.json:
                print(json.dumps(a.to_dict(), ensure_ascii=False, indent=2)); continue
            print(f"\n{a.ticker}  close {a.close:.0f}  tanggal {a.date}  setup {a.setup}")
            print("  gerbang :", "LOLOS" if a.passed_gates else "; ".join(a.gate_failures))
            print(f"  skor    : {a.score} (mentah {a.raw_score}) {a.components}")
            for r in a.reasons: print("  +", r)
            for w in a.warnings: print("  !", w)
            if a.plan:
                p = a.plan
                print(f"  entry {p.entry} stop {p.stop} (-{p.risk_pct*100:.1f}%) T1 {p.target1} T2 {p.target2} lot {p.lots} "
                      f"(Rp {p.position_value:,.0f}, risiko Rp {p.risk_amount:,.0f}) ARB/ARA {p.arb}/{p.ara}")
            for x in a.exit_signals: print("  EXIT:", x)
        return
    res = screen(equity_idr=args.equity)
    print(f"data s.d. {res['data_date']}  dianalisis {res['analyzed']}/{res['universe_size']}  kandidat {len(res['candidates'])}")
    print(f"{'kode':6}{'close':>8}{'skor':>6}{'mentah':>8}  setup / gerbang")
    for a in res["all"]:
        st = a["setup"] if a["passed_gates"] else "X " + a["gate_failures"][0]
        print(f"{a['ticker']:6}{a['close']:>8.0f}{a['score']:>6.0f}{a['raw_score']:>8.0f}  {st}")


if __name__ == "__main__":
    main()
