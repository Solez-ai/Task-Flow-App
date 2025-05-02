
import React from 'react';
import MusicPlayer from '../MusicPlayer';

const MusicSection: React.FC = () => {
  return (
    <div className="mt-10 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-task-dark dark:text-task">Music Player</h2>
      <div className="text-sm text-muted-foreground mb-3 p-3 border border-dashed rounded-md bg-slate-50 dark:bg-slate-800">
        <p>
          Got no idea which music to use or too lazy to download? Check what the Developer recommends - <a 
            href="https://drive.google.com/drive/folders/1FhBNFcsXJ26pMDCBoWnwr-b6Y2ZBMplg?usp=sharing"
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Music Collection
          </a>
        </p>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default MusicSection;
