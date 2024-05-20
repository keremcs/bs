"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LoadingButton } from "./loadingbutton";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { question } from "./questions";
import { useState } from "react";

import { send } from "@/app/api/send";

export function Game({
  id,
  step,
  cbgame,
}: {
  id: string;
  step: number;
  cbgame: {
    r1?: number;
    r2?: number;
    r3?: number;
    r4?: number;
  };
}) {
  const [infor, setInfor] = useState(false);

  function formula(r: number, ib: number) {
    const og = ib - r + 1;
    const inf = ib + og;
    const to = Number(og.toFixed(2));
    const ti = Number(inf.toFixed(2));
    return { to, ti };
  }

  if (step > 9) {
    const { to: og1, ti: inf1 } = formula(cbgame.r1 ?? 0, 8);
    const { to: og2, ti: inf2 } = formula(cbgame.r2 ?? 0, inf1);
    const { to: og3, ti: inf3 } = formula(cbgame.r3 ?? 0, inf2);
    const { to: og4, ti: inf4 } = formula(cbgame.r4 ?? 0, inf3);

    return (
      <form
        action={send}
        key={step}
        className="flex flex-col items-center gap-6 px-6 py-12"
      >
        {(step === 10 || infor) && (
          <>
            <div>Enflasyon hedefi %2</div>
            <div>Nötr faiz oranı %1</div>
          </>
        )}
        {step !== 10 && (
          <div className="flex w-full justify-end">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setInfor(!infor)}
            >
              <Info className="mr-2 h-4 w-4" />
              {infor ? "Açıklamayı Gizle" : "Açıklamayı Göster"}
            </Button>
          </div>
        )}
        <DataTable
          p={step - 9}
          i0={8}
          i1={inf1}
          i2={inf2}
          i3={inf3}
          i4={inf4}
          o0={0}
          o1={og1}
          o2={og2}
          o3={og3}
          o4={og4}
          r0={9}
          r1={cbgame.r1}
          r2={cbgame.r2}
          r3={cbgame.r3}
          r4={cbgame.r4}
        />
        <Input
          name={
            step === 10 ? "r1" : step === 11 ? "r2" : step === 12 ? "r3" : "r4"
          }
          className="max-w-[190px]"
          placeholder="Faiz oranını belirle"
          type="number"
          step={0.01}
          autoFocus
        />
        <div className="flex w-full justify-end pt-6">
          <LoadingButton />
        </div>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="step" value={step} />
      </form>
    );
  }

  const Information = (
    <div className="flex flex-col gap-3">
      {step === 1 && (
        <div>
          Tebrikler 🎉 ERULAND Demokratik Cumhuriyeti Ekonomi Bakanı oldun,
          2080-2090 yılları arasında ekonomiyi ilgilendiren kritik tüm kararlar
          senin tarafından verilecek, merkez bankası senin tavsiyelerine göre
          politika belirleyecek, şimdi ülkenin genel durumuna göz atmanı
          istiyoruz.
        </div>
      )}
      <div>NÜFUS: 150M</div>
      <ul className="list-disc pl-4">
        <li className="py-2">
          ERUSTAT raporuna göre enflasyon %87 düzeyinde gerçekleşti
        </li>
        <li className="py-2">
          ERUCOIN %58 değer kaybederek tarihindeki en düşük seviyeyi gördü
        </li>
        <li className="py-2">Alım gücü düşüşü rekor kırdı</li>
        <li className="py-2">
          Yabancı yatırımcıların ülkeye duyduğu güven yerle bir oldu
        </li>
        <li className="py-2">
          Yapay zekanın gelişimi sonucu işsizlik oranı %25’e çıktı
        </li>
        <li className="py-2">
          Yıllar boyu düşürülen faiz oranı %10’a geriledi ve enflasyon oranının
          altında kaldı
        </li>
        <li className="py-2">Dışa bağımlılık yüksek</li>
      </ul>
    </div>
  );

  return (
    <form action={send} key={step} className="flex flex-col gap-6 px-6 py-12">
      {(step === 1 || infor) && Information}
      {step !== 1 && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            type="button"
            onClick={() => setInfor(!infor)}
          >
            <Info className="mr-2 h-4 w-4" />
            {infor ? "Açıklamayı Gizle" : "Açıklamayı Göster"}
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-6">
        <p className="font-semibold">{question[step - 1].qt}</p>
        <RadioGroup name="answer" className="grid grid-cols-1 gap-6">
          <label className="inline-flex items-center break-words rounded-md p-4 space-x-2 bg-secondary has-[:checked]:bg-green-300">
            <RadioGroupItem value="A" />
            <div>{question[step - 1].aw[0]}</div>
          </label>
          <label className="inline-flex items-center break-words rounded-md p-4 space-x-2 bg-secondary has-[:checked]:bg-green-300">
            <RadioGroupItem value="B" />
            <div>{question[step - 1].aw[1]}</div>
          </label>
          <label className="inline-flex items-center break-words rounded-md p-4 space-x-2 bg-secondary text-secondary-foreground has-[:checked]:bg-green-300">
            <RadioGroupItem value="C" />
            <div>{question[step - 1].aw[2]}</div>
          </label>
        </RadioGroup>
      </div>
      <div className="flex justify-end pt-6">
        <LoadingButton />
      </div>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="step" value={step} />
    </form>
  );
}

function DataTable(props: {
  p: number;
  i0: number;
  i1?: number;
  i2?: number;
  i3?: number;
  i4?: number;
  o0?: number;
  o1?: number;
  o2?: number;
  o3?: number;
  o4?: number;
  r0?: number;
  r1?: number;
  r2?: number;
  r3?: number;
  r4?: number;
  hidden?: string;
}) {
  return (
    <div className="flex">
      <table className="table-auto border text-center text-xs sm:text-xl">
        <thead>
          <tr>
            <th className="p-3">Dönem</th>
            <th className="p-3">Nominal faiz oranı</th>
            <th className="p-3">Enflasyon</th>
            <th className="p-3">Çıktı Açığı</th>
          </tr>
        </thead>
        <tbody className="break-all">
          <tr className="bg-secondary">
            <td>0</td>
            <td>{props.r0}%</td>
            <td>{props.i0}%</td>
            <td>{props.o0 ?? 0}%</td>
          </tr>
          {props.p > 1 && (
            <tr>
              <td>1</td>
              <td className={props.hidden}>{props.r1}%</td>
              <td className={props.hidden}>{props.i1}%</td>
              <td className={props.hidden}>{props.o1}%</td>
            </tr>
          )}
          {props.p > 2 && (
            <tr className="bg-secondary">
              <td>2</td>
              <td className={props.hidden}>{props.r2}%</td>
              <td className={props.hidden}>{props.i2}%</td>
              <td className={props.hidden}>{props.o2}%</td>
            </tr>
          )}
          {props.p > 3 && (
            <tr>
              <td>3</td>
              <td className={props.hidden}>{props.r3}%</td>
              <td className={props.hidden}>{props.i3}%</td>
              <td className={props.hidden}>{props.o3}%</td>
            </tr>
          )}
          {props.p === 5 && (
            <tr className="bg-secondary">
              <td>4</td>
              <td className={props.hidden}>{props.r4}%</td>
              <td className={props.hidden}>{props.i4}%</td>
              <td className={props.hidden}>{props.o4}%</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
