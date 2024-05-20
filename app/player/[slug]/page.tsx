import { Game } from "@/components/thegame";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function GamePlayer({
  params,
}: {
  params: { slug: string };
}) {
  const dn = cookies().get("dn")?.value;
  const userId = params.slug;

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

  const { data: exist, error: existError } = await supabase
    .from("tedubs")
    .select("step, r1, r2, r3, r4")
    .eq("id", userId);
  if (existError || exist.length === 0) {
    redirect("/");
  }

  const step = exist[0].step;
  const cbgame = {
    r1: exist[0].r1,
    r2: exist[0].r2,
    r3: exist[0].r3,
    r4: exist[0].r4,
  };

  function formula(r: number, ib: number) {
    const og = ib - r + 1;
    const inf = ib + og;
    const to = Number(og.toFixed(2));
    const ti = Number(inf.toFixed(2));
    return { to, ti };
  }

  if (step === 15) {
    return (
      <main className="flex flex-col min-h-screen items-center justify-center gap-3">
        <div>Tebrikler 🎉</div>
        <div>Oyunu başarıyla tamamladınız</div>
      </main>
    );
  }

  if (step === 14) {
    const inf1 = formula(cbgame.r1, 8);
    const inf2 = formula(cbgame.r2, inf1.ti);
    const inf3 = formula(cbgame.r3, inf2.ti);
    const inf4 = formula(cbgame.r4, inf3.ti);

    const calc =
      200 -
      Math.pow(inf1.ti - 2, 2) -
      Math.pow(inf2.ti - 2, 2) -
      Math.pow(inf3.ti - 2, 2) -
      Math.pow(inf4.ti - 2, 2) +
      5 * inf1.to +
      5 * inf2.to +
      5 * inf3.to +
      5 * inf4.to;
    const done = calc < 0 ? 0 : calc;

    const { error: trpcError } = await supabase.rpc("bsfn", {
      player: userId,
      scor: done,
    });
    if (trpcError) {
      return { message: trpcError.message };
    }

    return (
      <main className="flex flex-col min-h-screen items-center justify-center gap-3">
        <div>Tebrikler 🎉</div>
        <div>Oyunu başarıyla tamamladınız</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex w-full max-w-md">
        <Game id={userId} step={step} cbgame={cbgame} />
      </div>
    </main>
  );
}
