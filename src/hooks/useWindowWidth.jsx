import { useEffect, useState } from "react"

export const useWindowWidth = () => {
    const[onSmallScreen, setOnSmallScreen] = useState(false);

    const checkScreenSize = () => {
        setOnSmallScreen(window.innerWidth < 758);
    }
    useEffect(() => {
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);   

    return onSmallScreen;
}