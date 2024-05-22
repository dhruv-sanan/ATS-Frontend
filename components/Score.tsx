"use client";

import React, { useEffect, useState } from "react";
import { ScoreInfo } from "@/hooks/useScoreJob";
import { useEmailJob } from "@/hooks/useCrewJob";

// This component will receive props to update events.

interface FinalOutputProps {
  scoreinfo?: ScoreInfo;
}
export const Score: React.FC<FinalOutputProps> = ({ scoreinfo }) => {
  const crewJob = useEmailJob();
  let [scored, setscored] = useState(scoreinfo?.score);

  // useEffects
  useEffect(() => {
    if (scoreinfo) {
      if (scoreinfo.score !== scored) {
        setscored(scoreinfo.score);
      }
    }
  }, [scoreinfo]);
  // useEffect(() => {
  //   if (scored > 7) {
  //     crewJob.startEmailJob();
  //   }
  // }, []); 
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-2">Score</h2>
      <div className="flex-grow overflow-auto border-2 border-gray-300 p-2">
        {scoreinfo === undefined ? (
          <p>No results yet.</p>
        ) : (
            <div className="mb-4">
              <div className="ml-4">
                <>
              <div>
                <h3 className="text-m font-bold mb-2">Score:</h3>
                <div className="flex-grow overflow-auto border-2 border-gray-300 p-2">
                  {scored}
                  </div>
                </div>
                <div>
                <h3 className="text-m font-bold mb-2">explanation:</h3>
                <div className="flex-grow overflow-auto border-2 border-gray-300 p-2">
                  {scoreinfo?.explanation}
                  </div>
                </div>
                </>
                </div>
                </div>
          )
        }
      </div>
    </div>
  );
  
};
