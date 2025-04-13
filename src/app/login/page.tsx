"use client";
import "@fontsource/poppins";
import Link from "next/link";
import React, { useState } from "react";
import { Label } from "@/components/label";
import { Input } from "@/components/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify({username}),
    });

    const data = await res.json();
    localStorage.setItem("userId", data.user._id);
    console.log(data);
    router.push("/player")
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <div className="absolute inset-0 -z-10">
        </div>
        <h2 className="text-xl font-[Poppins] font-bold text-neutral-800 dark:text-neutral-200">
          Enter username to continue
        </h2>

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="username">Username</Label>
            <Input
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] cursor-pointer mb-4"
            type="submit"
          >
            Submit &rarr;
            <BottomGradient />
          </button>
          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};