import { useEffect } from "react";

const useReload = (start) => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if(start){
      event.preventDefault(); // Necessary for some browsers
      event.returnValue = ""; // Triggers the default browser dialog
    };}

    if (start) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [start]);
};

export default useReload;
