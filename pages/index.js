import { Box, Button, Divider, Grid, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import ImageQuiz from "../components/quiz";
import Cookies from 'cookies-js';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { getImageStatistics, getUsers } from "../utils/fireStoreFunctions";

export default function Home({userIp}) {
  const [openQuiz,setOpenQuiz]=useState(false);
  const [resultdata,setResultData]=useState([]);
  const [score,setScore]=useState(null)
  const [visited, setVisited] = useState(false);
  const [ip,setIp]=useState("");
  const [userId, setUserId] = useState("");
  // useEffect(() => {
  //   fetch('/api/get-ip')
  //     .then(res => res.json())
  //     .then(data => console.log('userIp is:', data));
  // }, []);

  //Making the page accessible for one time only through localstorage
  useEffect(() => {
    let visitedStatus = localStorage.getItem('visited');
    let userId = localStorage.getItem('userId');

    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('userId', userId);
    }

    setUserId(userId);

    if (visitedStatus === null) {
      localStorage.setItem('visited', 'false');
    } else {
      setVisited(visitedStatus === 'true');
    }
  }, []);
   
  //Ip address fetching through third party api
  const fetchIPAddress = async () => {
    try {
      const response = await fetch('http://api.ipify.org?format=json');
      const data = await response.json();
      setIp(data?.ip)
    } catch (error) {
      console.error('Error fetching IP address:', error);
    }
  };

  useEffect(() => {
    fetchIPAddress();
  }, []);

  
  const handleQuizCompletion = async(results, score) => {
    setOpenQuiz(false)
    setResultData(results)
    setScore(score)
    Cookies.set('visited', 'true');
    localStorage.setItem('visited', 'true');
  };

  return (
    <>
        {visited === false ? 
          <p>You have visited this page before.</p>
        :
          <Box backgroundColor="black" overflow="hidden" height={(openQuiz || score!==null) ? "100%" : "100%"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
            <Box width={["100%","100%","38em"]} padding={"20px"}>
              <Heading 
                as="h1" 
                color={"#35f160"} 
                textAlign={"center"} 
                fontSize={["30px","40px","70px"]}
              >
                Human or Not?
              </Heading>
              <Text 
                textAlign={"center"} 
                color={"#35f160"} 
                marginTop={"20px"} 
                fontWeight={"600"}
              >
                Social turing game
              </Text>
              <Text 
                textAlign={["center"]}
                color={"white"} 
                padding={["2% 6%","2% 6%","2% 16%"]}
              >
                Chat with someone for two minutes, and try to figure out if it was a fellow human or an AI bot.
              </Text>
              <Text 
                textAlign="center" 
                color={"#fff"} 
              >
                Think you can tell the difference?
              </Text>
              {/* <Box 
                display={"flex"} 
                justifyContent={"center"} 
                marginTop={"30px"}
              >
                <Button 
                  border={"2px green solid"} 
                  onClick={()=>{setOpenQuiz(true);setResultData([]);setScore(null)}}
                >
                  Start the Game
                </Button>
              </Box> */}
              {/* {score!==null && */}
                <Box border={"2px #35f160 solid"} margin={["5% 5% 2% 5%","5% 8% 2% 8%","5% 16% 2% 16%"]} padding={["2% 2%"]}>
                  <Text textAlign="center" color={"#35f160"}>The experiment has ended.‍‍</Text>
                  <Text textAlign="center" color={"#35f160"} marginTop={"3px"} marginBottom={"10px"}>Thank you so much for playing and having fun ♥</Text>
                  <Text textAlign="center" color={"grey"}>Read more about the research <Text as='u' cursor={"pointer"}> here.</Text></Text>
                </Box>
              {/* } */}
            </Box>
            {score===null && 
              <ImageQuiz ip={ip} userId={userId} onCompletion={handleQuizCompletion}/>
            } 
            {score!==null &&
              <Box marginBottom={"10px"}>
                <Text fontSize="2xl" color={"#fff"}>Your score is: {score} out of 5</Text>
              </Box>
            }
            {resultdata?.length > 0 && 
              <Box display={"flex"} justifyContent={"center"}>
                <Box width={"90%"} overflowX={"auto"}>
                  <Box display="flex" flexDirection={["column","column","row"]} height={"fit-content"} padding={"2% 0%"} >
                    {resultdata.map((img, idx) => (
                      <div key={idx} style={{ flex: '0 0 auto', marginRight: '20px', position: 'relative' }}>
                        <Card maxW='sm' boxShadow={"0 0.5rem 2rem rgba(0,0,0,0.15)"} marginBottom={"10px"}>
                                  {img.isCorrect ? 
                                      <Box style={{ 
                                          position: 'absolute', 
                                          top: '-12px', 
                                          right: '-10px', 
                                          fontSize: '24px', 
                                          color: 'green'}} 
                                          padding={"2px"}
                                          backgroundColor={"#33cd32"}
                                          borderRadius={"6px"}
                                      >
                                          <svg value="correct" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="2rem" height="2rem">
                                              <path d="M0 0h24v24H0V0z" fill="#33cd32"></path>
                                              <path d="M9 16.17L5.53 12.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L9 16.17z"></path>
                                          </svg>
                                      </Box>:
                                      <Box style={{ 
                                          position: 'absolute', 
                                          top: '-12px', 
                                          right: '-10px', 
                                          fontSize: '24px', 
                                          color: 'green'}} 
                                          padding={"2px"}
                                          backgroundColor={"red"}
                                          borderRadius={"6px"}
                                      >
                                          <svg value="wrong" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="2rem" height="2rem"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02 .39 1.41 0 .39-.39 .39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38 .38-1.02 0-1.4z"></path></svg>
                                      </Box>
                                  }
                                  <CardBody>
                                      <Image
                                          src={img?.src}
                                          alt='Green double couch with wooden legs'
                                          borderRadius='lg'
                                      />
                                      <Stack mt='6' spacing='3'>
                                          <Text size='md'>{img?.answer==="AI" ? "🤖 Generated By AI" : "👨 A real Human"}</Text>
                                          <Text>You guessed {img?.guessedAnswer}</Text>
                                      </Stack>
                                      <Stack mt='3' spacing='3'>
                                        <Text>
                                        {img?.correct > 0 ? 
                                          (Math.round((img?.correct / (img?.correct+img?.incorrect)) * 1000) / 10) % 1 === 0 ? 
                                              Math.round((img?.correct / (img?.correct+img?.incorrect)) * 100) : (Math.round((img?.correct / (img?.correct+img?.incorrect)) * 1000) / 10).toFixed(1)
                                          : '0'
                                        }%

                                          &nbsp;of people guessed correctly from a total of {img?.correct+img?.incorrect} answers
                                        </Text>

                                      </Stack>
                                      <Stack  mt='3'>
                                        <Text color="#E7197C" cursor="pointer">
                                            <a href={img?.source} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                                                {img?.source?.replace('https://', '')}
                                            </a>
                                        </Text>
                                      </Stack>
                                  </CardBody>
                        </Card>
                      </div>
                    ))}
                  </Box>
                </Box>
              </Box>
            }
          </Box>
        } 
        
    </>
  )
}

