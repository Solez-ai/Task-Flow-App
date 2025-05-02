
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';

interface AudioFileUploaderProps {
  onFileUpload: (file: File) => void;
}

const AudioFileUploader: React.FC<AudioFileUploaderProps> = ({ onFileUpload }) => {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is audio
    if (!file.type.startsWith('audio/')) {
      toast.error('Please select an audio file');
      return;
    }

    // Limit file size to 15MB
    if (file.size > 15 * 1024 * 1024) {
      toast.error('File size exceeds 15MB limit');
      return;
    }

    onFileUpload(file);
    toast.success(`Added "${file.name}" to your music library`);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`p-4 border-2 border-dashed rounded-lg mb-4 transition-colors ${
        isDragging 
          ? 'border-primary bg-primary/10' 
          : theme === 'dark' ? 'border-gray-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center py-4">
        <Music className="h-10 w-10 text-primary mb-2" />
        <p className="text-sm mb-2 text-center">
          Drag &amp; drop an audio file here, or click to select
        </p>
        <Button 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          className="mt-2"
        >
          Select Audio File
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="audio/*"
          className="hidden"
        />
        <p className="text-xs mt-2 text-muted-foreground">
          Supported formats: MP3, WAV, OGG (max 15MB)
        </p>
      </div>
    </div>
  );
};

export default AudioFileUploader;
