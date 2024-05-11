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


  const startpdfJob = async () => {
    // Clear previous job data
    setEvents([]);
    setdraft([]);
    setRunning(true);

    try {
      const response = await axios.post<{ job_id: string }>(
        "http://localhost:3001/api/crewpdf",
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
        "http://localhost:3001/api/crewHR",
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
