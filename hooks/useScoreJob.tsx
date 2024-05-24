"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useEmailJob } from "@/hooks/useCrewJob";

export type EventType = {
  data: string;
  timestamp: string;
};

export type ScoreInfo = {
  score: number;
  explanation: string;
};

export const useScoreJob = () => {
  // State
  const crewJob = useEmailJob();
  const [running, setRunning] = useState<boolean>(false);
  const [pdf_content, setpdf_content] = useState<string[]>([]);
  const [jt, setjt] = useState<string[]>([]);
  const [jd, setjd] = useState<string[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [score, setscore] = useState<ScoreInfo>();
  const [currentJobId, setCurrentJobId] = useState<string>("");

  // useEffects
  useEffect(() => {
    let intervalId: number;
    console.log("currentJobId", currentJobId);
    const fetchJobStatuspdf = async () => {
      try {
        console.log("calling fetchJobStatus");
        const response = await axios.get<{
          status: string;
          result: string; 
          events: EventType[];
        }>(`http://localhost:3001/api/crew/${currentJobId}`);
        const { status, events: fetchedEvents, result } = response.data;

        console.log("status update", response.data);

        setEvents(fetchedEvents);
        if (result) {
          console.log("setting job result", result);
          const parsedResult = JSON.parse(result);
          const scoreInfo: ScoreInfo = {
            score: parsedResult.score,
            explanation: parsedResult.explanation,
          };
          setscore(scoreInfo); // Set array with single EmailInfo object
          // if (parsedResult.score > 7) {
          //   crewJob.startEmailJob();
          // }
        }

        if (status === "COMPLETE" || status === "ERROR") {
          if (intervalId) {
            clearInterval(intervalId);
          }
          setRunning(false);
          toast.success(`Job ${status.toLowerCase()}.`);
        }
      } catch (error) {
        if (intervalId) {
          clearInterval(intervalId);
        }
        setRunning(false);
        toast.error("Failed to get job status.");
        console.error(error);
      }
    };

    if (currentJobId !== "") {
      intervalId = setInterval(fetchJobStatuspdf, 1000) as unknown as number;
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentJobId]);

  const startScoreJob = async () => {
    // Clear previous job data
    setEvents([]);
    setscore({} as ScoreInfo);
    setRunning(true);

    try {
      const response = await axios.post<{ job_id: string }>(
        "http://localhost:3001/api/crewScore",
        {
          jt,
          jd,
          pdf_content,
        }
      );

      toast.success("Job started");

      console.log("jobId", response.data.job_id);
      setCurrentJobId(response.data.job_id);
    } catch (error) {
      toast.error("Failed to start job");
      console.error(error);
      setCurrentJobId("");
    }
  };
  

  return {
    running,setRunning,
    events,
    setEvents,
    currentJobId,
    setCurrentJobId,
    startScoreJob,
    jd, setjd,
    jt, setjt,
    pdf_content, setpdf_content,
    score, setscore
  };
};
