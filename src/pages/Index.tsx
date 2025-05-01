
import React from "react";
import TaskFlowTimer from "@/components/TaskFlowTimer";
import Header from "@/components/Header";
import { ThemeProvider } from "@/hooks/useTheme";

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
        <Header />
        <div className="py-8">
          <TaskFlowTimer />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
