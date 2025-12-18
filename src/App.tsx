import { useState } from "react";
import { Button } from "@/components/ui/button";
import LoginPage from "@/pages/login-page";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <LoginPage />
    </>
  );
}

export default App;
