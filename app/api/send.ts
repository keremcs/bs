"use server";

import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export async function send(formData: FormData) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PRIVATE_SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );

  const id = String(formData.get("id"));
  const step = Number(formData.get("step"));
  const answer = String(formData.get("answer"));

  const r1 = Number(formData.get("r1"));
  const r2 = Number(formData.get("r2"));
  const r3 = Number(formData.get("r3"));
  const r4 = Number(formData.get("r4"));
  if (step > 9) {
    const updateObject = {
      step: step + 1,
      ...(step === 10
        ? { r1: r1 }
        : step === 11
        ? { r2: r2 }
        : step === 12
        ? { r3: r3 }
        : { r4: r4 }),
    };

    const { error: cbError } = await supabase
      .from("tedubs")
      .update(updateObject)
      .eq("id", id);
    if (cbError) {
      return { message: cbError.message };
    }

    redirect(`/player/${id}`);
  }

  const score =
    step === 1
      ? answer === "B"
        ? 10
        : answer === "A"
        ? 5
        : 0
      : step === 2
      ? answer === "B"
        ? 10
        : answer === "C"
        ? 5
        : 0
      : step === 3
      ? answer === "A"
        ? 15
        : answer === "C"
        ? 5
        : 0
      : step === 4
      ? answer === "C"
        ? 10
        : answer === "A"
        ? 5
        : 0
      : step === 5
      ? answer === "C"
        ? 10
        : answer === "B"
        ? 5
        : 0
      : step === 6
      ? answer === "C"
        ? 10
        : answer === "A"
        ? 5
        : 0
      : step === 7
      ? answer === "B"
        ? 10
        : answer === "A"
        ? 5
        : 3
      : step === 8
      ? answer === "B"
        ? 10
        : answer === "C"
        ? 5
        : 0
      : step === 9
      ? answer === "C"
        ? 10
        : answer === "A"
        ? 5
        : 0
      : 0;

  const { error: rpcError } = await supabase.rpc("bsfn", {
    player: id,
    scor: score,
  });
  if (rpcError) {
    return { message: rpcError.message };
  }

  redirect(`/player/${id}`);
}
