
import React from "react";
import TaskFlowTimer from "@/components/TaskFlowTimer";
import { ThemeProvider } from "@/hooks/useTheme";
import BackgroundDoodles from "@/components/Doodles";

const Index = () => {
  return (
    <ThemeProvider>
      <BackgroundDoodles />
      <TaskFlowTimer />
    </ThemeProvider>
  );
};

export default Index;
