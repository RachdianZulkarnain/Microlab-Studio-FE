"use client";
import { Logo } from "@/components/ui/logo";
import { ThemeToggleButton2 } from "@/components/ui/theme-toggle";
import useLogin from "@/hooks/api/auth/useLogin";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoginSchema } from "./schema";

const slideInLeft = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};
const slideInRight = {
  hidden: { x: 50, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

const OutlinedInput = ({
  label,
  id,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => {
  return (
    <div className="relative w-full">
      <input
        id={id}
        placeholder=" "
        className="peer block w-full rounded-md border border-gray-300 px-3 pt-5 pb-2 text-sm text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-gray-700 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
        {...props}
      />
      <label
        htmlFor={id}
        className="absolute left-2 -top-2 bg-white dark:bg-black px-1 text-sm text-gray-500
        peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
        peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600 dark:peer-focus:text-blue-400 transition-all"
      >
        {label}
      </label>
    </div>
  );
};

const LoginPage = () => {
  const router = useRouter();
  const { status } = useSession();
  const { mutate: login } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setIsClient(true);
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: LoginSchema,
    onSubmit: (values, actions) => {
      login(values, {
        onSuccess: () => {
          actions.setSubmitting(false);
          router.push("/");
        },
        onError: () => actions.setSubmitting(false),
      });
    },
  });

  return (
    <SessionProvider>
      <div className="min-h-screen flex items-center justify-center relative px-4 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/Fondo_Manos.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/20"></div>

        <div className="flex-between absolute top-0 left-0 z-50 w-full gap-4 px-3 py-2.5 md:px-8 md:py-3.5">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideInLeft}
            transition={{ delay: 0.1 }}
          ></motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideInRight}
            transition={{ delay: 0.2 }}
          >
            {isClient && (
              <button
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                className="bg-background border-border/15 dark:hover:border-border inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset] backdrop-blur-sm transition-all duration-300 hover:border-zinc-900/30 max-sm:rounded-lg max-sm:p-2 md:px-3"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, rgba(255,255,255,0.08), transparent)",
                }}
                aria-label="Toggle theme"
              >
                <ThemeToggleButton2
                  className="w-3.5"
                  theme={(resolvedTheme as "light" | "dark") || "light"}
                />
              </button>
            )}
          </motion.div>
        </div>

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 w-full max-w-md sm:max-w-lg space-y-8 p-6 sm:p-8 bg-white dark:bg-black rounded-2xl shadow-lg">
          <h2 className="justify-center flex font-extrabold text-black dark:text-white">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="w-10" />
            </Link>
          </h2>
          <form className="mt-6 space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <OutlinedInput
                id="email"
                label="Email"
                type="email"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div className="relative">
              <OutlinedInput
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                {...formik.getFieldProps("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:cursor-pointer"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeClosed className="h-5 w-5" />
                )}
              </button>
              {formik.touched.password && formik.errors.password && (
                <p className="text-sm text-red-500 mt-1 absolute top-full left-0">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center flex-wrap gap-2">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 text-md font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? (
                <>
                  Login...
                  <Loader2 className="w-5 h-5 animate-spin" />
                </>
              ) : (
                <>Login</>
              )}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-black px-3 text-blue-600 dark:text-blue-400">
                  Or
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-blue-600 text-black dark:text-white rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#fbc02d"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#e53935"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4caf50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1565c0"
                  d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              <Link
                href="/sign-up"
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Don’t have an account?
              </Link>
            </p>
          </form>
        </div>
      </div>
    </SessionProvider>
  );
};

export default LoginPage;
