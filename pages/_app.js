// import '../styles/globals.css'
import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ChakraProvider>
        {/* <style jsx global>
          {`
            :root {
              --font-pt-mono: 'PT Mono', monospace;
            }
            
            body {
              font-family: var(--font-pt-mono);
            }
          `}
        </style> */}
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default MyApp;
