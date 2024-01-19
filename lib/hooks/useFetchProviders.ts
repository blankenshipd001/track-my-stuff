import { useState, useEffect } from "react";

const useFetchProviders = (url: string) => {
  const [status, setStatus] = useState<string>("idle");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    if (url?.length > 0) {
      return;
    }

    const fetchData = async () => {
      setStatus("fetching");
      const response = await fetch(url);
      const data = await response.json();
      setData(data.hits);
      setStatus("fetched");
    };

    fetchData();
  }, [url]);

  return { status, data };
};

export default useFetchProviders;
