"use client"
import "@fontsource/poppins";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function player() {

  const videoRef = useRef<HTMLVideoElement>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const watchedRanges = useRef<Array<[number, number]>>([]);
  const lastTime = useRef<number>(0);
  const [progress, setProgress] = useState(0);
  
  const updateProgress = async () => {
    const video = videoRef.current;
    const currentTime = video?.currentTime || 0;
    const videoLength = video?.duration || 0;
    
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);

    const response = await fetch("http://localhost:8080/api/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: storedUserId,  
        videoId: "oceans",  
        lastWatched: currentTime,
        videoLength: videoLength,
        watchedSegments: watchedRanges.current
      }),
    });

    if (response.ok) {
      console.log("Progress updated successfully!");
    } else {
      console.log("Failed to update progress.");
    }
  };
  const debounce = (func: Function, delay: number) => {
    let timeoutId: any;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };
  
  const debouncedUpdateProgress = useRef(debounce(updateProgress, 500)).current;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
    
      if (currentTime > lastTime.current && currentTime - lastTime.current < 2) {
        if (
          watchedRanges.current.length === 0 ||
          watchedRanges.current[watchedRanges.current.length - 1][1] !== lastTime.current
        ) {
          watchedRanges.current.push([lastTime.current, currentTime]);
        } else {
          watchedRanges.current[watchedRanges.current.length - 1][1] = currentTime;
        }
      }
    
      lastTime.current = currentTime;
      debouncedUpdateProgress();
    };
    
    const handleSeeked = () => {
      lastTime.current = video.currentTime; 
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("seeked", handleSeeked);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, []);
  
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const fetchProgress = async () => {
      const res = await fetch(`http://localhost:8080/api/progress?userId=${userId}`);
      if (!res.ok) return;
      const data = await res.json();
      setProgress(data.totalProgress);
      if (videoRef.current) {
        videoRef.current.currentTime = data.lastWatched;
      }
    };
    fetchProgress();
  }, []);

 return (
    <div className="min-h-screen bg-black text-white flex flex-col p-4">
        <div className="flex items-center justify-start mb-4">
            <Link href={"/login"}>
                <button className="font-[Poppins] text-base text-white cursor-pointer mt-3 hover:text-blue-400"> &lt; Back</button>
            </Link>
            <div className="ml-30 mt-3">
              <h1 className="text-3xl font-[Poppins] font-semibold">Lecture Title</h1>
              <div className="mt-4 h-2 w-full bg-gray-700 rounded-full relative">
                <div className="absolute top-0 left-0 h-full bg-green-500 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-md font-[Poppins] mt-1">Progress: {Math.floor(progress)}%</p>
            </div>
          <div className="w-10" />
        </div>

  <div className="flex flex-1 gap-4">
    <div className="flex-1 justify-items-center content-center">
      <div className="aspect-video w-full max-w-[960px] rounded-lg overflow-hidden">
        <video 
          ref = {videoRef}
          id="player"
          className="video-js w-full h-full"
          controls
          preload="auto"
          poster="//vjs.zencdn.net/v/oceans.png"
          data-setup='{}'>
          <source src="//vjs.zencdn.net/v/oceans.mp4" type="video/mp4"></source>
          <source src="//vjs.zencdn.net/v/oceans.webm" type="video/webm"></source>
          <source src="//vjs.zencdn.net/v/oceans.ogv" type="video/ogg"></source>
          <p className="vjs-no-js">
              To view this video please enable JavaScript, and consider upgrading to a
              web browser that
          <a href="https://videojs.com/html5-video-support/" target="_blank">
              supports HTML5 video
          </a>
          </p>
        </video>
      </div>
    </div>

    <div className="w-64">
      <div className="text-sm text-gray-400 mb-2">Up Next →</div>
      <ul className="space-y-2">
        <li className="hover:text-blue-400 cursor-pointer">Next Video 1</li>
        <li className="hover:text-blue-400 cursor-pointer">Next Video 2</li>
      </ul>
    </div>
  </div>
</div>

 );   
}