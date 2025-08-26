import { useEffect, useState } from "react";

export function useMessage() {

   function useTypingEffect(text: string, speed: number = 10) {
      const [displayed, setDisplayed] = useState("");

      useEffect(() => {
         if (!text) {
            setDisplayed("");
            return;
         }

         // Reset displayed text immediately
         setDisplayed("");

         let i = 0;
         const chars = Array.from(text);
         let cancelled = false;

         const interval = setInterval(() => {
            if (cancelled || i >= chars.length) {
               clearInterval(interval);
               return;
            }

            setDisplayed(text.slice(0, i + 1));
            i++;
         }, speed);

         return () => {
            cancelled = true;
            clearInterval(interval);
         };
      }, [text, speed]);

      return displayed;
   }

   return {
      useTypingEffect
   };
}