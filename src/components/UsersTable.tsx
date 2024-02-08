import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const url = 'https://randomuser.me/api';

interface UserData {
    email: string;
    name: {
      first: string;
      last: string;
    };
}

export const UsersTable = () => {
    const [errorMsg, setErrorMsg] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userData , setUserData] = useState<UserData>();
    const initialized = useRef(false); //used to prevent useEffect in rendering twice

    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await axios.get(url);
        const resData: UserData = await res.data.results[0];
        console.log('resData', resData);
        
        setUserData(resData);
      } catch (err: any) {
        console.log('error',err);
        setErrorMsg(err);
      } finally {
        //will disable loading whether it is success or not
        setLoading(false);
      }
    };
    

    useEffect(() => {
        if(!initialized.current){
          initialized.current = true;
          fetchData();
        }
    }, []);

    return (        
        <StyledContainer>
            {loading && 
            <StyledSpinner viewBox="0 0 50 50">
              <circle
                className="path"
                cx="25"
                cy="25"
                r="20"
                fill="none"
                strokeWidth="4"
              />
            </StyledSpinner>}
            {errorMsg && 
            <StyledErrorDiv>An error has occured.</StyledErrorDiv>}

            {!loading && !errorMsg && (
            <div>
            <h1>User Data</h1>
            <p><b>Email:</b> {userData?.email}</p>
            <p><b>Name:</b> {userData?.name?.first} {userData?.name?.last}</p>
            <StyledButton onClick={fetchData}> Refresh </StyledButton>
            </div>
            )}
        </StyledContainer>
    )
};


const StyledContainer = styled.div`
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const StyledButton = styled.button`
  background-color: green;
  border-radius: 6px;
  border: none;
  font-size: 20px;
  color: white;
  display: inline-block;
`;

const StyledErrorDiv = styled.div`
  height: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
`;


const StyledSpinner = styled.svg`
  animation: rotate 2s linear infinite;
  margin: 40px 0 0 25px;
  width: 50px;
  height: 50px;
  
  & .path {
    stroke: #5652BF;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }
  
  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`;