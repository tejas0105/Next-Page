/* eslint-disable @next/next/no-img-element */
"use client";

import FinalPage from "./FinalPage";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <FinalPage />
      </Suspense>
    </>
  );
}
