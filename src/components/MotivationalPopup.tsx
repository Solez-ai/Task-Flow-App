
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion } from "framer-motion";

// Array of motivational quotes
const motivationalMessages = [
  "Discipline isn't loud — it's the quiet decision to show up when no one's watching.",
  "You don't need more time. You need more intention.",
  "Every small task done with focus builds a life done with purpose.",
  "Consistency beats talent when talent forgets to show up.",
  "Progress doesn't always shout. Sometimes, it whispers 'keep going.'",
  "A day of honest effort is never wasted.",
  "Success is a pattern — not an event.",
  "Breaks don't slow you down. They recharge the real you.",
  "Don't chase motivation. Build momentum.",
  "One Pomodoro today is worth more than ten promises tomorrow.",
  "Your goals aren't far — just foggy. Focus clears the way.",
  "Growth feels boring. That's how you know it's working.",
  "You're not tired — you're unchallenged. Start something small.",
  "Dream big, but work small — consistently.",
  "You don't rise to the level of goals. You fall to the level of systems.",
  "Start now. Perfect later.",
  "Greatness begins with one finished task.",
  "The focus you build now will shape the life you live next.",
  "The gap between where you are and where you want to be is filled with tiny actions.",
  "Nothing beats a day when you actually did what you said you would.",
  "Skip excuses, not sessions.",
  "Habits are invisible wings — they lift you before you notice.",
  "Focus isn't found. It's created.",
  "Every streak starts at one.",
  "You can't control time, but you can control what you do with it.",
  "Hard work compounds like interest. Every effort adds up.",
  "Don't wait for the mood. Create the movement.",
  "Nothing looks overwhelming once you start.",
  "You're not behind. You're building momentum.",
  "Win the day. Repeat tomorrow.",
  "Momentum is built one decision at a time.",
  "Success is hidden in routines, not revelations.",
  "Some days you shine. Some days you survive. Both are victories.",
  "A task completed is a promise kept to yourself.",
  "You don't need to feel it to do it.",
  "Discipline is simply choosing what you want most over what you want now.",
  "Your dream job is hidden inside the habits you build today.",
  "Focus is power. Even in short bursts.",
  "Keep it boring. Results live in the repetition.",
  "Every master was once a beginner who didn't quit.",
  "Your future self will thank you for today's effort.",
  "Not all progress is visible. Trust the process.",
  "The simplest plan done well beats the perfect plan undone.",
  "You're not aiming for perfection. You're aiming for completion.",
  "Action isn't optional. It's the difference.",
  "Be loyal to your goals, not your comfort zone.",
  "What you finish today frees your mind tomorrow.",
  "Big wins are built on tiny wins stacked daily.",
  "Do something today your future self will brag about.",
  "One productive hour can turn the whole day around.",
  "You're stronger than your excuse.",
  "Silence the noise. Trust the work.",
  "Believe in yourself before the results arrive.",
  "Courage doesn't shout. It quietly chooses to continue.",
  "Failure teaches what success hides.",
  "The only approval you need is from the person you want to become.",
  "You don't always need more — sometimes, you need less distraction.",
  "Doubt screams. Discipline whispers. Listen to the quiet voice.",
  "Comfort zones feel safe, but they never lead anywhere new.",
  "Turn your doubt into fuel.",
  "You've made it through tough days. You'll make it through this one.",
  "Keep building. Even when no one claps.",
  "Self-belief is a decision, not a reward.",
  "Real confidence is quiet. So is real effort.",
  "You don't need the perfect mindset to make the right move.",
  "Rest is not weakness. It's part of the plan.",
  "No one sees the struggle, only the results. Keep going.",
  "The version of you who starts is not the version who finishes.",
  "If you're tired, rest. Don't quit.",
  "Your effort is never wasted. It's stored.",
  "You don't find limits. You test them.",
  "Show up scared. Show up unsure. Just show up.",
  "It's not about being the best. It's about being better than yesterday.",
  "You can be imperfect and still make progress.",
  "There is no perfect moment. Just this one."
];

// Get a random message from the array
const getRandomMessage = () => {
  const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
  return motivationalMessages[randomIndex];
};

const MotivationalPopup = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  // Check if this is a fresh visit or just a page refresh
  useEffect(() => {
    // Get the session storage value for visited
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    // Only show the popup if this is the user's first visit in this session
    if (!hasVisited) {
      setMessage(getRandomMessage());
      
      // Small delay for better user experience
      const timer = setTimeout(() => {
        setOpen(true);
      }, 800);
      
      // Mark that the user has visited in this session
      sessionStorage.setItem('hasVisited', 'true');
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl p-0 overflow-hidden border-none bg-transparent">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-white to-purple-50 dark:from-slate-900 dark:to-slate-800 p-8 md:p-10 rounded-lg shadow-lg border border-purple-100 dark:border-slate-700"
          >
            <Button 
              variant="ghost" 
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 border-0 outline-none ring-0 focus:ring-0" 
              onClick={() => setOpen(false)}
            >
              <X size={20} />
              <span className="sr-only">Close</span>
            </Button>
            
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="bg-purple-100 dark:bg-slate-700/50 h-16 w-16 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400">
                  <path d="M16.5 9.4 7.5 4.21"></path>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <path d="M3.29 7 12 12l8.71-5"></path>
                  <path d="M12 22V12"></path>
                </svg>
              </div>
              
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">Your Daily Inspiration</h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-gray-700 dark:text-gray-300 text-base md:text-lg font-medium"
              >
                "{message}"
              </motion.p>
              
              <Button 
                onClick={() => setOpen(false)}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-800"
              >
                Start Focusing
              </Button>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MotivationalPopup;
