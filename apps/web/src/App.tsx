import { useState } from "react";
import { Button } from "@/components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="w-full min-h-dvh flex items-center justify-center min-w-100 bg-blue-700">
        <Button onClick={() => setCount((count) => count + 1)}>count is: {count}</Button>
      </div>
    </>
  );
}

export default App;
