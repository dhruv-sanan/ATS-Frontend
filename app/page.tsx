"use client";

import { EventLog } from "@/components/EventLog";
import { EmailLog } from "@/components/EmailLog";
import axios from "axios";
import { useCrewJob } from "@/hooks/useCrewJob";
import { FileState, MultiFileDropzone } from "@/components/FileUploader";
import { useState } from "react";
import { useEdgeStore } from '@/lib/edgestore';

export default function Home() {
  // Hooks
  const crewJob = useCrewJob();
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const { edgestore } = useEdgeStore();
  const [urls, setUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isresult, setisresult] = useState(false);
  const [uploadRes, setUploadRes] = useState<
    {
      url: string;
      filename: string;
    }[]
  >([]);

  const extractText = async (url:string) => {
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/api/extract-text', { url });
      crewJob.setpdf_content(response.data.text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const [errorMessage, setErrorMessage] = useState('');
  const [url, setUrl] = useState('');


  const handleSubmit = async () => {
    if (!url.trim()) {
      setErrorMessage('Please enter a valid URL');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/extract-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        setErrorMessage(data.error);
      } else {
        crewJob.setjt(data.jt);
        crewJob.setjd(data.jd);
        setisresult(true);
      }
    } catch (error) {
      setisresult(false);
      console.error('Error fetching job description:', error);
      setErrorMessage('Please enter a valid URL.');
    } finally {
      setIsLoading(false);
    }
  };
  
  function updateFileProgress(key: string, progress: FileState['progress']) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key,
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }
  return (
    <div className="bg-white min-h-screen text-black">
      <div className="flex">
        <div className="w-1/2 p-4">
          <h2 className="text-xl font-bold">Resume</h2>
          <MultiFileDropzone
        value={fileStates}
        dropzoneOptions={{
          maxFiles: 10,
          maxSize: 1024 * 1024 * 1, // 1 MB
        }}
        onFilesAdded={async (addedFiles) => {
          setFileStates([...fileStates, ...addedFiles]);
          await Promise.all(
            addedFiles.map(async (addedFileState) => {
              try {
                const res = await edgestore.myPublicFiles.upload({
                  file: addedFileState.file,
                  onProgressChange: async (progress) => {
                    updateFileProgress(addedFileState.key, progress);
                    if (progress === 100) {
                      // wait 1 second to set it to complete
                      // so that the user can see the progress bar
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      updateFileProgress(addedFileState.key, 'COMPLETE');
                    }
                  },
                });
                setUploadRes((uploadRes) => [
                  ...uploadRes,
                  {
                    url: res.url,
                    filename: addedFileState.file.name,
                  },
                ]);
                extractText(res.url)
              } catch (err) {
                updateFileProgress(addedFileState.key, 'ERROR');
              }
            }),
          );
        }
      }
      />
      {uploadRes.length > 0 && (
        <div className="mt-2">
          {uploadRes.map((res) => (
            <a
              key={res.url}
              className="mt-2 block underline"
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {res.filename}
            </a>
          ))}
        </div>
      )}
        <div className="grid w-full max-w-sm items-center gap-1.5">
        <h2 className="text-xl font-bold">JD URL</h2>
        <div>
          <input
            type="text"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter Job Posting URL"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              setErrorMessage(''); // Clear any previous error message on input change
            }}
            onKeyDown={async (event) => { 
              if (event.key === 'Enter') {
                await handleSubmit();
              }
            }}
          />
          {isLoading && <p>Extracting job description...</p>}
          {errorMessage && <p className="error">{errorMessage}</p>}
          {isresult && (
            <div>
              <h2>You are all set</h2>
            </div>
          )}
        </div>
        </div>

        </div>
        <div className="w-1/2 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Output</h2>
            
            <button
              onClick={() => crewJob.startpdfJob()}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
              disabled={crewJob.running}
            >
              {crewJob.running ? "Running..." : "Draft email"}
            </button>
            <button
              onClick={() => crewJob.startJobHR()}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
              disabled={crewJob.running}
            >
              {crewJob.running ? "Running..." : "Find Match"}
            </button>
            {crewJob.running && (
              <button
                onClick={() => crewJob.setRunning(false)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
              >
                Stop
              </button>
            )}

          </div>
          <EmailLog email={crewJob.draft} />
          <EventLog events={crewJob.events} />
        </div>
      </div>
    </div>
  );
}
