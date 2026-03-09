 "use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useUser();

  const initials =
    user?.name?.slice(0, 2) || user?.name?.slice(0, 1) || "--";

  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);
  const [reportData, setReportData] = React.useState<any[]>([]);
  const [reportLoading, setReportLoading] = React.useState(false);
  const [memberRate, setMemberRate] = React.useState<number | null>(null);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isAdmin = user?.role === "admin";

  const handleOpenReport = () => {
    setIsReportModalOpen(true);
    setReportLoading(true);
  };

  const handleCloseReport = () => {
    if (reportLoading) return;
    setIsReportModalOpen(false);
    setReportData([]);
  };

  React.useEffect(() => {
    if (!isReportModalOpen) return;

    const fetchReport = async () => {
      setReportLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select(
          "id, name, section, attendances(rehearsal_id, rehearsals!inner(type))",
        )
        .eq("role", "member");

      if (error) {
        console.warn("[Profile] 加载全团出勤报表失败：", error.message);
        setReportData([]);
        setReportLoading(false);
        return;
      }

      const withCounts =
        (data ?? []).map((row: any) => {
          const records: any[] = Array.isArray(row.attendances)
            ? row.attendances
            : [];
          const fullCount = records.filter((rec: any) => {
            const rehearsal = rec.rehearsals as { type?: string } | undefined;
            return rehearsal?.type === "full";
          }).length;
          return { ...row, _attendanceCount: fullCount };
        }) ?? [];

      withCounts.sort(
        (a: any, b: any) => b._attendanceCount - a._attendanceCount,
      );

      setReportData(withCounts);
      setReportLoading(false);
    };

    void fetchReport();
  }, [isReportModalOpen]);

  React.useEffect(() => {
    if (!user || user.role !== "member") {
      return;
    }

    const computeRate = async () => {
      const now = new Date();

      const { data: rehearsals, error: rehError } = await supabase
        .from("rehearsals")
        .select("id, start_time")
        .eq("type", "full");

      if (rehError) {
        console.warn("[Profile] 加载合排数据失败：", rehError.message);
        setMemberRate(100);
        return;
      }

      const allFull = Array.isArray(rehearsals) ? rehearsals : [];
      const pastFullRehearsals = allFull.filter((r: any) => {
        if (!r.start_time) return false;
        const start = new Date(r.start_time);
        if (Number.isNaN(start.getTime())) return false;
        return start < now;
      });

      const totalFull = pastFullRehearsals.length;

      const { data: attendances, error: attError } = await supabase
        .from("attendances")
        .select("rehearsal_id")
        .eq("user_id", user.id);

      if (attError) {
        console.warn("[Profile] 加载个人出勤失败：", attError.message);
        setMemberRate(100);
        return;
      }

      const pastIds = new Set(
        pastFullRehearsals.map((r: any) => r.id as number),
      );

      const myAtt = Array.isArray(attendances) ? attendances : [];
      let attendedFull = 0;
      for (const row of myAtt) {
        if (pastIds.has(row.rehearsal_id)) {
          attendedFull += 1;
        }
      }

      if (totalFull === 0) {
        setMemberRate(100);
        return;
      }

      const pct = Math.round((attendedFull / totalFull) * 100);
      const clamped = Math.min(100, Math.max(0, pct));
      setMemberRate(clamped);
    };

    void computeRate();
  }, [user]);

  const currentMemberRate = memberRate ?? 85;
  const barWidth = `${Math.min(100, Math.max(0, currentMemberRate))}%`;

  return (
    <div className="space-y-6">
      <header className="mt-1 flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wide text-zinc-500">
            当前登录成员
          </p>
          <h1 className="text-lg font-semibold text-zinc-900">
            {user?.name ?? "未登录用户"} · {user?.section ?? "声部待识别"}
          </h1>
          <p className="text-xs text-zinc-500">加入乐团第 3 年（示意数据）</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-medium text-white">
          {initials}
        </div>
      </header>

      {isAdmin ? (
        <section className="space-y-3 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-3 shadow-[0_1px_4px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="text-[11px] font-medium text-zinc-600">
                乐团考勤数据
              </p>
              <p className="mt-1 text-base font-semibold text-zinc-900">
                出勤统计
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-center text-[10px] font-medium text-emerald-700">
              ALL
            </div>
          </div>
          <p className="text-[11px] text-zinc-500">
            点击下方按钮查看所有团员的累计打卡次数（示意数据，用于作品集展示）。
          </p>
          <button
            type="button"
            onClick={handleOpenReport}
            className="flex w-full items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-zinc-800"
          >
            📊 查看全团出勤报表
          </button>
        </section>
      ) : (
        <section className="space-y-2 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-3 shadow-[0_1px_4px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-zinc-700">出勤率</span>
            <span className="font-semibold text-emerald-600">
              {currentMemberRate}%
            </span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-zinc-200">
            <div
              className="h-2 rounded-full bg-emerald-500"
              style={{ width: barWidth }}
            />
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            近三个月排练与演出到勤情况统计。
          </p>
        </section>
      )}

      <section className="mt-6">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 shadow-sm hover:bg-red-100"
        >
          <LogOut className="h-4 w-4" />
          <span>退出体验（Logout）</span>
        </button>
      </section>

      {isAdmin && isReportModalOpen && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 px-4 pb-safe">
          <button
            aria-label="关闭全团出勤报表弹窗"
            className="absolute inset-0 h-full w-full"
            onClick={handleCloseReport}
            disabled={reportLoading}
          />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-4 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-base font-semibold text-zinc-900">
                全团出勤报表
              </h2>
              <button
                type="button"
                onClick={handleCloseReport}
                disabled={reportLoading}
                className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] text-zinc-600 hover:bg-zinc-200"
              >
                关闭
              </button>
            </div>
            <p className="mb-3 text-[11px] text-zinc-500">
              （注：为保证公平，本榜单仅自动统计合排。分排出勤由管理员在此基础上另行加分）
            </p>

            <div className="max-h-64 space-y-2 overflow-y-auto pt-1">
              {reportLoading ? (
                <p className="py-6 text-center text-[11px] text-zinc-400">
                  正在生成报表...
                </p>
              ) : reportData.length === 0 ? (
                <p className="py-6 text-center text-[11px] text-zinc-400">
                  暂无团员出勤数据
                </p>
              ) : (
                reportData.map((row: any) => {
                  const name: string = row.name ?? "未命名成员";
                  const section: string = row.section ?? "声部未登记";
                  const count: number = row._attendanceCount ?? 0;
                  const avatar = name.slice(0, 2);
                  return (
                    <div
                      key={row.id}
                      className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 px-3 py-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-medium text-white">
                          {avatar}
                        </div>
                        <div>
                          <p className="text-[11px] font-medium text-zinc-900">
                            {name}
                          </p>
                          <p className="text-[10px] text-zinc-500">
                            {section}
                          </p>
                        </div>
                      </div>
                      <p className="text-[11px] font-semibold text-emerald-600">
                        已出勤 {count} 次
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-4 flex items-center justify-end">
              <button
                type="button"
                onClick={handleCloseReport}
                disabled={reportLoading}
                className="rounded-full bg-zinc-900 px-4 py-1.5 text-[11px] font-medium text-white shadow-sm hover:bg-zinc-800 disabled:opacity-60"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


