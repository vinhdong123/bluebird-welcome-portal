import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Hash,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthField } from "./AuthField";
import { getPasswordStrength, strengthLabels } from "@/lib/password-strength";
import { companySizes, isValidTaxCode, isValidVnPhone } from "@/lib/business-validation";
import { cn } from "@/lib/utils";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function SsoButton() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        hoặc
        <span className="h-px flex-1 bg-border" />
      </div>
      <Button
        type="button"
        variant="social"
        size="xl"
        className="w-full"
        onClick={() => toast.info("Đăng nhập một lần (SSO) sẽ sớm được hỗ trợ")}
      >
        <KeyRound className="text-primary" /> Đăng nhập một lần (SSO)
      </Button>
    </div>
  );
}

/* ---------------- Business login ---------------- */

const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập email hoặc mã số thuế")
    .refine(
      (v) => z.string().email().safeParse(v).success || isValidTaxCode(v),
      "Nhập email công việc hoặc mã số thuế hợp lệ",
    ),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
  remember: z.boolean().optional(),
});
type LoginValues = z.infer<typeof loginSchema>;

export function BusinessLoginForm({ onSwitch }: { onSwitch: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { remember: true } });

  const onSubmit = async (values: LoginValues) => {
    await wait(1100);
    toast.success("Đăng nhập doanh nghiệp thành công", { description: values.identifier });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <AuthField
        label="Email công việc hoặc mã số thuế"
        placeholder="ten@congty.vn hoặc 0101234567"
        autoComplete="username"
        icon={<Building2 />}
        error={errors.identifier?.message}
        {...register("identifier")}
      />
      <AuthField
        label="Mật khẩu"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        icon={<Lock />}
        error={errors.password?.message}
        trailing={
          <button
            type="button"
            onClick={() => toast.info("Liên kết đặt lại mật khẩu sẽ được gửi tới email doanh nghiệp")}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Quên mật khẩu?
          </button>
        }
        {...register("password")}
      />
      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground select-none">
        <input type="checkbox" className="size-4 rounded accent-primary" {...register("remember")} />
        Ghi nhớ đăng nhập
      </label>

      <Button type="submit" variant="hero" size="xl" className="group w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            Đăng nhập doanh nghiệp
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </Button>

      <SsoButton />

      <p className="text-center text-sm text-muted-foreground">
        Doanh nghiệp chưa có tài khoản?{" "}
        <button type="button" onClick={onSwitch} className="font-semibold text-primary hover:underline">
          Đăng ký ngay
        </button>
      </p>
    </form>
  );
}

/* ---------------- Business register (2 steps) ---------------- */

const registerSchema = z
  .object({
    company: z.string().trim().min(2, "Tên doanh nghiệp tối thiểu 2 ký tự").max(150, "Tên quá dài"),
    taxCode: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập mã số thuế")
      .refine(isValidTaxCode, "Mã số thuế gồm 10 số hoặc dạng 0101234567-001"),
    size: z.string().min(1, "Vui lòng chọn quy mô"),
    contact: z.string().trim().min(2, "Họ tên tối thiểu 2 ký tự").max(80, "Họ tên quá dài"),
    email: z.string().trim().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
    phone: z.string().trim().min(1, "Vui lòng nhập số điện thoại").refine(isValidVnPhone, "Số điện thoại không hợp lệ"),
    password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
    confirm: z.string().min(1, "Vui lòng nhập lại mật khẩu"),
    terms: z.literal(true, { errorMap: () => ({ message: "Bạn cần đồng ý với điều khoản" }) }),
  })
  .refine((d) => d.password === d.confirm, { message: "Mật khẩu nhập lại không khớp", path: ["confirm"] });
type RegisterValues = z.infer<typeof registerSchema>;

const steps = ["Thông tin doanh nghiệp", "Tài khoản quản trị"];

