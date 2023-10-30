import { useState, useEffect } from 'react';
import { Box, Button, Grid, GridItem, Image, Text } from '@chakra-ui/react';
import { addStatistics, addUser, getImageStatistics, getUsers } from '../../utils/fireStoreFunctions';

function ImageQuiz(props) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [imageStatistics, setImageStatistics] = useState({});

  
  // useEffect(() => {
  //   const randomImages = [...imageData].sort(() => 0.5 - Math.random()).slice(0, 5);
  //   setSelectedImages(randomImages);

  //   fetch('http://localhost:4000/api/statistics')
  //     .then(response => response.json())
  //     .then(data => {
  //       // console.log(data)
  //       let statsObj = {};
  //       data.forEach(stat => {
  //         statsObj[stat.image_src] = stat;
  //       });
  //       setImageStatistics(statsObj);
  //     });
  // }, []);

  //FireBase Integration

  useEffect(() => {
  
    const fetchImageStatistics = async () => {
      try {
        const stats = await getImageStatistics();
        const randomImages = [...stats].sort(() => 0.5 - Math.random()).slice(0, 5);
        setSelectedImages(randomImages);
        let statsObj = {};
        stats.forEach(stat => {
          statsObj[stat.src] = stat;
        });
        setImageStatistics(statsObj);
      } catch (error) {
        console.error('Error fetching image statistics:', error);
      }
    };
  
    fetchImageStatistics();
  }, []);
  
  const handleAnswer = async (index, answer) => {
    if (userAnswers[index] !== undefined) return;

    const updatedAnswers = { ...userAnswers, [index]: answer };
    setUserAnswers(updatedAnswers);

    const result = {
      isCorrect: selectedImages[index].answer === answer,
      imageSrc: selectedImages[index].src,
      actualAnswer: selectedImages[index]?.answer,
      guessedAnswer: answer,
      source: selectedImages[index]?.source
    };
    const newResults = [...results, result];
    setResults(newResults);

    // Update statistics for the current image
    const currentImageSrc = selectedImages[index].src;
    // const currentImageId=Number(selectedImages[index].id);
    const currentStats = imageStatistics[currentImageSrc];
    // const isCorrectGuess = selectedImages[index].answer === answer;
    // currentStats.shown += 1;
    // currentStats.correct += isCorrectGuess ? 1 : 0;
    // currentStats.incorrect += isCorrectGuess ? 0 : 1;

    // const updatedStatistics = { ...imageStatistics, [currentImageSrc]: currentStats };
    // setImageStatistics(updatedStatistics);
    
    // // Update the statistics in the backend
    // await fetch('http://localhost:4000/api/statistics', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(currentStats)
    // });

    //FireBase Integration
    // const currentImageSource=selectedImages[index].source;
    // const currentStats = imageStatistics[currentImageSrc] || { image_id: currentImageId, image_src: currentImageSrc, correct: 0, incorrect: 0,source:currentImageSource};
    const isCorrectGuess = selectedImages[index].answer === answer;

    // currentStats.shown += 1;
    // currentStats.id = Number(selectedImages[index].id);
    currentStats.correct += isCorrectGuess ? 1 : 0;
    currentStats.incorrect += isCorrectGuess ? 0 : 1;

    const updatedStatistics = { ...imageStatistics, [currentImageSrc]: currentStats };
    setImageStatistics(updatedStatistics);

    try {
      await addStatistics(currentStats);
      console.log('Statistics updated successfully');
    } catch (error) {
      console.error('Error updating statistics:', error);
    }


    if (index < selectedImages.length - 1) {
      setCurrentImageIndex(index + 1);
    } 
    else {
      let correctCount = newResults.filter(res => res.isCorrect).length;
      setScore(correctCount);
      if (props.onCompletion) {
        props.onCompletion(newResults, correctCount);
        const data = {
          user_ip: props?.ip,
          user_uuid: props?.userId,
          correct_count: correctCount,
          incorrect_count: 5 - correctCount,
          imageData:newResults
        };
        // await fetch('http://localhost:4000/api/predicted', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(data)
        // });

        //FireBase Interation 
        try {
          console.log(newResults)
          await addUser(data);
          console.log('User added successfully');
        } catch (error) {
          console.error('Error adding user:', error);
        }
        
      }
    }
  };


  const currentImage = selectedImages[currentImageIndex];
  const hasAnswered = userAnswers[currentImageIndex] !== undefined;

  return (
    <Box>
      {currentImage && (
        <Grid templateColumns={['repeat(1, 1fr)','repeat(1, 1fr)','repeat(2, 1fr)']} marginBottom="50px">
            <GridItem w='70%' boxShadow={"2px 2px 50px #888888"} display={"flex"} justifyContent={"center"} alignItems={"center"} backgroundColor={"#fff"}>
                <Image src={currentImage?.src} alt="quiz-image" width={"80%"} height={"100%"} />
            </GridItem>
            <GridItem w='100%' display={"flex"} flexDir="column" alignItems={"center"} justifyContent={"center"}>
                <Text fontSize={"24px"} fontWeight={"600"} color={"#fff"} marginTop={["10px","10px","0px"]}>
                    Question {currentImageIndex + 1}/5
                </Text>
                <Text fontSize={"40px"} fontWeight={"800"} color={"#fff"} >AI or Human?</Text>
                <Box display='flex' flexDirection={['column','column','row']} gap={["10px","10px","50px"]} marginTop={["10px","20px","50px"]}>
                    <Button 
                        onClick={() => handleAnswer(currentImageIndex, 'AI')}
                        backgroundColor={"white"}
                        border={"1px lightgrey solid"}
                        padding={"30px 20px"}
                        isDisabled={hasAnswered}
                    >
                        🤖 Generated By AI
                    </Button>
                    <Button 
                        onClick={() => handleAnswer(currentImageIndex, 'Human')} 
                        backgroundColor={"white"}
                        border={"1px lightgrey solid"}
                        padding={"30px 20px"}
                        isDisabled={hasAnswered}
                    >
                        👨 It's a real human!
                    </Button>
                </Box>
            </GridItem>
        </Grid>
      )}
    </Box>
  );
}

