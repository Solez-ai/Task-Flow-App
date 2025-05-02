
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AboutDialog: React.FC<AboutDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto dark:bg-slate-900 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-task-dark dark:text-task">About FocusFlow</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Productivity app designed to help you stay organized and focused
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 dark:text-gray-300">
          <p>FocusFlow is a productivity app designed to help you stay organized, manage your tasks, and maximize your productivity using a simple, minimalist interface. The app integrates the Pomodoro Technique with advanced task tracking and time management features to make sure you stay focused and on top of your goals.</p>
          
          <h3 className="text-lg font-semibold mt-4 dark:text-gray-200">Key Features: (All AI Based Features Are not Out Yet !)</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Pomodoro Timer:</strong> FocusFlow uses the Pomodoro Technique, which breaks work into intervals, typically 25 minutes long, followed by short breaks. This technique helps improve focus and reduces mental fatigue.</li>
            <li><strong>Task Management:</strong> Add, track, and prioritize tasks effortlessly. FocusFlow lets you categorize tasks, set deadlines, and organize your day around your most important work.</li>
            <li><strong>Smart Task Prioritization:</strong> With the help of AI, FocusFlow can suggest the most important tasks based on their deadlines and descriptions, ensuring you focus on what matters most.</li>
            <li><strong>Time Estimation:</strong> The app provides estimated times for completing tasks, helping you manage your day more efficiently and make adjustments as needed.</li>
            <li><strong>Break Suggestions:</strong> Based on your productivity patterns, FocusFlow suggests the best times to take breaks and offers relaxing activities to recharge your mind.</li>
            <li><strong>Motivational Reminders:</strong> FocusFlow sends personalized messages to keep you motivated and on track, offering encouragement and support whenever you need it.</li>
            <li><strong>Post-Session Insights:</strong> After each Pomodoro session, the app provides performance insights and productivity scores, helping you track your progress and improve your workflow.</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-4 dark:text-gray-200">How FocusFlow Works:</h3>
          <p>FocusFlow is designed with simplicity in mind. You can easily add tasks to your list, assign priorities, and start your Pomodoro sessions. The app will handle the rest—tracking your time, suggesting breaks, and keeping you focused on your goals. Whether you're tackling large projects or small to-dos, FocusFlow keeps you productive without overwhelming you with unnecessary features.</p>
          
          <h3 className="text-lg font-semibold mt-4 dark:text-gray-200">The Power of AI: (Coming Soon)</h3>
          <p>FocusFlow integrates the Gemini API to enhance the app's functionality with AI-driven features. The AI helps with tasks like:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Automatically prioritizing your tasks.</li>
            <li>Estimating the time needed to complete tasks.</li>
            <li>Offering personalized break suggestions and motivational tips.</li>
            <li>Analyzing task descriptions to offer improvements or encouragement.</li>
          </ul>
          <p>With AI, FocusFlow evolves alongside you, adapting to your work habits and helping you reach your peak productivity.</p>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-6">Contact: sheditzofficial918@gmail.com</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AboutDialog;
