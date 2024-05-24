"use client";

import React, { useEffect } from "react";
import { EmailInfo, useEmailJob } from "@/hooks/useCrewJob";
import { useState } from "react";
import Tiptap from "./TipTap";
import toast from "react-hot-toast";
import axios from "axios";

// This component will receive props to update events.

interface FinalOutputProps {
  draftemail: EmailInfo;
}
// const formSchema = z.object ({
//   title: z.string()
//   .min(5, { message: "Hey the title is not long enough" })
//   .max(100, { message: "Its too loong" }),
//   description: z
//   .string()
//   .min(5, { message: "Hey the title is not long enough" })
//   .max (100, { message: "Its too loong" })
//   •trim(),
// })
export const Email: React.FC<FinalOutputProps> = ({ draftemail }) => {
  const crewJob = useEmailJob();
  let [subject, setsubject] = useState(draftemail?.subject || '');
  let [content, setcontent] = useState(draftemail?.content);
  const [emailid, setEmailid] = useState(String);
  useEffect(() => {
    if (draftemail) {
      if (draftemail.subject !== subject) {
        setsubject(draftemail.subject);
      }
      if (draftemail.content !== content) {
        setcontent(draftemail.content);
      }
    }
  }, [draftemail]);

  const sendEmailJob = async () => {
    try {
      const response = await axios.post<{ email: string }>(
        "http://127.0.0.1:3001/api/sendemail",
        {
          subject,
          content,
          emailid,
        }
      );
      console.log("Email", response.data.email);
      toast.success("Email Sent");
    } catch (error) {
      toast.error("Failed to start job");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-2">Email</h2>
      <div className="flex-grow overflow-auto border-2 border-gray-300 p-2">
        {draftemail?.subject === null || draftemail?.content === null ?(
          <p>No email yet.</p>
        ) : (
            <div className="mb-4">
              <div className="ml-4">
              <p>
                <h3 className="text-m font-bold mb-2">Email ID:</h3>
                <input
                type="email"
                className="flex h-10 w-full mt-2 mb-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter the email id"
                value={emailid}
                onChange={(event) => setEmailid(event.target.value)}/>
              </p>
              <p>
                <h3 className="text-m font-bold mb-2">Subject:</h3>
                <input
                    type="text"
                    className="flex h-10 w-full mb-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={subject}
                    onChange={(event) => setsubject(event.target.value)}
                  />
              </p>
              <p>
                <h3 className="text-m font-bold mb-2">Content:</h3>
                <textarea
                    className="flex w-full h-full mb-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={content}
                    onChange={(event) => setcontent(event.target.value)}
                    style={{ height: `${content?.length * .5}px` }}
                  />
                  
              </p>
              <button
              onClick={() => sendEmailJob()}
              className="my-element text-white mt-2 font-bold py-2 px-4 rounded"
              disabled={crewJob.running}
            >
              {crewJob.running ? "Running..." : "Send email"}
            </button>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};
