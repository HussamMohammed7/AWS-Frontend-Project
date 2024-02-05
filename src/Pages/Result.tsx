import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import NavBar from "../component/NavBar";
import { SideBar } from "../component/SideBar";
import { Reveal } from "../utils/Reveal";

// Define TypeScript types for interview question-answer pairs
type InterviewQA = {
  question: string;
  answer: string;
};

const ResultContent: React.FC<{
  company: string;
  jobTitle: string;
  jobDescription: string;
  parsedText: string;
}> = ({ company, jobTitle, jobDescription, parsedText }) => {
  // State to store interview advice, interview Q&A pairs, and recommended YouTube videos
  const [interviewParagraph, setInterviewParagraph] = useState<string>("");
  const [interviewQA, setInterviewQA] = useState<InterviewQA[]>([]);
  const [recommendedVideos, setRecommendedVideos] = useState<string[]>([]);
  const [youtubeVideoIds, setYoutubeVideoIds] = useState<string[]>([]);


  useEffect(() => {
    const generateInterviewAdvice = async () => {
      try {
        const apiKey =  process.env.REACT_APP_KEY;

        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-3.5-turbo", // Specify the model name here
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant.",
              },
              {
                role: "user",
                content: `Generate interview paragraph the candidate will say to introduce himself (Make the introduction at least 200 words) in the interview and answer 5 top interview questions for a candidate applying for the role of ${jobTitle} at ${company}. The candidate has the following CV:\n${parsedText}\n\nJob Description: ${jobDescription}. and provide the links to 3 YouTube videos that will help the candidate prepare for the interview. , and i want you the answer split into three sections. i want to wrap the introduction with ""  . and for every question start with [ and end it with ], and wrap the answers with <> , and wrap the youtube recommendation with {} and wrap the link to the video with $ $.`,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
          }
        );

        const assistantResponse = response.data.choices[0].message.content;
        console.log("Assistant Response:", assistantResponse);

        // Extract interview paragraph within double quotation marks
        const interviewParagraphMatch = assistantResponse.match(/"([^"]*)"/);
        if (interviewParagraphMatch) {
          setInterviewParagraph(interviewParagraphMatch[1]);
        }

        // Extract questions and answers within square brackets
        const questionRegex = /\[Question (\d+): (.*?)\]/g;
        const answerRegex = /<(.*?)>/g;

        const extractedQuestions: string[] = [];
        const extractedAnswers: string[] = [];

        let questionMatch;
        while (
          (questionMatch = questionRegex.exec(assistantResponse)) !== null
        ) {
          extractedQuestions.push(questionMatch[2]);
        }

        let answerMatch;
        while ((answerMatch = answerRegex.exec(assistantResponse)) !== null) {
          extractedAnswers.push(answerMatch[1]);
        }

        // Store the extracted questions and answers as InterviewQA objects
        setInterviewQA(
          extractedQuestions.map((question, index) => ({
            question: question,
            answer: extractedAnswers[index] || "", // Ensure there's an answer for each question
          }))
        );

        // Extract YouTube recommendations within curly braces
        const youtubeRecommendationRegex = /\{([^}]*)\}/g;
        const extractedYouTubeRecommendations: string[] = [];

        let youtubeRecommendationMatch;
        while (
          (youtubeRecommendationMatch =
            youtubeRecommendationRegex.exec(assistantResponse)) !== null
        ) {
          extractedYouTubeRecommendations.push(youtubeRecommendationMatch[1]);
        }



        setRecommendedVideos(extractedYouTubeRecommendations);




        const youtubeIDRecommendationRegex = /\$(.*?)\$/g;
        const extractedYouTubeIDRecommendations: string[] = [];
        let youtubeIDRecommendationMatch;

        while (
          (youtubeIDRecommendationMatch =
            youtubeIDRecommendationRegex.exec(assistantResponse)) !== null
        ) {
          extractedYouTubeIDRecommendations.push(youtubeIDRecommendationMatch[1]);
        }

        setYoutubeVideoIds(extractedYouTubeIDRecommendations)

        // ... Your existing code ...
      } catch (error) {
        console.error("Error calling OpenAI API:", error);
      }
    };

    generateInterviewAdvice();
  }, [company, jobTitle, jobDescription, parsedText]);

  return (
    <div className=" ">
      <div className="absolute w-full h-full flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: "url('')" }}>
        {interviewParagraph === "" && (
          <div>
   
          <CircularProgress style={{ color: "#674ea7" }} size={200} />
          
          <h1 className="absolute mt-[5rem] pr-10 ">
          Process the interview data...
        </h1>
          </div>
          

        )}

       
      </div>

      {interviewParagraph !== "" && (

      <div>
     
      <div className="absolute">
        <div className="sticky ml-10">
          <SideBar />
        </div>
      </div>
      <Reveal>
      <div className=" p-[10rem] min-h-screen">
        <h3 className="text-3xl font-bold mb-4 text-center">
          Interview Introduction
        </h3>
        <p>{interviewParagraph}</p>
      </div>
       </Reveal>
       <Reveal>

      <div className="p-[10rem] min-h-screen">
        <h3  className="text-3xl font-bold mb-4 text-center" >Interview potential Questions and Answers</h3>
        <ul>
          {interviewQA.map((qa, index) => (
            <li key={index}>
              <strong className="text-xl">Question:</strong> {qa.question}
              <br />
              <strong className="text-xl">Answer:</strong> {qa.answer}
            </li>
          ))}
        </ul>
      </div>
      </Reveal>

      <div className="p-[10rem] min-h-screen"> 
      <h3  className="text-3xl font-bold mb-4 text-center">Recommended YouTube Videos</h3>
      <ul>
        {recommendedVideos.map((videoUrl, index) => (
          <li key={index}>
            <br />
            <a href={videoUrl} target="_blank" rel="noopener noreferrer">
              {videoUrl}
            </a>
          </li>
        ))}
      </ul>
      <ul>
        {youtubeVideoIds.map((videoUrl, index) => (
          <li key={index}>
            <br />
            <a href={videoUrl} target="_blank" rel="noopener noreferrer">
              {videoUrl}
            </a>
          </li>
        ))}
      </ul>
      </div>
    </div>
            )}

    </div>
    
  );
};

const Result: React.FC = () => {
  
  const location = useLocation();
  const state = location.state as
    | {
        company: string;
        jobTitle: string;
        jobDescription: string;
        parsedText: string;
      }
    | undefined;

  if (!state) {
    // Handle the case when state is not defined or does not
    return <div>No state data available.</div>;
  }

  const { company, jobTitle, jobDescription, parsedText } = state;

  return (
    <div>
      <ResultContent
        company={company}
        jobTitle={jobTitle}
        jobDescription={jobDescription}
        parsedText={parsedText}
      />
    </div>
  );
};

export default Result;
