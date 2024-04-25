"use client";
import React from "react";
import { WavyBackground } from "@/components/ui/wavy-background";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WavyBackgroundDemo() {
  return (
    <WavyBackground className="max-w-4xl mx-auto pb-40">
      <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
        Question Box
      </p>
      <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
        Sign in or Sign up to answer company&apos;s survey
      </p>
      <div className="flex gap-4 items-center justify-center mt-4">
        <Link href="/signin">
          <Button>Sign In</Button>
        </Link>
        <Link href="/signup">
          <Button>Sign Up</Button>
        </Link>
      </div>
    </WavyBackground>
  );
}
