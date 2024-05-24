"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export type EventType = {
  data: string;
  timestamp: string;
};

export type EmailInfo = {
  subject: string;
  content: string;
};

export const useEmailJob = () => {
  // State
  const [running, setRunning] = useState<boolean>(false);
  const [pdf_content, setpdf_content] = useState<string[]>([]);
  const [jt, setjt] = useState<string[]>([]);
  const [jd, setjd] = useState<string[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [draftemail, setdraftemail] = useState<EmailInfo>();
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
        }>(`http://127.0.0.1:3001/api/crew/${currentJobId}`);
        const { status, events: fetchedEvents, result } = response.data;

        console.log("status update", response.data);

        setEvents(fetchedEvents);
        if (result) {
          console.log("setting job result", result);
          const parsedResult = JSON.parse(result);
          const emailInfo: EmailInfo = {
            subject: parsedResult.subject,
            content: parsedResult.content,
          };
          setdraftemail(emailInfo); // Set array with single EmailInfo object
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

  const startEmailJob = async () => {
    // Clear previous job data
    setEvents([]);
    setdraftemail({} as EmailInfo);
    setRunning(true);

    try {
      const response = await axios.post<{ job_id: string }>(
        "http://127.0.0.1:3001/api/crewEmail",
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
    startEmailJob,
    jd, setjd,
    jt, setjt,
    pdf_content, setpdf_content,
    draftemail, setdraftemail
  };
};
