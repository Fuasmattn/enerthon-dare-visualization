import { useState, useEffect, useRef } from 'react';

export const useDelayUnmount = (isMounted: boolean, delayTime: number) => {
    const [shouldRender, setShouldRender] = useState(false);
    const didMount = useRef(false);
  
    useEffect(() => {
      let timeoutId: NodeJS.Timeout;
      if (isMounted && !shouldRender && didMount.current) {
        setShouldRender(true);
      } else if (!isMounted && shouldRender && didMount.current) {
        timeoutId = setTimeout(() => setShouldRender(false), delayTime);
      }
      return () => clearTimeout(timeoutId);
    }, [isMounted, delayTime, shouldRender]);

    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true;
        }
    });

    return shouldRender;
}