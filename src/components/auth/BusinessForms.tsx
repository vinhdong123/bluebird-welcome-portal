import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Building2, KeyRound, Loader2, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthField } from "./AuthField";
import { getPasswordStrength, strengthLabels } from "@/lib/password-strength";
import { isValidTaxCode } from "@/lib/business-validation";
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

/* ---------------- Business register ---------------- */

const registerSchema = z
  .object({
    company: z.string().trim().min(2, "Tên doanh nghiệp tối thiểu 2 ký tự").max(150, "Tên quá dài"),
    contact: z.string().trim().min(2, "Họ tên tối thiểu 2 ký tự").max(80, "Họ tên quá dài"),
    email: z.string().trim().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
    password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
    confirm: z.string().min(1, "Vui lòng nhập lại mật khẩu"),
    terms: z.literal(true, { errorMap: () => ({ message: "Bạn cần đồng ý với điều khoản" }) }),
  })
  .refine((d) => d.password === d.confirm, { message: "Mật khẩu nhập lại không khớp", path: ["confirm"] });
type RegisterValues = z.infer<typeof registerSchema>;

export function BusinessRegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });
  const [done, setDone] = useState(false);

  const password = watch("password") ?? "";
  const strength = getPasswordStrength(password);
  const strengthColor = ["bg-border", "bg-destructive", "bg-warning", "bg-primary-glow", "bg-success"][strength];

  const onSubmit = async (values: RegisterValues) => {
    await wait(1300);
    toast.success("Đăng ký doanh nghiệp thành công", {
      description: `Chào mừng ${values.company}! Thông tin đã được gửi tới ${values.email}.`,
    });
    reset();
    setDone(true);
    setTimeout(onSwitch, 1200);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <AuthField
        label="Tên doanh nghiệp"
        placeholder="Công ty TNHH ABC"
        autoComplete="organization"
        icon={<Building2 />}
        error={errors.company?.message}
        {...register("company")}
      />
      <AuthField
        label="Họ và tên"
        placeholder="Nguyễn Văn A"
        autoComplete="name"
        icon={<User />}
        error={errors.contact?.message}
        {...register("contact")}
      />
      <AuthField
        label="Email"
        type="email"
        placeholder="ten@congty.vn"
        autoComplete="email"
        icon={<Mail />}
        error={errors.email?.message}
        {...register("email")}
      />
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

      <p className="pt-2 text-center text-sm text-muted-foreground">
        Đã có tài khoản doanh nghiệp?{" "}
        <button type="button" onClick={onSwitch} className="font-semibold text-primary hover:underline">
          Đăng nhập
        </button>
      </p>
    </form>
  );
}
