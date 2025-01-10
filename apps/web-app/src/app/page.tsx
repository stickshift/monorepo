import { randomString } from "ts-tools";

export default async function Page() {
  const response = await fetch("http://localhost:8000/");
  const data = await response.text();

  return (
    <main>
      <h1>Random Strings</h1>
      <ul>
        <li>ts-tools: {randomString()}</li>
        <li>py-tools: {data}</li>
      </ul>
    </main>
  );
}