export function BusinessRegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema), defaultValues: { size: "" } });
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const password = watch("password") ?? "";
  const strength = getPasswordStrength(password);
  const strengthColor = ["bg-border", "bg-destructive", "bg-warning", "bg-primary-glow", "bg-success"][strength];

  const next = async () => {
    const ok = await trigger(["company", "taxCode", "size"]);
    if (ok) setStep(1);
  };

  const onSubmit = async (values: RegisterValues) => {
    await wait(1300);
    toast.success("Đăng ký doanh nghiệp thành công", {
      description: `${values.company} đang chờ xác minh, chúng tôi sẽ liên hệ qua ${values.email}.`,
    });
    reset();
    setDone(true);
    setTimeout(onSwitch, 1200);
  };

  return (
    <form
      onSubmit={step === 0 ? (e) => (e.preventDefault(), void next()) : handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
    >
      {/* Stepper */}
      <ol className="mb-2 flex items-center gap-3">
        {steps.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2.5">
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                i < step && "bg-primary text-primary-foreground",
                i === step && "bg-gradient-primary text-primary-foreground shadow-elegant",
                i > step && "bg-muted text-muted-foreground",
              )}
            >
              {i < step ? <Check className="size-3.5" /> : i + 1}
            </span>
            <span
              className={cn(
                "text-xs font-semibold leading-tight",
                i <= step ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <span className={cn("h-px flex-1", step > i ? "bg-primary" : "bg-border")} />
            )}
          </li>
        ))}
      </ol>

      {step === 0 ? (
        <div key="s0" className="animate-fade-up space-y-4">
          <AuthField
            label="Tên doanh nghiệp"
            placeholder="Công ty TNHH ABC"
            autoComplete="organization"
            icon={<Building2 />}
            error={errors.company?.message}
            {...register("company")}
          />
          <AuthField
            label="Mã số thuế"
            placeholder="0101234567"
            inputMode="numeric"
            icon={<Hash />}
            error={errors.taxCode?.message}
            {...register("taxCode")}
          />
          <div className="space-y-1.5">
            <label htmlFor="size" className="text-sm font-medium text-foreground">
              Quy mô doanh nghiệp
            </label>
            <div className="group relative">
              <Users className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <select
                id="size"
                aria-invalid={errors.size ? "true" : "false"}
                className="field-input cursor-pointer appearance-none pr-10"
                {...register("size")}
              >
                <option value="" disabled>
                  Chọn số lượng nhân sự
                </option>
                {companySizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            {errors.size && <p className="text-xs font-medium text-destructive">{errors.size.message}</p>}
          </div>

          <Button type="submit" variant="hero" size="xl" className="group w-full">
            Tiếp tục
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      ) : (
        <div key="s1" className="animate-fade-up space-y-4">
          <AuthField
            label="Người đại diện"
            placeholder="Nguyễn Văn A"
            autoComplete="name"
            icon={<User />}
            error={errors.contact?.message}
            {...register("contact")}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <AuthField
              label="Email công việc"
              type="email"
              placeholder="ten@congty.vn"
              autoComplete="email"
              icon={<Mail />}
              error={errors.email?.message}
              {...register("email")}
            />
            <AuthField
              label="Số điện thoại"
              type="tel"
              placeholder="0912 345 678"
              autoComplete="tel"
              icon={<Phone />}
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>
          <div className="space-y-2">
            <AuthField
              label="Mật khẩu"
              type="password"
              placeholder="Tối thiểu 8 ký tự"
              autoComplete="new-password"
              icon={<Lock />}
              error={errors.password?.message}
              {...register("password")}
            />
            {password && (
              <div className="flex items-center gap-3">
                <div className="grid flex-1 grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-1.5 rounded-full transition-colors duration-300",
                        i <= strength ? strengthColor : "bg-border",
                      )}
                    />
                  ))}
                </div>
                <span className="w-20 text-right text-xs font-medium text-muted-foreground">
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>
          <AuthField
            label="Nhập lại mật khẩu"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            icon={<Lock />}
            error={errors.confirm?.message}
            {...register("confirm")}
          />
          <div className="space-y-1">
            <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-snug text-muted-foreground select-none">
              <input type="checkbox" className="mt-0.5 size-4 rounded accent-primary" {...register("terms")} />
              <span>
                Tôi đồng ý với <span className="font-semibold text-primary">Điều khoản doanh nghiệp</span> và{" "}
                <span className="font-semibold text-primary">Chính sách bảo mật</span>
              </span>
            </label>
            {errors.terms && <p className="text-xs font-medium text-destructive">{errors.terms.message}</p>}
          </div>

          <div className="grid grid-cols-[auto_1fr] gap-3">
            <Button type="button" variant="social" size="xl" onClick={() => setStep(0)} aria-label="Quay lại">
              <ArrowLeft />
            </Button>
            <Button type="submit" variant="hero" size="xl" className="group w-full" disabled={isSubmitting || done}>
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Đăng ký doanh nghiệp
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <p className="pt-2 text-center text-sm text-muted-foreground">
        Đã có tài khoản doanh nghiệp?{" "}
        <button type="button" onClick={onSwitch} className="font-semibold text-primary hover:underline">
          Đăng nhập
        </button>
      </p>
    </form>
  );
}
