import { randomString } from "ts-tools"

export default function Page() {
    return (
      <main>
        <h1>Hello {randomString()}!</h1>
      </main>
    )
  }