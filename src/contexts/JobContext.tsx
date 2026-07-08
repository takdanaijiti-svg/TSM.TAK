import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { JobRequest, JobStatus } from '../types';
import { useAuth } from './AuthContext';
import { useSound } from '../hooks/useSound';

interface JobContextType {
  jobs: JobRequest[];
  createJob: (job: Omit<JobRequest, 'id' | 'userId' | 'requestDate' | 'status'>) => void;
  updateJobStatus: (jobId: string, status: JobStatus, note?: string, attachment?: string) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substring(2, 9);

export function JobProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const { user } = useAuth();
  const playSound = useSound();

  useEffect(() => {
    const stored = localStorage.getItem('taksin_jobs');
    if (stored) {
      setJobs(JSON.parse(stored));
    }
  }, []);

  const createJob = (jobParams: Omit<JobRequest, 'id' | 'userId' | 'requestDate' | 'status'>) => {
    if (!user) return;
    
    const newJob: JobRequest = {
      ...jobParams,
      id: generateId(),
      userId: user.id,
      requestDate: new Date().toISOString(),
      status: 'Pending',
    };

    
    setJobs(prev => {
      const updated = [newJob, ...prev];
      localStorage.setItem('taksin_jobs', JSON.stringify(updated));
      return updated;
    });
    playSound('success');
  };

  const updateJobStatus = (jobId: string, status: JobStatus, note?: string, attachment?: string) => {
    setJobs(prev => {
      const updated = prev.map(job => {
        if (job.id === jobId) {
          return {
            ...job,
            status,
            deliveryNote: note || job.deliveryNote,
            completedAttachment: attachment || job.completedAttachment,
            completedAt: status === 'Completed' || status === 'Delivered' ? new Date().toISOString() : job.completedAt
          };
        }
        return job;
      });
      localStorage.setItem('taksin_jobs', JSON.stringify(updated));
      return updated;
    });
    playSound('click');
  };

  return (
    <JobContext.Provider value={{ jobs, createJob, updateJobStatus }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}
