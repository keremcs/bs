import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Board() {
  const password = cookies().get("adminpw")?.value;

  if (password === process.env.NEXT_PRIVATE_ADMIN_PASSWORD) {
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

    const { data, error } = await supabase
      .from("tedubs")
      .select("score, username")
      .order("score", { ascending: false })
      .limit(10);
    if (error || data.length === 0) {
      redirect("/admin");
    }

    return (
      <main className="flex min-h-screen items-center justify-center">
        <ul className="flex flex-col gap-3">
          {data.map((p, i) => (
            <li key={p.username}>
              {i + 1}. {p.username}, score: {p.score}
            </li>
          ))}
        </ul>
      </main>
    );
  }

  redirect("/admin");
}
