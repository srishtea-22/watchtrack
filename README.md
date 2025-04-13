# WatchTrack Frontend

This is the frontend of the WatchTrack project, built with Next.js, Tailwind CSS, and Video.js.

## Tech Stack

-   **Frontend**: Next.js, Tailwind CSS
    
-   **Video Player**: Video.js
    
-   **Database (via backend)**: MongoDB
    
-   **Backend**: Node.js + Express ([Backend Repo](https://github.com/srishtea-22/watchtrack-backend))

## Features

- Custom video player using Video.js  
- Tracks watched video intervals  
- Sends watch data to the backend  
- Displays unique progress  

## Design 


###  Watched Interval Tracking

-   Uses Video.js player event listeners.
    
-   Each time a user watches a section, the start and end timestamps are saved as a watched interval.
    

###  Interval Merging & Unique Progress

-   Overlapping or continuous intervals are merged.
    
-   Total unique seconds watched is calculated using merged intervals.
    
-   This avoids double-counting repeated views of the same part.

## Database Schema

The backend stores video watch progress using the following MongoDB schema:

```js
const userProgressSchema = new mongoose.Schema({
  userId: String,
  videoId: String,
  lastWatched: Number,
  videoLength: Number,
  watchedSegments: [[Number, Number]],
  totalProgress: { type: Number, default: 0 }
});
