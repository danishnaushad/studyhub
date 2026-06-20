import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Headphones, Moon } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useTheme } from '../../../contexts/ThemeProvider';

const TRACKS = [
  { id: 'lofi', name: 'Lofi Beats', category: 'Deep Focus', url: '/audio/lofi.mp3' },
  { id: 'rain', name: 'Rainfall', category: 'Nature', url: '/audio/rain.mp3' },
  { id: 'brown_noise', name: 'Brown Noise', category: 'White Noise', url: '/audio/brown_noise.mp3' },
  { id: 'forest', name: 'Deep Forest', category: 'Nature', url: '/audio/forest.mp3' },
  { id: 'cafe', name: 'Cafe Ambience', category: 'Environment', url: '/audio/cafe.mp3' }
];
const MIDNIGHT_TRACKS = [
  { id: 'brown_noise', name: 'Brown Noise', category: 'Deep Focus', url: '/audio/brown_noise.mp3' },
  { id: 'rain', name: 'Rain Sounds', category: 'Nature', url: '/audio/rain.mp3' },
  { id: 'space', name: 'Space Ambient', category: 'Ambient', url: '/audio/space.mp3' },
  { id: 'deep_focus', name: 'Deep Focus', category: 'Focus', url: '/audio/deep_focus.mp3' },
  { id: 'forest_night', name: 'Forest At Night', category: 'Nature', url: '/audio/forest_night.mp3' }
];

export function FocusMusicCard() {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  const activeTracks = theme === 'midnight' ? MIDNIGHT_TRACKS : TRACKS;
  // Ensure track index is safe if switching themes
  const safeTrackIndex = trackIndex >= activeTracks.length ? 0 : trackIndex;
  const currentTrack = activeTracks[safeTrackIndex];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log('Audio play failed:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  
  const handlePrev = () => {
    setTrackIndex(prev => (prev === 0 ? activeTracks.length - 1 : prev - 1));
    setIsPlaying(true);
  };
  
  const handleNext = () => {
    setTrackIndex(prev => (prev === activeTracks.length - 1 ? 0 : prev + 1));
    setIsPlaying(true);
  };

  return (
    <Card className={`shadow-sm flex flex-col overflow-hidden group transition-all duration-500 ${theme === 'midnight' ? 'border-border/10 opacity-80 hover:opacity-100' : 'border-primary/10'}`}>
      {/* Visual Atmosphere Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-muted/30 opacity-50 pointer-events-none" />
      
      <CardHeader className="pb-2 relative z-10 border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
            {theme === 'midnight' ? <Moon className="h-4 w-4 text-[#7C3AED]" /> : <Headphones className="h-4 w-4 text-primary" />}
            {theme === 'midnight' ? 'Deep Focus Audio' : 'Focus Environment'}
          </CardTitle>
          {isPlaying && (
            <div className="flex items-center gap-1">
              <span className="w-1 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col gap-5 pt-5 relative z-10">
        {/* Hidden Audio Element */}
        <audio 
          ref={audioRef} 
          src={currentTrack.url} 
          loop 
        />

        {/* Track Info */}
        <div className="flex flex-col items-center text-center space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-1">
            {currentTrack.category}
          </span>
          <h3 className="font-bold text-lg leading-tight">{currentTrack.name}</h3>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground" onClick={handlePrev}>
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button 
            variant={isPlaying ? 'default' : 'outline'} 
            size="icon" 
            className={`h-12 w-12 rounded-full shadow-sm transition-all ${isPlaying ? 'bg-primary text-primary-foreground shadow-primary/20 scale-105' : ''}`}
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5 ml-1" fill="currentColor" />}
          </Button>
          
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground" onClick={handleNext}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3 px-2 mt-1">
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground shrink-0" onClick={toggleMute}>
            {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume} 
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="flex-1 h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
          />
        </div>
      </CardContent>
    </Card>
  );
}
