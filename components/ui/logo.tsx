"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  className?: string;
  src?: string;
  text?: string; 
  textClassName?: string; 
}

export function Logo({
  className = "w-10",
  src = "/Logo.png",
  text = "Microlab Studio", 
  textClassName = "font-incognito text-2xl font-semibold tracking-wide",
}: LogoProps) {
  return (
    <div className="flex items-center gap-4">
      <div className={cn(className)}>
        <Image
          src={src}
          alt="Logo"
          width={200}
          height={200}
          className="h-auto w-full"
          priority
        />
      </div>
      {text && <span className={cn(textClassName)}>{text}</span>}
    </div>
  );
}
