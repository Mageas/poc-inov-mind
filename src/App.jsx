import { useState, useRef } from "react";
import ReactPlayer from "react-player";

import { Timeline } from '@xzdarcy/react-timeline-editor';


const App = () => {

  const [src, setSrc] = useState("");
  const [videoLength, setVideoLength] = useState(300);

  const playerRef = useRef();

  const handleAddVideo = (event) => {
    try {
      const file = event.target.files[0];
      setSrc(URL.createObjectURL(file));
    } catch (error) {
      console.error(error);
    }
  };

  const handleProgress = (state) => {
    if (timelineRef.current) {
      autoScroll(state)
    }
  };

  // Set timeline length
  const handleOnReady = () => {
    const duration = playerRef.current.getDuration();
    let data = [...mockData];
    data[0].actions[0]['start'] = duration - 1;
    data[0].actions[0]['end'] = duration;
    setMockData(data);
    setVideoLength(duration);
  };

  // Set the timeline position to show the cursor
  const autoScroll = (state) => {
    const timelineWidth = timelineRef.current.target.clientWidth;
    const timelineCursorPosition = timelineRef.current.target.lastChild.offsetLeft;

    const timePosition = state.playedSeconds * 160;
    const scrollPosition = timePosition;
    if (timelineCursorPosition > (timelineWidth - 160)) {
      timelineRef.current.setScrollLeft(scrollPosition);  
    } else if (timelineCursorPosition < 0) {
      timelineRef.current.setScrollLeft(scrollPosition);
    }
  }

  const [mockData, setMockData] = useState([
    // Il faut ajouter un element de fin non modifiable pour la frise
    // La classe de cet element c'est '.timeline-editor-action-effect-effect1'
    // Il faut faire un display none pour cacher cette action
    {
      id: "_",
      actions: [
        {
          id: "endOfTimeline",
          start: 499.9,
          end: 300,
          effectId: "effect1",
        }
      ],
    }
  ]);

  const mockEffect = {
    effect0: {
      id: "effect0",
      name: "效果0",
    },
    effect1: {
      id: "effect1",
      name: "效果1",
    },
  };

  // Module
  const onTimeLineChange = (time) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time, 'seconds');
    }
  }

  const timelineRef = useRef(null);

  const onPlay = () => {
    const playerTime = playerRef.current.getCurrentTime();
    if (timelineRef.current) {
      timelineRef.current.setTime(playerTime);
      timelineRef.current.play();
    }
  }

  const onPause = () => {
    const playerTime = playerRef.current.getCurrentTime();
    if (timelineRef.current) {
      timelineRef.current.pause();
      timelineRef.current.setTime(playerTime);
    }
  }

  const onTimelineAddData = () => {

    let data = [...mockData];
    data[0].actions.push({
      id: `action_${timelineRef.current.getTime()}`,
      start: timelineRef.current.getTime(),
      end: timelineRef.current.getTime() + 2,
      effectId: "effect0",
    });
    setMockData(data);

    // Si le player ne se met pas a jour, la timeline freeze
    playerRef.current.getInternalPlayer().pause();
    playerRef.current.getInternalPlayer().play();
  }

  return (
    <>
      {src === '' ||
        <>
          <div className="video">
            <ReactPlayer ref={playerRef} url={src} muted controls onReady={handleOnReady} onProgress={handleProgress} onPause={onPause} onPlay={onPlay} height="50%" width="auto" /> 
          </div>
          <div className="video-controls">
            {/* <button onClick={showTimestamp}>Show Current Timestamp</button><span><u>Current timestamp:</u> <b>{time}</b></span> */}
          </div>
        </>
      }

      {/* Module */}
      <Timeline
        key={mockData.length}
        ref={timelineRef}
        editorData={mockData}
        effects={mockEffect}
        onCursorDragEnd={(time) => onTimeLineChange(time)}
        style={{ height: `150px`, width: '100%' }}
        maxScaleCount={videoLength}
        scale={1}
        autoScroll={true}
        onChange={() => {}}
        // getActionRender={(action) => {
        //   if (action.id === 'action10') {
        //       return <p>Hello</p>
        //   }
        // }}
      />

      <button onClick={onTimelineAddData}>Add Data Current Time</button>


      {src !== '' ||
        <div className="video-controls">
          <input type="file" onChange={handleAddVideo} />
        </div>
      }
    </>    
  );
};

export default App;