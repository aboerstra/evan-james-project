import React, { useState, useRef, useEffect } from 'react';

export default function MusicPlayer({ 
  trackTitle = "cool skin",
  artistName = "evan james", 
  coverImage = "/images/music_releases/cool_skin.jpg",
  audioSrc = "/audio/cool_skin_preview.mp3",
  releaseDate = "june 2025",
  autoPlay = false
}) {
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);
  
  // Audio references
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const animationRef = useRef(null);
  
  // Initialize player
  useEffect(() => {
    const audio = audioRef.current;
    
    // Initialize the audio element
    const setupAudio = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
      setError(null);
      if (autoPlay) {
        playTrack();
      }
    };
    
    // Handle audio loading error
    const handleError = (e) => {
      console.error("Audio loading error:", e);
      setError("Failed to load audio. Please try again later.");
      setIsLoaded(false);
    };
    
    // Set up event listeners
    audio.addEventListener('loadedmetadata', setupAudio);
    audio.addEventListener('ended', () => setIsPlaying(false));
    audio.addEventListener('error', handleError);
    
    // Update volume
    audio.volume = volume;
    
    return () => {
      audio.removeEventListener('loadedmetadata', setupAudio);
      audio.removeEventListener('ended', () => setIsPlaying(false));
      audio.removeEventListener('error', handleError);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoPlay]);
  
  // Play/pause functionality
  const playTrack = () => {
    if (error) return;
    
    setIsPlaying(true);
    audioRef.current.play().catch(err => {
      console.error("Playback error:", err);
      setError("Playback failed. Please try again.");
      setIsPlaying(false);
    });
    animationRef.current = requestAnimationFrame(updateProgress);
  };
  
  const pauseTrack = () => {
    setIsPlaying(false);
    audioRef.current.pause();
    cancelAnimationFrame(animationRef.current);
  };
  
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      playTrack();
    }
  };
  
  // Update progress bar as audio plays
  const updateProgress = () => {
    setCurrentTime(audioRef.current.currentTime);
    progressBarRef.current.value = audioRef.current.currentTime;
    animationRef.current = requestAnimationFrame(updateProgress);
  };
  
  // Handle progress bar input change
  const handleProgressChange = () => {
    audioRef.current.currentTime = progressBarRef.current.value;
    setCurrentTime(progressBarRef.current.value);
  };
  
  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };
  
  // Format time in mm:ss
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-gradient-to-r from-navy/90 to-sapphire/50 backdrop-blur-md p-4 md:p-6 rounded-xl border border-electric-blue/20 shadow-lg max-w-xl mx-auto">
      {error ? (
        <div className="text-center py-4 text-red-400">
          <p>{error}</p>
          <button 
            onClick={() => {
              setError(null);
              if (audioRef.current) {
                audioRef.current.load();
              }
            }}
            className="mt-2 px-4 py-2 bg-electric-blue/80 hover:bg-electric-blue text-white rounded-md transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center gap-5">
          {/* Cover Art */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
            <div className="absolute inset-0 rounded-lg overflow-hidden border-2 border-electric-blue/40 shadow-lg shadow-electric-blue/10">
              {coverImage ? (
                <img 
                  src={coverImage} 
                  alt={`${trackTitle} by ${artistName}`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-navy to-electric-blue flex items-center justify-center">
                  <span className="text-2xl text-white font-mulish">{artistName[0]}</span>
                </div>
              )}
            </div>
            {/* Play/Pause Button Overlay */}
            <button 
              className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg hover:bg-black/40 transition-colors focus:outline-none"
              onClick={togglePlayPause}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Track Info & Controls */}
          <div className="flex-grow w-full md:w-auto">
            <div className="mb-2 text-center md:text-left">
              <h3 className="text-lg font-mulish text-white">{trackTitle}</h3>
              <p className="text-sm text-ice-blue">{artistName} • {releaseDate}</p>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-white/70">{formatTime(currentTime)}</span>
                <input
                  ref={progressBarRef}
                  type="range"
                  className="w-full h-1 bg-navy/50 rounded-lg appearance-none cursor-pointer accent-electric-blue"
                  defaultValue="0"
                  min="0"
                  max={duration || 100}
                  onChange={handleProgressChange}
                />
                <span className="text-xs text-white/70">{formatTime(duration)}</span>
              </div>
            </div>
            
            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleMute}
                className="text-white/80 hover:text-white transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : volume < 0.5 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                className="w-full md:w-24 h-1 bg-navy/50 rounded-lg appearance-none cursor-pointer accent-electric-blue"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
    </div>
  );
}