export default ImageQuiz;



const imageData = [
  { id:'1', src: '/AI/AI img 1.jpg', answer: 'AI',source:"https://create.playform.io/"},
  { id:'2',src: '/AI/AI img 2.jpg', answer: 'AI',source:"https://create.playform.io/"},
  { id:'3',src: '/AI/AI img 3.jpg', answer: 'AI',source:"https://create.playform.io/"},
  { id:'4',src: '/AI/AI img 4.jpg', answer: 'AI',source:"https://create.playform.io/"},
  { id:'5',src: '/AI/AI img 5.jpg', answer: 'AI',source:"https://create.playform.io/"},
  { id:'6',src: '/AI/AI img 6.jpg', answer: 'AI',source:"https://create.playform.io/"},
  { id:'7',src: '/AI/AI img 7.jpg', answer: 'AI',source:"https://create.playform.io/"},
  { id:'8',src: '/AI/AI img 8.jpg', answer: 'AI',source:"https://create.playform.io/"},
  { id:'9',src: '/AI/AI img 9.jpg', answer: 'AI',source:"https://create.playform.io/"},
  { id:'10',src: '/AI/AI img 10.jpg', answer: 'AI',source:"https://create.playform.io/"},
  { id:'11',src: '/AI/AI img 11.jpg', answer: 'AI',source:"https://thispersondoesnotexist.com/"},
  { id:'12',src: '/AI/AI img 12.jpg', answer: 'AI',source:"https://create.playform.io/"},
  { id:'13',src: '/AI/AI img 13.jpg', answer: 'AI',source:"https://create.playform.io/"},
  { id:'14',src: '/AI/AI img 14.jpg', answer: 'AI',source:"https://create.playform.io/"},
  { id:'15',src: '/AI/AI img 15.png', answer: 'AI',source:"https://thispersondoesnotexist.com/"},
  { id:'16',src: '/AI/AI img 16.jpg', answer: 'AI',source:"https://thispersondoesnotexist.com/"},
  { id:'17',src: '/AI/AI img 17.jpg', answer: 'AI',source:"https://create.playform.io/"},
  { id:'18',src: '/AI/AI img 18.jpg', answer: 'AI',source:"https://create.playform.io/"},
  { id:'19',src: '/AI/AI img 19.jpg', answer: 'AI',source:"https://create.playform.io/"},
  { id:'20',src: '/AI/AI img 20.jpg', answer: 'AI',source:"https://create.playform.io/"},
  { id:'21',src: '/Human /img 1.jpg', answer: 'Human',source:"https://unsplash.com/photos/KAPRQjlSzCA"},
  { id:'22',src: '/Human /img 2.jpg', answer: 'Human',source:"https://unsplash.com/@miracletwentyone"},
  { id:'23',src: '/Human /img 3.jpg', answer: 'Human',source:"https://unsplash.com/@jakefagan"},
  { id:'24',src: '/Human /img 4.jpg', answer: 'Human',source:"https://unsplash.com/@emberglo_photography"},
  { id:'25',src: '/Human /img 5.png', answer: 'Human',source:"https://unsplash.com/@chernus_tr"},
  { id:'26',src: '/Human /img 6.jpg', answer: 'Human',source:"https://unsplash.com/@jrscorpio"},
  { id:'27',src: '/Human /img 7.jpg', answer: 'Human',source:"https://unsplash.com/@itayverchik"},
  { id:'28',src: '/Human /img 8.jpg', answer: 'Human',source:"https://unsplash.com/@tamarabellis"},
  { id:'29',src: '/Human /img 9.jpg', answer: 'Human',source:"https://unsplash.com/@austindistel"},
  { id:'30',src: '/Human /img 10.jpg', answer: 'Human',source:"https://unsplash.com/@sadswim"},
  { id:'31',src: '/Human /img 11.jpg', answer: 'Human',source:"https://unsplash.com/@taylor_deas_melesh"},
  { id:'32',src: '/Human /img 12.jpg', answer: 'Human',source:"https://unsplash.com/@joaccord"},
  { id:'33',src: '/Human /img 13.jpg', answer: 'Human',source:"https://unsplash.com/@jakaylatoney"},
  { id:'34',src: '/Human /img 14.jpg', answer: 'Human',source:"https://unsplash.com/@jekafe"},
  { id:'35',src: '/Human /img 15.jpg', answer: 'Human',source:"https://unsplash.com/@visualartery"},
  { id:'36',src: '/Human /img 16.jpg', answer: 'Human',source:"https://unsplash.com/photos/tLKOj6cNwe0"},
  { id:'37',src: '/Human /img 17.jpg', answer: 'Human',source:"https://unsplash.com/@visualartery"},
  { id:'38',src: '/Human /img 18.jpg', answer: 'Human',source:"https://unsplash.com/@dianasimumpande"},
  { id:'39',src: '/Human /img 19.jpg', answer: 'Human',source:"https://unsplash.com/@whatuprell"},
  { id:'40',src: '/Human /img 20.jpg', answer: 'Human',source:"https://unsplash.com/photos/i2hoD-C2RUA"},
  
];