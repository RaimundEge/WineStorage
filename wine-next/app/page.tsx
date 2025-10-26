import Select from "./select"
import Update from "./update";
import Chart from "./chart";
import { getTemps } from "./actions";

export default async function Home() {
  const data = await getTemps();

  return (
    <main>
      <Select /><Update data={data} />
      <Chart data={data}/>
    </main>

  );
}
