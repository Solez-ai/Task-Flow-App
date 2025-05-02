
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PrivacyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PrivacyDialog: React.FC<PrivacyDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
};

export default PrivacyDialog;
