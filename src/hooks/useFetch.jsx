
import { useEffect, useState } from "react";

export const useFetch = (url) => {
    const[data, setData] = useState(null);

    useEffect(() => {
        async function getData() {
            const res = await fetch(url);
            const data = await res.json();
            setData(data);
        }
        getData();
    }, [url]);

    return data;
}
