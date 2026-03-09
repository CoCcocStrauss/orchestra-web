"use client";

import React from "react";

type ViewType = "重奏" | "团建";

type EnsemblePost = {
  id: number;
  title: string;
  piece: string;
  existingParts: string[];
  neededParts: string[];
  publishedAt: string;
  contactName: string;
  contactInfo: string;
  wechatGroupName: string;
  description: string;
};

type GatheringPost = {
  id: number;
  title: string;
  summary: string;
  details: string;
  publishedAt: string;
  publisher: string;
  contactName: string;
  contactInfo: string;
  wechatGroupName: string;
};

const ensemblePosts: EnsemblePost[] = [
  {
    id: 1,
    title: "木管五重奏",
    piece: "蓝色狂想曲（节选）",
    existingParts: ["长笛", "单簧管", "圆号"],
    neededParts: ["双簧管", "大管"],
    publishedAt: "今天 10:20",
    contactName: "李老师",
    contactInfo: "微信：woodwind-coach（模拟数据）",
    wechatGroupName: "木管五重奏排练群",
    description:
      "计划于下月音乐沙龙演出《蓝色狂想曲》改编版，招募长期稳定的双簧管与大管团员，每周一次排练，时间可根据大家课业与工作情况协商。",
  },
  {
    id: 2,
    title: "弦乐四重奏",
    piece: "德沃夏克《美第》",
    existingParts: ["第一小提琴", "第二小提琴"],
    neededParts: ["中提琴", "大提琴"],
    publishedAt: "昨天 21:05",
    contactName: "王同学",
    contactInfo: "微信：string-quartet（模拟数据）",
    wechatGroupName: "弦乐四重奏备选群",
    description:
      "计划报名校内室内乐比赛和外出演出，优先考虑有一定重奏经验的团员，如有意向欢迎添加联系人进群了解排练安排与曲目细节。",
  },
];

const gatheringPosts: GatheringPost[] = [
  {
    id: 1,
    title: "周日排练后团建 · 火锅局",
    summary:
      "本周日排练结束后在排练厅旁边火锅店团建，欢迎所有团员参加，费用 AA 制。请提前一天在微信群接龙方便预订座位。",
    details:
      "时间：本周日排练结束后 18:30 集合。\n地点：乐团排练厅对面「小聚火锅」。\n费用：人均约 80-100 元，AA 制。\n说明：欢迎带上家属或朋友一起来，方便的话在群内接龙备注人数，素食/忌口可以单独说明以便预订。\n着装：日常便装即可，无特殊要求。",
    publishedAt: "昨天 18:45",
    publisher: "团委",
    contactName: "团委小李",
    contactInfo: "微信：orchestra-admin（模拟数据）",
    wechatGroupName: "周日团建火锅群",
  },
  {
    id: 2,
    title: "期末后放松 · 密室+奶茶",
    summary:
      "期末演出结束后一周，准备组织一次轻松的线下活动：密室逃脱 + 奶茶，缓解大家备考和演出压力，有兴趣的同学可以先点进详情了解大概安排。",
    details:
      "时间：期末音乐会结束后一周内（具体日期在群内投票确定）。\n活动安排：下午密室逃脱一场，结束后就近喝奶茶或简单聚会聊天。\n费用：根据实际项目 AA 制，控制在人均 150 元以内。\n说明：本次活动以轻松社交为主，欢迎不同声部的团员互相认识结交，具体密室主题会在群内投票选择。",
    publishedAt: "本周一 14:10",
    publisher: "活动组",
    contactName: "活动组阿程",
    contactInfo: "微信：orch-fun（模拟数据）",
    wechatGroupName: "期末后放松活动群",
  },
];

type ModalState =
  | { type: "none" }
  | { type: "ensemble"; post: EnsemblePost }
  | { type: "gathering"; post: GatheringPost };

