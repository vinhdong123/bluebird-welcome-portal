import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Loader2, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthField } from "./AuthField";
import { SocialButtons } from "./SocialButtons";
import { getPasswordStrength, strengthLabels } from "@/lib/password-strength";
import { cn } from "@/lib/utils";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const loginSchema = z.object({
  email: z.string().trim().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
  remember: z.boolean().optional(),
});

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Họ tên tối thiểu 2 ký tự").max(80, "Họ tên quá dài"),
    email: z.string().trim().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
    password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
    confirm: z.string().min(1, "Vui lòng nhập lại mật khẩu"),
    terms: z.literal(true, { errorMap: () => ({ message: "Bạn cần đồng ý với điều khoản" }) }),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirm"],
  });

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { remember: true } });

  const onSubmit = async (values: LoginValues) => {
    await wait(1100);
    toast.success("Đăng nhập thành công", { description: `Chào mừng trở lại, ${values.email}` });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <AuthField
        label="Email"
        type="email"
        placeholder="ban@email.com"
        autoComplete="email"
        icon={<Mail />}
        error={errors.email?.message}
        {...register("email")}
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
            onClick={() => toast.info("Liên kết đặt lại mật khẩu sẽ được gửi qua email")}
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
            Đăng nhập
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </Button>

      <SocialButtons />

      <p className="text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <button type="button" onClick={onSwitch} className="font-semibold text-primary hover:underline">
          Đăng ký ngay
        </button>
      </p>
    </form>
  );
}

export function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
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
    toast.success("Tạo tài khoản thành công", { description: `Xin chào ${values.name}!` });
    reset();
    setDone(true);
    setTimeout(onSwitch, 900);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <AuthField
        label="Họ và tên"
        placeholder="Nguyễn Văn A"
        autoComplete="name"
        icon={<User />}
        error={errors.name?.message}
        {...register("name")}
      />
      <AuthField
        label="Email"
        type="email"
        placeholder="ban@email.com"
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
            Tôi đồng ý với <span className="font-semibold text-primary">Điều khoản dịch vụ</span> và{" "}
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
            Tạo tài khoản
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </Button>

      <SocialButtons />

      <p className="text-center text-sm text-muted-foreground">
        Đã có tài khoản?{" "}
        <button type="button" onClick={onSwitch} className="font-semibold text-primary hover:underline">
          Đăng nhập
        </button>
      </p>
    </form>
  );
}
