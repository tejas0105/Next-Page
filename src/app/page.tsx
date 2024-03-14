/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

interface Item {
  _id?: string;
  shortId: string;
  title?: string;
  shortenLink?: string;
  originalLink: string;
  visitHistory?: number[];
  thumbnail: string;
  hidden: boolean;
}

interface Coordinates {
  latitude: Number;
  longitude: Number;
}

interface Body {
  lat: Number;
  long: Number;
  deviceType: String;
  ip: String;
}

export default function Home() {
  const [result, setResult] = useState<Item[]>([]);
  const [deviceType, setDeviceType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const getDateInIso = (timestamp: number): String => {
    let date = new Date(timestamp);
    let isoFormat = date.toISOString();
    return isoFormat;
  };

  // const ref = useRef(null);

  const getCoordinates = (): Promise<Coordinates> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = position.coords;
            resolve(coords);
          },
          (error) => {
            console.log("Error getting location: " + error.message);
            reject(error);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser");
        reject(new Error("Geo location not supported"));
      }
    });
  };
  const getData = async () => {
    setIsLoading(true);
    const response = await axios.get(
      "https://nodejs-deploy-ruz9.onrender.com/api/finalpage"
    );
    console.log(response);
    setResult(response?.data?.data);
    setIsLoading(false);
    // console.log(result);
    // console.log({ lat: result.latitude, long: result.longitude });
  };

  const handleResize = () => {
    const { innerWidth, innerHeight } = window;
    if (innerWidth <= 768) setDeviceType("mobile");
    else if (innerWidth > 768 && innerWidth <= 1024) setDeviceType("tablet");
    else setDeviceType("desktop");
  };

  const sendCoordinates = async () => {
    try {
      try {
        const result: Coordinates = await getCoordinates();
        // console.log(result.latitude);
        const ipResp = await axios.get("https://api.ipify.org?format=json");
        const ip = ipResp?.data;
        console.log(ip);
        console.log(Date.now());
        const body: Body = {
          lat: result?.latitude,
          long: result?.longitude,
          deviceType: deviceType,
          ip: ip,
        };
        await axios.post(
          "https://nodejs-deploy-ruz9.onrender.com/api/getCoord",
          body
        );
        // console.log(resp?.data?.message);
      } catch (error: any) {
        if (error.code === 1) {
          const ipResp = await axios.get("https://api.ipify.org?format=json");
          const ip = ipResp?.data;
          await axios.post(
            "https://nodejs-deploy-ruz9.onrender.com/api/handlenulllocation",
            {
              lat: null,
              long: null,
              deviceType: deviceType,
              ip: ip,
            }
          );
        }
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getData();
    handleResize();
  }, []);

  // useEffect(() => {
  //   if (result) console.log(result);
  // }, [result]);

  useEffect(() => {
    if (deviceType) {
      sendCoordinates();
    }
  }, [deviceType]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center  h-screen p-4">
      <div className="mt-16 sm:w-[35rem] md:w-[44rem] lg:w-[55rem] h-full">
        {result &&
          result.length > 0 &&
          result.map((item: Item) => {
            return (
              <a
                key={item?._id}
                href={item?.shortenLink}
                target="_blank"
                className="flex items-center border w-full rounded-lg h-20 hover:bg-gray-100 bg-gray-50 shadow-md mb-3 duration-200 ease-in-out "
              >
                <div className="h-full">
                  <img
                    className="h-full rounded-l-md"
                    src={item?.thumbnail}
                    alt={item?.title}
                    // ref={ref}
                  />
                </div>
                <div className="h-full w-[calc(100%-141px)] flex justify-center items-center">
                  <p className="text-xs overflow-ellipsis sm:text-sm md:text-lg w-full text-left ml-3">
                    {item?.title}
                  </p>
                </div>
              </a>
            );
          })}
      </div>
    </div>
  );
}
