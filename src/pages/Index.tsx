
import React from "react";
import TaskFlowTimer from "@/components/TaskFlowTimer";
import { ThemeProvider } from "@/hooks/useTheme";

const Index = () => {
  return (
    <ThemeProvider>
      <TaskFlowTimer />
    </ThemeProvider>
  );
};

export default Index;
