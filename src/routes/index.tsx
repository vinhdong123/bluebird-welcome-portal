import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, ShieldCheck, Sparkles, UserRound, Zap } from "lucide-react";
import authVisual from "@/assets/auth-visual.jpg";
import { LoginForm, RegisterForm } from "@/components/auth/AuthForms";
import { BusinessLoginForm, BusinessRegisterForm } from "@/components/auth/BusinessForms";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Đăng nhập & Đăng ký | Nimbus" },
      {
        name: "description",
        content: "Đăng nhập hoặc tạo tài khoản Nimbus cho cá nhân và doanh nghiệp chỉ trong vài giây.",
      },
      { property: "og:title", content: "Đăng nhập & Đăng ký | Nimbus" },
      {
        property: "og:description",
        content: "Đăng nhập hoặc tạo tài khoản Nimbus mới chỉ trong vài giây.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "register";
type AccountType = "personal" | "business";

const copy: Record<AccountType, Record<Mode, { title: string; subtitle: string }>> = {
  personal: {
    login: { title: "Chào mừng trở lại 👋", subtitle: "Đăng nhập để tiếp tục hành trình của bạn." },
    register: { title: "Tạo tài khoản mới", subtitle: "Chỉ mất chưa đến một phút để bắt đầu." },
  },
  business: {
    login: { title: "Cổng doanh nghiệp", subtitle: "Đăng nhập để quản lý đội ngũ và hoạt động của công ty." },
    register: { title: "Đăng ký doanh nghiệp", subtitle: "Mở tài khoản cho công ty của bạn chỉ với 2 bước." },
  },
};

const panelCopy: Record<AccountType, { title: string; text: string; stat: string; statSub: string }> = {
  personal: {
    title: "Làm việc thông minh hơn, mỗi ngày.",
    text: "Kết nối, quản lý và phát triển cùng hàng nghìn người dùng đang tin tưởng Nimbus.",
    stat: "12.000+ người dùng",
    statSub: "đã tham gia trong tháng này",
  },
  business: {
    title: "Nền tảng vận hành cho doanh nghiệp hiện đại.",
    text: "Quản lý nhân sự, phân quyền và dữ liệu công ty tập trung tại một nơi, an toàn và minh bạch.",
    stat: "850+ doanh nghiệp",
    statSub: "đang vận hành trên Nimbus",
  },
};

const accountTypes = [
  { value: "personal", label: "Cá nhân", icon: UserRound },
  { value: "business", label: "Doanh nghiệp", icon: Building2 },
] as const;

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={cn(
          "flex size-9 items-center justify-center rounded-xl",
          light ? "bg-primary-foreground/15 backdrop-blur-md ring-1 ring-primary-foreground/25" : "bg-gradient-primary shadow-elegant",
        )}
      >
        <Sparkles className="size-[18px] text-primary-foreground" />
      </div>
      <span className={cn("text-lg font-bold tracking-tight", light ? "text-primary-foreground" : "text-foreground")}>
        Nimbus
      </span>
    </div>
  );
}

function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [accountType, setAccountType] = useState<AccountType>("personal");
  const panel = panelCopy[accountType];
  const text = copy[accountType][mode];

  return (
    <main className="min-h-screen bg-background bg-gradient-page">
      <div className="mx-auto grid min-h-screen max-w-[1400px] lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:p-4">
        {/* Visual panel */}
        <aside className="relative hidden overflow-hidden rounded-[2rem] lg:block">
          <img
            src={authVisual}
            alt="Hình khối thủy tinh xanh trừu tượng"
            width={1024}
            height={1408}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-panel" />

          <div className="relative flex h-full flex-col justify-between p-10 xl:p-12">
            <Logo light />

            <div key={accountType} className="max-w-md animate-fade-up space-y-6">
              <h2 className="text-4xl font-bold leading-tight tracking-tight text-primary-foreground xl:text-5xl">
                {panel.title}
              </h2>
              <p className="text-base leading-relaxed text-primary-foreground/80">{panel.text}</p>

              <div className="animate-float-slow rounded-2xl bg-primary-foreground/12 p-5 ring-1 ring-primary-foreground/20 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2.5">
                    {["A", "M", "T", "L"].map((c, i) => (
                      <span
                        key={c}
                        className={cn(
                          "flex size-9 items-center justify-center rounded-full text-xs font-bold ring-2 ring-primary-foreground/40",
                          i % 2 ? "bg-primary-glow text-primary-deep" : "bg-primary-foreground text-primary",
                        )}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-foreground">{panel.stat}</p>
                    <p className="text-xs text-primary-foreground/70">{panel.statSub}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-6 text-sm text-primary-foreground/85">
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-4" /> Bảo mật chuẩn ngân hàng
              </span>
              <span className="flex items-center gap-2">
                <Zap className="size-4" /> Nhanh chóng, mượt mà
              </span>
            </div>
          </div>
        </aside>

        {/* Form panel */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[440px]">
            <div className="mb-10 lg:hidden">
              <Logo />
            </div>

            {/* Account type */}
            <div className="mb-4 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Loại tài khoản">
              {accountTypes.map(({ value, label, icon: Icon }) => {
                const active = accountType === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setAccountType(value)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                      active
                        ? "border-primary bg-accent shadow-elegant"
                        : "border-border bg-card hover:border-primary/40",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-lg transition-colors",
                        active ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="size-[18px]" />
                    </span>
                    <span className={cn("text-sm font-semibold", active ? "text-primary" : "text-foreground")}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Segmented toggle */}
            <div className="relative mb-8 grid grid-cols-2 rounded-xl bg-muted p-1">
              <span
                aria-hidden
                className={cn(
                  "absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-lg bg-card shadow-card transition-transform duration-300 ease-out",
                  mode === "register" && "translate-x-full",
                )}
              />
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  aria-pressed={mode === m}
                  className={cn(
                    "relative z-10 h-10 rounded-lg text-sm font-semibold transition-colors",
                    mode === m ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {m === "login" ? "Đăng nhập" : "Đăng ký"}
                </button>
              ))}
            </div>

            <div key={`${accountType}-${mode}`} className="animate-fade-up">
              <header className="mb-7 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{text.title}</h1>
                <p className="text-muted-foreground">{text.subtitle}</p>
              </header>

              {accountType === "personal" ? (
                mode === "login" ? (
                  <LoginForm onSwitch={() => setMode("register")} />
                ) : (
                  <RegisterForm onSwitch={() => setMode("login")} />
                )
              ) : mode === "login" ? (
                <BusinessLoginForm onSwitch={() => setMode("register")} />
              ) : (
                <BusinessRegisterForm onSwitch={() => setMode("login")} />
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
