const trailers = trailerId => {
   const frameId = {
      id01: 'https://www.youtube.com/embed/Sdp6VL_NBnY',
      id02: 'https://www.youtube.com/embed/g8Y_GL5h7Fs',
      id03: 'https://www.youtube.com/embed/tZeMfF45Gmc'
   };
   return frameId[trailerId];
};

export default trailers;