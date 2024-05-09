"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export type EventType = {
  data: string;
  timestamp: string;
};

export type EmailDraftInfo = {
  email: string;
};

export const useCrewJob = () => {
  // State
  const [running, setRunning] = useState<boolean>(false);
  const [pdf_content, setpdf_content] = useState<string[]>([]);
  const [jt, setjt] = useState<string[]>([]);
  const [jd, setjd] = useState<string[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [draft, setdraft] = useState<string[]>([]);
  // const [emaildraftList, setemaildraftList] = useState<EmailDraftInfo[]>([]);
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
          result: string[];
          events: EventType[];
        }>(`https://crewai-backend.vercel.app/api/crew/${currentJobId}`);
        const { status, events: fetchedEvents, result } = response.data;

        console.log("status update", response.data);

        setEvents(fetchedEvents);
        if (result) {
          console.log("setting job result", result);
          setdraft(result || []);
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

  const startpdfJob = async () => {
    // Clear previous job data
    setEvents([]);
    setdraft([]);
    setRunning(true);

    try {
      const response = await axios.post<{ job_id: string }>(
        "https://crewai-backend.vercel.app/api/crewpdf",
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
  const startJobHR = async () => {
    // Clear previous job data
    setEvents([]);
    setdraft([]);
    setRunning(true);

    try {
      const response = await axios.post<{ job_id: string }>(
        "https://crewai-backend.vercel.app/api/crewHR",
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
    startpdfJob,
    startJobHR,
    jd, setjd,
    jt, setjt,
    pdf_content, setpdf_content,
    draft, setdraft
    // emaildraftList, setemaildraftList,
  };
};