export default function CommunityPage() {
  const [view, setView] = React.useState<ViewType>("重奏");
  const [modal, setModal] = React.useState<ModalState>({ type: "none" });

  const openEnsemble = (post: EnsemblePost) =>
    setModal({ type: "ensemble", post });
  const openGathering = (post: GatheringPost) =>
    setModal({ type: "gathering", post });
  const closeModal = () => setModal({ type: "none" });

  const isEnsemble = view === "重奏";

  return (
    <div className="space-y-4">
      <header className="mb-1 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">公告板</h1>
          <p className="mt-1 text-xs text-zinc-500">
            渐进式查看重奏与团建信息
          </p>
        </div>
        <ViewToggle value={view} onChange={setView} />
      </header>

      <section className="space-y-3">
        {isEnsemble
          ? ensemblePosts.map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => openEnsemble(post)}
                className="w-full rounded-2xl border border-zinc-100 bg-zinc-50/70 p-3 text-left shadow-[0_1px_4px_rgba(15,23,42,0.06)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-900">
                      {post.title}
                    </h2>
                    <p className="mt-0.5 text-[11px] text-zinc-500">
                      排练曲目：{post.piece}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                  <Badge variant="soft">已有：{post.existingParts.join("、")}</Badge>
                  <Badge variant="danger">
                    需要：{post.neededParts.join("、")}
                  </Badge>
                </div>
                <p className="mt-2 text-[11px] text-zinc-400">
                  发布时间：{post.publishedAt}
                </p>
              </button>
            ))
          : gatheringPosts.map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => openGathering(post)}
                className="w-full rounded-2xl border border-zinc-100 bg-zinc-50/70 p-3 text-left shadow-[0_1px_4px_rgba(15,23,42,0.06)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <h2 className="text-sm font-semibold text-zinc-900">
                  {post.title}
                </h2>
                <p className="mt-1 line-clamp-2 text-xs text-zinc-600">
                  {post.summary}
                </p>
                <p className="mt-2 text-[11px] text-zinc-400">
                  发布人：{post.publisher} · 发布时间：{post.publishedAt}
                </p>
              </button>
            ))}
      </section>

      <DetailModal state={modal} onClose={closeModal} />
    </div>
  );
}

type ViewToggleProps = {
  value: ViewType;
  onChange: (v: ViewType) => void;
};

function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-full bg-zinc-100 p-1 text-xs">
      {(["重奏", "团建"] as ViewType[]).map((tab) => {
        const active = value === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`min-w-[64px] rounded-full px-3 py-1 text-center transition-colors ${
              active
                ? "bg-zinc-900 text-white shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

type BadgeProps = {
  children: React.ReactNode;
  variant?: "soft" | "danger";
};

function Badge({ children, variant = "soft" }: BadgeProps) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium";
  const styles =
    variant === "danger"
      ? "bg-amber-100 text-amber-700"
      : "bg-zinc-100 text-zinc-700";

  return <span className={`${base} ${styles}`}>{children}</span>;
}

type DetailModalProps = {
  state: ModalState;
  onClose: () => void;
};

function DetailModal({ state, onClose }: DetailModalProps) {
  if (state.type === "none") return null;

  const isEnsemble = state.type === "ensemble";
  const title = isEnsemble ? state.post.title : state.post.title;

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 px-4 pb-safe">
      <button
        aria-label="关闭详情"
        className="absolute inset-0 h-full w-full"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-4 shadow-xl transition-transform duration-200 ease-out">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-zinc-100 px-2 py-1 text-[11px] text-zinc-600"
          >
            关闭
          </button>
        </div>

        {isEnsemble ? (
          <div className="space-y-3 text-xs text-zinc-700">
            <p className="whitespace-pre-line leading-relaxed">
              {state.post.description}
            </p>
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-zinc-500">
                已有声部：{state.post.existingParts.join("、")}
              </p>
              <p className="text-[11px] font-medium text-amber-600">
                需要声部：{state.post.neededParts.join("、")}
              </p>
            </div>
            <div className="space-y-1 rounded-2xl bg-zinc-50 p-3">
              <p className="text-[11px] font-medium text-zinc-500">联系人</p>
              <p className="text-xs text-zinc-800">{state.post.contactName}</p>
              <p className="mt-0.5 text-[11px] text-zinc-600">
                {state.post.contactInfo}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-zinc-500">
                微信群二维码（占位）
              </p>
              <div className="flex items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 py-6">
                <div className="h-20 w-20 rounded-xl bg-zinc-200" />
              </div>
              <p className="text-[11px] text-zinc-400">
                加入「{state.post.wechatGroupName}」后可同步最新排练安排。
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-xs text-zinc-700">
            <p className="whitespace-pre-line leading-relaxed">
              {state.post.details}
            </p>
            <div className="space-y-1 rounded-2xl bg-zinc-50 p-3">
              <p className="text-[11px] font-medium text-zinc-500">联系人</p>
              <p className="text-xs text-zinc-800">{state.post.contactName}</p>
              <p className="mt-0.5 text-[11px] text-zinc-600">
                {state.post.contactInfo}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-zinc-500">
                微信接龙二维码（占位）
              </p>
              <div className="flex items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 py-6">
                <div className="h-20 w-20 rounded-xl bg-zinc-200" />
              </div>
              <p className="text-[11px] text-zinc-400">
                扫码进入「{state.post.wechatGroupName}」参与接龙和活动确认。
              </p>
            </div>
            <p className="pt-1 text-[11px] text-zinc-400">
              发布人：{state.post.publisher} · 发布时间：
              {state.post.publishedAt}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


