// Home.tsx
import React, { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import Result from './Result';
import { useNavigate } from 'react-router-dom';
import { Reveal } from '../utils/Reveal';
import NavBar from '../component/NavBar';
import { SideBar } from '../component/SideBar';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css';
import { IoClose } from "react-icons/io5";

const Home: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [parsedText, setParsedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCvFile(file);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (cvFile && company && jobTitle ) {
      try {
        const formData = new FormData();
        formData.append('docxFile', cvFile);

        const response = await axios.post('https://aws-backend.vercel.app/upload', formData);

        if (response.status === 200) {
          const resultData = {
            company,
            jobTitle,
            jobDescription,
            parsedText: response.data.text,
          };

          navigate('/result', {
            state: resultData,
          });
        } else {
          console.error('Error uploading the file.');
        }
      } catch (error) {
        console.error('Error while reading the Word document:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Some fields are empty. Please fill in all fields.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      });
      setIsLoading(false);
    }
  };

  const handleGetStartedClick = () => {
    setShowForm(true);
  };
  return (
    <main className="w-screen h-screen relative ">
      <div className="flex items-center w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://files.123freevectors.com/wp-content/original/168114-black-and-white-dot-background-image.jpg')" }}>
        <div className="flex justify-between items-start w-full pl-20 md:pl-40 pb-56 md:pb-20 z-[10]">
          
          <Reveal>
            <h1 className="text-[50px]  font-semibold">
              Hello Welcome to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a0e3a] to-[#756e88] ">
                {" "}
                <br />
                interviewer paragrapher
              </span>
              <p className="text-gray-500 hidden md:block text-[16px] mt-[2rem] w-[40rem]  ">
                is your secret weapon to success! Our cutting-edge platform transforms your CV into a personalized interview experience. 
                Say goodbye to boring job applications and hello to dynamic, engaging questions tailored just for you.
              </p>
            </h1>
          </Reveal>
          {!showForm ? (
            <Reveal>
              <button onClick={handleGetStartedClick} className="text-[30px] mt-[11rem] mr-[15rem] p-4  bg-[#330033] text-white rounded hover:bg-[#997F99]">
                Get Started
              </button>
            </Reveal>
          ) : (

            <div className="absolute w-[40rem] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg z-[20]">
              <span className=" text-2xl absolute top-5 right-5 cursor-pointer text-[#990000] p-3"
              onClick={() => setShowForm(false)}> 
              <IoClose />

              </span>
              <h2 className="text-2xl font-bold mb-4">Enter your details</h2>
              <Reveal>

              <form onSubmit={handleSubmit} className="space-y-4 w-[35rem]">
                <input
                  className="block w-full p-2 border rounded"
                  type="text"
                  placeholder="Company Name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
                <input
                  className="block w-full p-2 border rounded"
                  type="text"
                  placeholder="Job Title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
                <textarea
                  className="block w-full p-2 border rounded"
                  placeholder="Job Description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <input
                  type="file"
                  accept=".docx"
                  onChange={handleFileChange}
                  className="block w-full p-2 text-sm text-gray-500"
                />
                <button
                  className="font-bold py-2 px-4 rounded  bg-[#330033] text-white rounded hover:bg-[#997F99]"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Submit'}
                </button>
              </form>
              </Reveal>

              {isLoading && <p>Loading...</p>}
              {parsedText && (
                <div className="mt-4">
                  <h2 className="font-semibold">Submission Details:</h2>
                  <p><strong>Company:</strong> {company}</p>
                  <p><strong>Job Title:</strong> {jobTitle}</p>
                  <p><strong>Job Description:</strong> {jobDescription}</p>
                  <h3 className="font-semibold">Extracted Text:</h3>
                  <p>{parsedText}</p>
                </div>
              )}
            </div>

          )}
        </div>
      </div>
    </main>
  );
}

export default Home;
