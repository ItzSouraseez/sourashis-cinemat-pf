/* ─────────────────────────────────────────────────────────────
   DAILIES — the only file you need to edit to add work.

   For each film:
     url     : any YouTube link (watch?v=, youtu.be/, shorts/, embed/)
     title   : film title
     client  : brand / artist / channel
     date    : release date "YYYY-MM-DD" — the grid sorts newest first
     runtime : "9:14" (optional)
     roles   : any of "direct", "shoot", "edit"   (drives the filters)
     format  : e.g. "Brand Film", "Music Video", "Documentary"
     note    : one line on what you did / the idea (optional)
     featured: true  → shows bigger in the grid (optional)

   Thumbnails are pulled from YouTube automatically.
   ───────────────────────────────────────────────────────────── */

window.DAILIES = [
  { url: "https://www.youtube.com/watch?v=ORV0lnPtBJs", title: "Renting vs Buying a Home in India: The 6.87% Rule", client: "Get On Trackk", date: "2026-11-13", runtime: "9:14", roles: ["direct", "shoot"], format: "Finance Explainer", featured: true },
  { url: "https://www.youtube.com/watch?v=2u_jBe5UCCA", title: "AI Market Crash: What To Do Now?", client: "Invest On Trackk", date: "2026-11-05", runtime: "5:23", roles: ["direct", "shoot"], format: "Finance Explainer" },
  { url: "https://www.youtube.com/watch?v=TINznWVljIA", title: "Don't Buy Gold Before Watching This", client: "Invest On Trackk", date: "2026-10-31", runtime: "5:45", roles: ["direct", "shoot"], format: "Finance Explainer" },
  { url: "https://www.youtube.com/watch?v=2kpOAoArpvw", title: "Gold Prices Crash to 1-Year Low — Should You Buy?", client: "Get On Trackk", date: "2026-10-28", runtime: "6:31", roles: ["direct", "shoot"], format: "Finance Explainer" },
  { url: "https://www.youtube.com/watch?v=IVjMHoM_CTE", title: "Jio IPO 2026: Financials, Risks, Strengths, Mega Investors", client: "Invest On Trackk", date: "2026-10-20", runtime: "4:18", roles: ["direct", "shoot"], format: "Finance Explainer" },
  { url: "https://www.youtube.com/watch?v=N31OpLqqA0M", title: "5 Ways to Get Monthly Income Without Working", client: "Get On Trackk", date: "2026-10-19", runtime: "9:04", roles: ["direct", "shoot"], format: "Finance Explainer" },
  { url: "https://www.youtube.com/watch?v=0UhT-39ZUhw", title: "Escape the 9-5 Trap (Final Answer)", client: "Get On Trackk", date: "2026-10-12", runtime: "9:41", roles: ["direct", "shoot"], format: "Finance Explainer" },
  { url: "https://www.youtube.com/watch?v=1kMh3sgbfd0", title: "Best SIP + Lumpsum Investing Strategy for 2027", client: "Invest On Trackk", date: "2026-10-10", runtime: "6:40", roles: ["direct", "shoot"], format: "Finance Explainer" },
  { url: "https://www.youtube.com/watch?v=zs3zXkKaHZc", title: "A Strategy to Earn More Returns Than Your SIP", client: "Invest On Trackk", date: "2026-10-04", runtime: "5:29", roles: ["direct", "shoot"], format: "Finance Explainer" },
  { url: "https://www.youtube.com/watch?v=rAbvh8CR6w8", title: "Your Ultimate Cheat Code to 1 Crore", client: "Invest On Trackk", date: "2026-09-22", runtime: "8:43", roles: ["direct", "shoot"], format: "Finance Explainer" },
  { url: "https://www.youtube.com/watch?v=vGeCfKK697Q", title: "Must Watch Before You Invest in the NSE IPO", client: "Invest On Trackk", date: "2026-09-15", runtime: "6:47", roles: ["direct", "shoot"], format: "Finance Explainer" },
  { url: "https://www.youtube.com/watch?v=p17GmZCB__o", title: "5 Ways to Get Better Returns on Your Investments", client: "Get On Trackk", date: "2026-09-13", runtime: "9:59", roles: ["direct", "shoot"], format: "Finance Explainer" },
  { url: "https://www.youtube.com/watch?v=g2QKq7LCjUg", title: "Stocks or ETFs? The Better Investment Choice", client: "Invest On Trackk", date: "2026-09-09", runtime: "7:33", roles: ["direct", "shoot"], format: "Finance Explainer" },
  { url: "https://www.youtube.com/watch?v=sDbi_9DkQ18", title: "How Young Indians Can Escape the Middle-Class Trap", client: "Get On Trackk", date: "2026-09-02", runtime: "9:17", roles: ["direct", "shoot"], format: "Finance Explainer" },
  { url: "https://www.youtube.com/watch?v=5x-6hn_pcsQ", title: "The Exact Plan You Need to Make Your First Crore", client: "Invest On Trackk", date: "2026-08-31", runtime: "7:16", roles: ["direct", "shoot"], format: "Finance Explainer" },
  { url: "https://www.youtube.com/watch?v=WrTIV-WKWVU", title: "The Ultimate Money Trap for Gen Z", client: "Get On Trackk", date: "2026-08-20", runtime: "9:06", roles: ["direct", "shoot"], format: "Finance Explainer" },
  { url: "https://www.youtube.com/watch?v=cCnpF3TNzeA", title: "300 Builders. 24 Hours. Inside VibeCon — Day 1", client: "Polaris School of Technology", date: "2026-05-25", runtime: "9:46", roles: ["shoot"], format: "Event Film" },
  { url: "https://www.youtube.com/watch?v=EeEP-u539Q8", title: "Investigating Polaris School of Technology", client: "Pathshala by Nova", date: "2026-04-29", runtime: "16:18", roles: ["direct", "shoot"], format: "Documentary" },
  { url: "https://www.youtube.com/watch?v=fPUSGm86JbU", title: "Polaris Constellation Week 2025 — Highlight Film", client: "Polaris School of Technology", date: "2026-02-17", runtime: "11:46", roles: ["shoot"], format: "Highlight Film" },
];
