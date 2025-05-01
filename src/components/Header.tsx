import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon, Info, User, BrainCircuit, Calendar, Calculator as CalculatorIcon } from 'lucide-react';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TaskCalendar from './TaskCalendar';
import Calculator from './Calculator';
interface HeaderProps {
  tasks: Array<any>; // We'll type this properly when we use it
}
const Header: React.FC<HeaderProps> = ({
  tasks
}) => {
  const {
    theme,
    toggleTheme
  } = useTheme();
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const handleAIAssistantClick = () => {
    toast.info("AI Features Coming Soon", {
      description: "We're working on intelligent features to help you be more productive!"
    });
  };
  return <header className="py-4 px-4 sm:px-6 border-b bg-white/50 backdrop-blur-sm dark:bg-slate-900/50 dark:border-slate-800 sticky top-0 z-10">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-task-dark dark:text-task">FocusFlow</span>
            
            {/* Mini Calendar Button */}
            <Button variant="ghost" size="icon" onClick={() => setCalendarOpen(true)} className="h-8 w-8 rounded-full hover:bg-task/10 dark:hover:bg-task/20" title="Task Calendar">
              <Calendar className="h-4 w-4 text-task-dark dark:text-task" />
            </Button>
            
            {/* Mini Calculator Button */}
            <Button variant="ghost" size="icon" onClick={() => setCalculatorOpen(true)} className="h-8 w-8 rounded-full hover:bg-task/10 dark:hover:bg-task/20" title="Quick Calculator">
              <CalculatorIcon className="h-4 w-4 text-task-dark dark:text-task" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {/* AI Assistant Button */}
            <Button variant="outline" size="sm" className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-none hover:opacity-90 transition-opacity" onClick={handleAIAssistantClick}>
              <span className="absolute inset-0 animate-pulse bg-white/20 rounded-md"></span>
              <BrainCircuit className="mr-1 h-4 w-4" />
              <span>AI Assistant</span>
            </Button>
            
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full dark:text-gray-300">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            
            {/* About Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full dark:text-gray-300">
                  <Info className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="dark:bg-slate-900 dark:border-slate-800">
                <DropdownMenuLabel className="dark:text-gray-200">About</DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-slate-800" />
                <DropdownMenuItem onClick={() => setAboutDialogOpen(true)} className="dark:text-gray-300 dark:focus:text-white dark:focus:bg-slate-800">
                  About FocusFlow
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPrivacyDialogOpen(true)} className="dark:text-gray-300 dark:focus:text-white dark:focus:bg-slate-800">
                  Privacy Policy
                </DropdownMenuItem>
                <DropdownMenuItem className="dark:text-gray-300 dark:focus:text-white dark:focus:bg-slate-800">
                  Created by Samin Yeasar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Account (placeholder) */}
            <Button variant="outline" size="sm" className="dark:border-slate-700 dark:text-gray-300 bg-slate-900 hover:bg-slate-800 rounded-sm">
              <User className="mr-1 h-4 w-4" />
              <span>Account</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* About Dialog */}
      <Dialog open={aboutDialogOpen} onOpenChange={setAboutDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-task-dark dark:text-task">About FocusFlow</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Productivity app designed to help you stay organized and focused
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 dark:text-gray-300">
            <p>FocusFlow is a productivity app designed to help you stay organized, manage your tasks, and maximize your productivity using a simple, minimalist interface. The app integrates the Pomodoro Technique with advanced task tracking and time management features to make sure you stay focused and on top of your goals.</p>
            
            <h3 className="text-lg font-semibold mt-4 dark:text-gray-200">Key Features:</h3>
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
            
            <h3 className="text-lg font-semibold mt-4 dark:text-gray-200">The Power of AI:</h3>
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
      
      {/* Privacy Policy Dialog */}
      <Dialog open={privacyDialogOpen} onOpenChange={setPrivacyDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-task-dark dark:text-task">Privacy Policy for FocusFlow</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Effective Date: May 1, 2025
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 prose prose-sm max-w-none dark:prose-invert">
            <p className="dark:text-gray-300">At FocusFlow, we are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your data when you use our app.</p>
            
            <h3 className="text-lg font-semibold mt-4 dark:text-gray-200">1. Information We Collect</h3>
            <p className="dark:text-gray-300">We collect the following types of information:</p>
            <ul className="list-disc pl-5 dark:text-gray-300">
              <li><strong>Personal Information:</strong> When you sign up or use FocusFlow, we may collect personal details like your name, email address, and task data.</li>
              <li><strong>Usage Data:</strong> We collect information about how you interact with the app, including but not limited to the features you use, tasks you add, and time spent on various tasks.</li>
              <li><strong>Device Information:</strong> We may collect information about your device, such as operating system, device type, IP address, and browser type.</li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-4 dark:text-gray-200">2. How We Use Your Information</h3>
            <p className="dark:text-gray-300">We use your information to:</p>
            <ul className="list-disc pl-5 dark:text-gray-300">
              <li><strong>Enhance Your Experience:</strong> Improve and personalize your app experience based on your usage patterns.</li>
              <li><strong>Provide AI-Driven Features:</strong> Use your task data to offer smart suggestions, task prioritization, time estimation, and personalized motivational messages.</li>
              <li><strong>Communication:</strong> Send updates, notifications, and information related to FocusFlow.</li>
              <li><strong>Improve the App:</strong> Analyze app usage and feedback to continuously improve the app's functionality.</li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-4 dark:text-gray-200">3. Data Storage and Security</h3>
            <p className="dark:text-gray-300">We take the security of your data seriously. Your information is stored securely, and we implement industry-standard measures to protect it. However, no data transmission or storage can be 100% secure, and we cannot guarantee the absolute security of your information.</p>
            
            <h3 className="text-lg font-semibold mt-4 dark:text-gray-200">4. Data Sharing</h3>
            <p className="dark:text-gray-300">We do not share your personal data with third parties, except in the following cases:</p>
            <ul className="list-disc pl-5 dark:text-gray-300">
              <li><strong>With your consent:</strong> If you choose to share your data for specific purposes.</li>
              <li><strong>For legal reasons:</strong> If required by law or if we believe such action is necessary to comply with legal obligations.</li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-4 dark:text-gray-200">5. Cookies</h3>
            <p className="dark:text-gray-300">FocusFlow uses cookies to enhance your experience. Cookies are small text files stored on your device that help us remember your preferences and improve our services. You can choose to disable cookies in your browser settings, but this may affect the functionality of the app.</p>
            
            <h3 className="text-lg font-semibold mt-4 dark:text-gray-200">6. Third-Party Services</h3>
            <p className="dark:text-gray-300">We may use third-party services, such as the Gemini API, to enhance the functionality of FocusFlow. These third parties may collect data, but we ensure that their data collection practices comply with our privacy standards.</p>
            
            <h3 className="text-lg font-semibold mt-4 dark:text-gray-200">7. Your Rights</h3>
            <p className="dark:text-gray-300">You have the right to:</p>
            <ul className="list-disc pl-5 dark:text-gray-300">
              <li><strong>Access your data:</strong> Request a copy of the information we have collected about you.</li>
              <li><strong>Update or delete your data:</strong> Request corrections or deletion of your personal information.</li>
              <li><strong>Opt-out of communications:</strong> Unsubscribe from promotional emails at any time.</li>
            </ul>
            <p className="dark:text-gray-300">To exercise your rights, please contact us at sheditzofficial918@gmail.com.</p>
            
            <h3 className="text-lg font-semibold mt-4 dark:text-gray-200">8. Changes to This Privacy Policy</h3>
            <p className="dark:text-gray-300">We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the updated date will be reflected at the top of the page. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.</p>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-6">Contact: sheditzofficial918@gmail.com</p>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Calendar Modal */}
      <TaskCalendar open={calendarOpen} onOpenChange={setCalendarOpen} tasks={tasks} />
      
      {/* Calculator Modal */}
      <Calculator open={calculatorOpen} onOpenChange={setCalculatorOpen} />
    </header>;
};
export default Header;