"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();

  const handleAdminLogin = () => {
    login({
      id: "11111111-1111-1111-1111-111111111111",
      name: "管理员测试",
      role: "admin",
      section: "指挥 / 管理员",
    });
    router.push("/");
  };

  const handleMemberLogin = () => {
    login({
      id: "22222222-2222-2222-2222-222222222222",
      name: "团员测试",
      role: "member",
      section: "第一小提琴",
    });
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-xs text-center">
        <h1 className="text-xl font-semibold text-zinc-900">
          乐团管理助手
        </h1>
        <p className="mt-2 text-xs text-zinc-500">请选择您的体验身份</p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleMemberLogin}
            className="flex w-full items-center justify-between rounded-2xl bg-zinc-900 px-4 py-3 text-left text-sm font-medium text-white shadow-md active:scale-[0.99]"
          >
            <span>🎻 以团员身份体验</span>
            <span className="text-[10px] text-zinc-300">
              以普通团员视角浏览
            </span>
          </button>

          <button
            type="button"
            onClick={handleAdminLogin}
            className="flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm font-medium text-zinc-900 shadow-sm active:scale-[0.99]"
          >
            <span>👨‍💼 以管理员身份体验</span>
            <span className="text-[10px] text-zinc-500">
              拥有完整管理视角
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

