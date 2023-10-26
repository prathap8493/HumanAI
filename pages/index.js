import { Box, Button, Divider, Grid, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import ImageQuiz from "../components/quiz";
import Cookies from 'cookies-js';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'

export default function Home() {
  const [openQuiz,setOpenQuiz]=useState(false);
  const [resultdata,setResultData]=useState([]);
  const [score,setScore]=useState(null)
  const [visited, setVisited] = useState(false);

  useEffect(() => {
    const visitedStatus = Cookies.get('visited');
    if (visitedStatus === undefined) {
      Cookies.set('visited', 'false');
    } else {
      setVisited(visitedStatus === 'true');
    }
  }, []);  
  console.log(visited);

  const handleQuizCompletion = (results, score) => {
    setOpenQuiz(false)
    setResultData(results)
    setScore(score)
    Cookies.set('visited', 'true');
    fetch('http://localhost:4000/api/statistics')
      .then(response => response.json())
      .then(data => {
        let statsObj = {};
        data.forEach(stat => {
          statsObj[stat.image_src] = stat;
        });

        const updatedResults = results.map(result => {
          const stats = statsObj[result.imageSrc];
          if (stats) {
            return {
              ...result,
              correct: stats.correct,
              incorrect: stats.incorrect,
              total_display_count:stats.shown
            };
          }
          return result;
        });
        setResultData(updatedResults);
    });
  };

  return (
    <>
        {visited === false ? 
          <p>You have visited this page before.</p>
        :
          <Box backgroundColor="black" overflow="hidden" height={(openQuiz || score!==null) ? "100%" : "100vh"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
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
              <Box 
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
              </Box>
              {/* {score!==null && */}
                <Box border={"2px #35f160 solid"} margin={["5% 5% 2% 5%","5% 8% 2% 8%","5% 16% 2% 16%"]} padding={["2% 2%"]}>
                  <Text textAlign="center" color={"#35f160"}>The experiment has ended.‍‍</Text>
                  <Text textAlign="center" color={"#35f160"} marginTop={"3px"} marginBottom={"10px"}>Thank you so much for playing and having fun ♥</Text>
                  <Text textAlign="center" color={"grey"}>Read more about the research <Text as='u' cursor={"pointer"}> here.</Text></Text>
                </Box>
              {/* } */}
            </Box>
            {openQuiz && 
              <ImageQuiz onCompletion={handleQuizCompletion}/>
            }
            {score!==null &&
              <Box marginBottom={"10px"}>
                <Text fontSize="2xl" color={"#fff"}>Your score is: {score} out of 5</Text>
              </Box>
            }

            {resultdata?.length > 0 && 
              <div style={{ display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
                  <div style={{ 
                      display: 'flex',
                      flexDirection: 'row',
                      height: 'fit-content',
                      padding: '2% 5%',
                      overflowX: 'auto'
                  }}>
                      {resultdata.map((img, idx) => (
                          <div style={{ flex: '0 0 auto', marginRight: '20px', position: 'relative' }}>
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
                                          src={img?.imageSrc}
                                          alt='Green double couch with wooden legs'
                                          borderRadius='lg'
                                      />
                                      <Stack mt='6' spacing='3'>
                                          <Text size='md'>{img?.actualanswer==="AI" ? "🤖 Generated By AI" : "👨 A real Human"}</Text>
                                          <Text>You guessed {img?.guessedanswer}</Text>
                                      </Stack>
                                      <Stack mt='3' spacing='3'>
                                        <Text>
                                        {img?.total_display_count > 0 ? 
                                          (Math.round((img?.correct / img?.total_display_count) * 1000) / 10) % 1 === 0 ? 
                                              Math.round((img?.correct / img?.total_display_count) * 100) : (Math.round((img?.correct / img?.total_display_count) * 1000) / 10).toFixed(1)
                                          : '0'
                                        }%

                                          &nbsp;of people guessed correctly from a total of {img?.total_display_count} answers
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
                  </div>
              </div>
            }



            {/* {resultdata?.length > 0 && 
              <Grid templateColumns='repeat(5, 1fr)' gap={4} padding={"2%"}>
                {resultdata.map((img, idx) => (
                  <Card maxW='sm' border={img.isCorrect ? '4px solid green' : '4px solid red'} boxShadow={"0 0.5rem 2rem rgba(0,0,0,0.15)"}>
                  <CardBody>
                    <Image
                      src={img?.imageSrc}
                      alt='Green double couch with wooden legs'
                      borderRadius='lg'
                    />
                    <Stack mt='6' spacing='3'>
                      <Text size='md'>{img?.actualanswer==="AI" ? "🤖 Generated By AI" : "👨 A real Human"}</Text>
                      <Text>You guessed {img?.guessedanswer}</Text>
                    </Stack>
                  </CardBody>
                  <CardFooter overflow={"hidden"}>
                    <Text color="#E7197C" cursor="pointer">
                      <a href={img?.source} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                        {img?.source?.replace('https://', '')}
                      </a>
                    </Text>
                  </CardFooter>
                </Card>
                  
                ))}
              </Grid>
            } */}
          </Box>
        } 
        
    </>
  )
}

// <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                  //   <Box
                  //     key={idx}
                  //     boxShadow="2px 2px 10px #888888"
                  //     border={img.isCorrect ? '2px solid green' : '2px solid red'}
                  //     display={"flex"}
                  //     flexDir={"column"}
                  //     justifyContent={"center"}
                  //     alignItems={"center"}
                  //   >
                  //     <Image src={img?.imageSrc} alt="quiz-image" width={100} height={100}/>
                  //   </Box>
                  //   <Text color={"#fff"}>{img?.actualanswer}</Text>
                  // </Box>





                  



                  // {resultdata?.length > 0 && 
                  //   <div style={{ display: 'flex', justifyContent: 'center', padding: '2% 5%' }}>
                  //       <div style={{ overflowX: 'scroll', display: 'flex', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                  //           {resultdata.map((img, idx) => (
                  //               <div style={{ flex: '0 0 auto', marginRight: '16px',marginBottom:"10px"}}>
                  //                   <Card maxW='sm' boxShadow={"0 0.5rem 2rem rgba(0,0,0,0.15)"} style={{ position: 'relative' }}>
                  //                       {img.isCorrect ? 
                  //                           <Box style={{ 
                  //                               position: 'absolute', 
                  //                               top:"-10px",
                  //                               right:"0px",
                  //                               // top: '-1rem', 
                  //                               // right: '-1rem', 
                  //                               fontSize: '24px', 
                  //                               color: 'green'
                  //                           }} padding={"2px"}>
                  //                               <svg value="correct" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="2rem" height="2rem">
                  //                                   <path d="M0 0h24v24H0V0z" fill="#33cd32"></path>
                  //                                   <path d="M9 16.17L5.53 12.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L9 16.17z"></path>
                  //                               </svg>
                  //                           </Box>:
                  //                           <span style={{ 
                  //                               position: 'absolute', 
                  //                               top: '-1rem', 
                  //                               right: '-1rem', 
                  //                               fontSize: '24px', 
                  //                               color: 'red' 
                  //                           }}>*</span>
                  //                       }
                  //                       <CardBody>
                  //                           <Image
                  //                               src={img?.imageSrc}
                  //                               alt='Green double couch with wooden legs'
                  //                               borderRadius='lg'
                  //                           />
                  //                           <Stack mt='6' spacing='3'>
                  //                               <Text size='md'>{img?.actualanswer==="AI" ? "🤖 Generated By AI" : "👨 A real Human"}</Text>
                  //                               <Text>You guessed {img?.guessedanswer}</Text>
                  //                           </Stack>
                  //                       </CardBody>
                  //                       <CardFooter overflow={"hidden"}>
                  //                           <Text color="#E7197C" cursor="pointer">
                  //                               <a href={img?.source} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                  //                                   {img?.source?.replace('https://', '')}
                  //                               </a>
                  //                           </Text>
                  //                       </CardFooter>
                  //                   </Card>
                  //               </div>
                  //           ))}
                  //       </div>
                  //   </div>
                  // }