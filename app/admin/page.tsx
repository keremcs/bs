import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/loadingbutton";
import { QrGenerator } from "@/components/qrGenerator";

export default async function Admin({
  searchParams,
}: {
  searchParams: { error: string; message: string };
}) {
  const password = cookies().get("adminpw")?.value;

  async function setCookie(formData: FormData) {
    "use server";

    const yummy = String(formData.get("adminpw"));
    cookies().set("adminpw", yummy);

    redirect("/admin");
  }

  async function admin(formData: FormData) {
    "use server";

    const pw = String(formData.get("dn"));
    if (pw !== process.env.NEXT_PRIVATE_ADMIN_PASSWORD) {
      redirect("/admin?error=Wrong%20password");
    }

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

    const username = String(formData.get("username"));
    const { data: player, error: newError } = await supabase
      .from("tedubs")
      .insert({
        step: 1,
        username,
      })
      .select("id");
    if (newError) {
      redirect(`/admin?error=${newError.message}`);
    }

    redirect(`/admin?message=${player[0].id}`);
  }

  if (password === process.env.NEXT_PRIVATE_ADMIN_PASSWORD) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center text-2xl gap-6 p-12">
        {searchParams?.message ? (
          <div className="flex flex-col items-center gap-6">
            <QrGenerator id={searchParams.message} />
            <a href="/admin">Add New Player</a>
          </div>
        ) : (
          <form
            className="flex flex-col items-center rounded-md gap-6 p-6 bg-secondary"
            action={admin}
          >
            <div>New Player</div>
            <Input
              type="text"
              name="username"
              placeholder="Username"
              required
            />
            <LoadingButton />
            <input type="hidden" name="dn" value={password} />
            {searchParams?.error && (
              <span className="text-center text-red-500 break-all">
                {searchParams.error}
              </span>
            )}
          </form>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen flex justify-center items-center text-2xl p-12">
      <form className="flex flex-col justify-center gap-6" action={setCookie}>
        <Input type="password" name="adminpw" placeholder="Password" />
        <LoadingButton />
      </form>
    </main>
  );
}
