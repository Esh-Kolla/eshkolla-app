import { getAnalytics, getSubscriberCount } from "@/lib/db";

export const metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { key } = await searchParams;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || key !== adminPassword) {
    return (
      <div className="rounded-lg border border-terminal-border bg-terminal-bg p-8 text-center">
        <p className="text-[#ff5f57] text-sm mb-2">
          <span className="text-muted">$</span> sudo admin
        </p>
        <p className="text-muted text-sm">
          access denied: invalid credentials
        </p>
        <p className="text-dim text-xs mt-4 cursor-blink">_</p>
      </div>
    );
  }

  const stats7d = getAnalytics(7);
  const stats30d = getAnalytics(30);
  const statsAll = getAnalytics();
  const subscriberCount = getSubscriberCount();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-glow text-xl font-bold mb-2">
          <span className="text-accent">$</span> sudo analytics --dashboard
        </h1>
        <p className="text-dim text-xs">
          system analytics | real-time data | no tracking cookies
        </p>
      </div>

      {/* Overview Stats */}
      <div className="rounded-lg border border-terminal-border bg-terminal-bg p-5">
        <div className="text-xs text-dim mb-4">
          <span className="text-muted">$</span> analytics summary
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="7d views" value={stats7d.totalViews} />
          <StatBox label="30d views" value={stats30d.totalViews} />
          <StatBox label="all time" value={statsAll.totalViews} />
          <StatBox label="subscribers" value={subscriberCount} />
        </div>
      </div>

      {/* Top Pages */}
      <div className="rounded-lg border border-terminal-border bg-terminal-bg p-5">
        <div className="text-xs text-dim mb-4">
          <span className="text-muted">$</span> analytics top-pages --limit=10
        </div>
        {statsAll.topPages.length === 0 ? (
          <p className="text-dim text-sm">No page views recorded yet.</p>
        ) : (
          <div className="space-y-1">
            {statsAll.topPages.map((page, i) => (
              <div key={page.path} className="flex justify-between text-sm">
                <span className="text-muted">
                  <span className="text-dim">{String(i + 1).padStart(2, " ")}.</span>{" "}
                  {page.path}
                </span>
                <span className="text-accent">{page.views}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Referrers */}
      <div className="rounded-lg border border-terminal-border bg-terminal-bg p-5">
        <div className="text-xs text-dim mb-4">
          <span className="text-muted">$</span> analytics referrers --limit=10
        </div>
        {statsAll.topReferrers.length === 0 ? (
          <p className="text-dim text-sm">No referrers recorded yet.</p>
        ) : (
          <div className="space-y-1">
            {statsAll.topReferrers.map((ref, i) => (
              <div key={ref.referrer} className="flex justify-between text-sm">
                <span className="text-muted truncate mr-4">
                  <span className="text-dim">{String(i + 1).padStart(2, " ")}.</span>{" "}
                  {ref.referrer}
                </span>
                <span className="text-accent shrink-0">{ref.views}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Views Over Time */}
      <div className="rounded-lg border border-terminal-border bg-terminal-bg p-5">
        <div className="text-xs text-dim mb-4">
          <span className="text-muted">$</span> analytics views-by-day --days=30
        </div>
        {stats30d.viewsByDay.length === 0 ? (
          <p className="text-dim text-sm">No data for this period.</p>
        ) : (
          <div className="space-y-1">
            {stats30d.viewsByDay.map((day) => {
              const maxViews = Math.max(
                ...stats30d.viewsByDay.map((d) => d.views)
              );
              const barWidth = maxViews > 0 ? (day.views / maxViews) * 100 : 0;
              return (
                <div key={day.date} className="flex items-center gap-3 text-sm">
                  <span className="text-dim w-24 shrink-0">{day.date}</span>
                  <div className="flex-1 h-3 bg-[#1a1a1a] rounded overflow-hidden">
                    <div
                      className="h-full bg-accent rounded"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span className="text-muted w-8 text-right shrink-0">
                    {day.views}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-foreground text-glow">
        {value.toLocaleString()}
      </div>
      <div className="text-xs text-dim mt-1">{label}</div>
    </div>
  );
}
