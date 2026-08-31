import { Routes, Route } from "react-router";
import NotFound from "./Notfound";
import Home from "./Home";
import type { AppDispatch, RootState } from "@/redux/store";
import useNetworkStatus from "./hooks/useNetworkStatus";
import { setByValue } from "@/redux/features/theme.slice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state?.theme.value);
  const isOnline = useNetworkStatus();
  useEffect(() => {
    const lightModeMediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    if (lightModeMediaQuery.matches) {
      dispatch(setByValue("light"));
    } else if (darkModeMediaQuery.matches) {
      dispatch(setByValue("dark"));
    }
  }, [dispatch]);
  return (
    <div className={cn("min-h-dvh w-full", theme === "dark" && "dark")}>
      {isOnline ? "" : "No network connection"}
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Global 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
