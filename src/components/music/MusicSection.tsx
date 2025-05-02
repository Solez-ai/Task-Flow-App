
import React from 'react';
import MusicPlayer from '../MusicPlayer';

const MusicSection: React.FC = () => {
  return (
    <div className="mt-10 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-task-dark dark:text-task">Music Player</h2>
      <MusicPlayer />
    </div>
  );
};

export default MusicSection;
