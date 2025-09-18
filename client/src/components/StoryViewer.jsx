// import { BadgeCheck, X } from "lucide-react";
// import React, { useEffect } from "react";

// const StoryViewer = ({ viewStory, setViewStory }) => {
//     const [progress, setProgress] = React.useState(0);

//     useEffect(() => {
//         let timer,progressInterval;

//     }, [viewStory,setViewStory]);

//   const handleClose = () => {
//     setViewStory(null);
//   };

//   if(!viewStory) return null; // If no story is selected, don't render anything

//   const renderContent = () => {
//     switch (viewStory.media_type) {
//       case "image":
//         return (
//           <img
//             src={viewStory.media_url}
//             alt=""
//             className="max-w-full max-h-screen object-contain"
//           />
//         );
//       case "video":
//         return (
//           <video
//             onEnded={() => setViewStory(null)}
//             src={viewStory.media_url}
//             className="max-h-screen"
//             controls
//             autoPlay

//             muted
//           />
//         );

//       case "text":
//         return (
//           <div className="w-full h-full flex items-center justify-center text-white text-lg p-8 text-center">
//             {viewStory.content}
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 h-screen  bg-opacity-90 z-110 flex items-center justify-center"
//       style={{
//         backgroundColor:
//           viewStory.media_type === "text"
//             ? viewStory.background_color
//             : "#000000",
//       }}
//     >
//       {/* progress bar */}

//       <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
//         <div
//           className="h-full bg-white transition-all duration-100 linear"
//           style={{ width: "30%" }}
//         ></div>
//       </div>

//       {/* user info top left */}
//       <div className="absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 backdrop-blur-2x1 rounded bg-black/50">
//         <img
//           src={viewStory.user?.profile_picture}
//           alt=""
//           className="ize-7 sm:size-8 rounded-full object-cover border border-white"
//         />
//         <div className="text-white font-medium flex items-center gap-1.5">
//           <span>{viewStory.user?.full_name}</span>
//           <BadgeCheck size={18} />
//         </div>
//       </div>

//       {/* close button */}
//       <button
//         onClick={handleClose}
//         className="absolute top-4 right-4 text-white text-3x1 font-bold focus: outIine-none"
//       >
//         <X className="w-8 h-8 hover: scale-110 transition cursor-pointer" />
//       </button>

//       {/* content wrapper */}
//       <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center ">
//         {renderContent()}
//       </div>
//     </div>
//   );
// };

// export default StoryViewer;

import { BadgeCheck, X } from "lucide-react";
import React, { useEffect } from "react";

const StoryViewer = ({ viewStory, setViewStory }) => {
  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    let timer, progressInterval;
    if (!viewStory) return;

    if (viewStory.media_type !== "video") {
      setProgress(0);

      let duration = 10000;
      let setTime = 100;
      let elapsed = 0;

      progressInterval = setInterval(() => {
        elapsed += setTime;
        setProgress((elapsed / duration) * 100);
      }, setTime);

      timer = setTimeout(() => {
        setViewStory(null);
      }, duration);
    }

    return () => {
      clearInterval(timer);
      clearTimeout(progressInterval);
    };
  }, [viewStory, setViewStory]);

  const handleClose = () => {
    setViewStory(null);
  };

  if (!viewStory) return null;

  const renderContent = () => {
    switch (viewStory.media_type) {
      case "image":
        return (
          <img
            src={viewStory.media_url}
            alt="story media"
            className="max-w-full max-h-screen object-contain"
          />
        );
      case "video":
        return (
          <video
            onEnded={() => setViewStory(null)}
            src={viewStory.media_url}
            className="max-h-screen"
            controls
            autoPlay
            muted
          />
        );
      case "text":
        return (
          <div className="w-full h-full flex items-center justify-center text-white text-lg p-8 text-center">
            {viewStory.content}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 h-screen bg-opacity-90 z-110 flex items-center justify-center"
      style={{
        backgroundColor:
          viewStory.media_type === "text"
            ? viewStory.background_color
            : "#000000",
      }}
    >
      {/* ✅ CHANGED: progress bar with dynamic width */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
        <div
          className="h-full bg-white transition-all duration-100 linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* user info top left */}
      <div className="absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 backdrop-blur-2xl rounded bg-black/50">
        <img
          src={viewStory.user?.profile_picture}
          alt="user"
          className="size-7 sm:size-8 rounded-full object-cover border border-white"
        />
        <div className="text-white font-medium flex items-center gap-1.5">
          <span>{viewStory.user?.full_name}</span>
          <BadgeCheck size={18} />
        </div>
      </div>

      {/* close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-white text-3xl font-bold focus:outline-none"
      >
        <X className="w-8 h-8 hover:scale-110 transition cursor-pointer" />
      </button>

      {/* content wrapper */}
      <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default StoryViewer;
