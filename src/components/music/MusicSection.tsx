
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import MusicPlayer from '../MusicPlayer';
import MusicLibrary from '../MusicLibrary';
import AudioFileUploader from '../AudioFileUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useLayout } from '@/contexts/LayoutContext';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useUserTracks } from '@/hooks/useUserTracks';

interface MusicSectionProps {
  layoutMode?: 'pc' | 'phone';
}

const MusicSection: React.FC<MusicSectionProps> = ({ 
  layoutMode = 'pc' 
}) => {
  const [activeTab, setActiveTab] = useState('player');
  const { userTracks, handleFileUpload, handleDeleteTrack } = useUserTracks();
  
  const {
    isPlaying,
    currentTrackIndex,
    setCurrentTrackIndex,
    togglePlay
  } = useAudioPlayer(userTracks);

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    if (!isPlaying) {
      togglePlay();
    }
  };
  
  // Create a wrapper function that adapts handleDeleteTrack to match the expected signature
  const handleTrackDelete = (id: string | number) => {
    handleDeleteTrack(id, currentTrackIndex);
  };

  return (
    <Card className={`${layoutMode === 'phone' ? 'mb-4' : 'mb-8'} shadow-md`}>
      <CardHeader className={layoutMode === 'phone' ? 'pb-2' : ''}>
        <CardTitle className={layoutMode === 'phone' ? 'text-lg' : ''}>Focus Music</CardTitle>
      </CardHeader>
      <CardContent className={layoutMode === 'phone' ? 'pt-0' : ''}>
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className={layoutMode === 'phone' ? 'space-y-2' : 'space-y-4'}
        >
          <TabsList className={`grid w-full grid-cols-3 ${layoutMode === 'phone' ? 'h-9' : ''}`}>
            <TabsTrigger value="player" className={layoutMode === 'phone' ? 'text-xs py-1' : ''}>Player</TabsTrigger>
            <TabsTrigger value="library" className={layoutMode === 'phone' ? 'text-xs py-1' : ''}>Library</TabsTrigger>
            <TabsTrigger value="upload" className={layoutMode === 'phone' ? 'text-xs py-1' : ''}>Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="player" className="m-0">
            <MusicPlayer />
          </TabsContent>
          
          <TabsContent value="library" className="m-0">
            <MusicLibrary 
              tracks={userTracks}
              currentTrackIndex={currentTrackIndex}
              isPlaying={isPlaying}
              onTrackSelect={handleTrackSelect}
              onDeleteTrack={handleTrackDelete}
            />
          </TabsContent>
          
          <TabsContent value="upload" className="m-0">
            <AudioFileUploader onFileUpload={handleFileUpload} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MusicSection;
