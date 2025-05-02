
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Play, Pause, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

export interface Track {
  id: string | number;
  title: string;
  artist: string;
  src: string;
  isUserUploaded?: boolean;
}

interface MusicLibraryProps {
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  onTrackSelect: (index: number) => void;
  onDeleteTrack?: (id: string | number) => void;
}

const MusicLibrary: React.FC<MusicLibraryProps> = ({ 
  tracks, 
  currentTrackIndex, 
  isPlaying, 
  onTrackSelect,
  onDeleteTrack 
}) => {
  const { theme } = useTheme();
  
  return (
    <div className="mt-4">
      <h3 className={cn(
        "text-sm font-medium mb-2",
        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
      )}>
        Music Library ({tracks.length})
      </h3>
      
      {tracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <Music className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-muted-foreground">
            Your music library is empty
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Upload some tracks to get started
          </p>
        </div>
      ) : (
        <ScrollArea className={cn(
          "h-[200px] rounded-md border p-2",
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        )}>
          <div className="space-y-1">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className={cn(
                  "flex items-center justify-between rounded-md px-2 py-2",
                  currentTrackIndex === index 
                    ? (theme === 'dark' ? 'bg-purple-900/40' : 'bg-purple-100') 
                    : (theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'),
                  "transition-colors"
                )}
              >
                <div 
                  className="flex-1 cursor-pointer flex items-center"
                  onClick={() => onTrackSelect(index)}
                >
                  <div className="w-6 flex items-center justify-center">
                    {currentTrackIndex === index && isPlaying ? (
                      <Pause className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <Play className="h-3.5 w-3.5 text-gray-500" />
                    )}
                  </div>
                  
                  <div className="ml-2 flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      currentTrackIndex === index ? 'text-primary' : ''
                    )}>
                      {track.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {track.artist} {track.isUserUploaded && '(Uploaded)'}
                    </p>
                  </div>
                </div>
                
                {track.isUserUploaded && onDeleteTrack && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 ml-2"
                    onClick={() => onDeleteTrack(track.id)}
                  >
                    <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                    <span className="sr-only">Delete</span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default MusicLibrary;
