
import React from "react";
import TaskFlowTimer from "@/components/TaskFlowTimer";
import { ThemeProvider } from "@/hooks/useTheme";
import MotivationalPopup from "@/components/MotivationalPopup";

const Index = () => {
  return (
    <ThemeProvider>
      <MotivationalPopup />
      <TaskFlowTimer />
    </ThemeProvider>
  );
};

export default Index;
