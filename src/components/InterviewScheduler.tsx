
      const newInterview = {
        jobTitle: selectedJob.title || "Untitled Position",
        date: new Date(interviewDate),
        time: interviewTime,
        jobId: selectedJob.id || "",
        duration: interviewDuration,
        candidateName: userData?.displayName || "Unknown",  // Adding required candidateName
        candidateEmail: userData?.email || "",
        interviewType: interviewType,
        notes: interviewNotes
      };
