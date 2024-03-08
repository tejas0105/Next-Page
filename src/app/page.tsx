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

export default function Home() {
  const [result, setResult] = useState<Item[]>([]);
  const [coordinates, setCoordinates] = useState<Coordinates>();

  // const ref = useRef(null);

  const getCoordinates = () => {
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
    const response = await axios.get("http://127.0.0.1:8000/api/finalpage");
    // console.log(response);
    setResult(response?.data?.data);
    // console.log(result);
    // console.log({ lat: result.latitude, long: result.longitude });
  };

  const sendCoordinates = async () => {
    try {
      const result: unknown = await getCoordinates();
      console.log(result);
      const ipResp = await axios.get("https://api.ipify.org?format=json");
      const ip = ipResp?.data;
      console.log(ip);
      const body = {
        lat: result?.latitude,
        long: result?.longitude,
        ip: ip,
      };
      const resp = await axios.post("http://127.0.0.1:8000/api/getCoord", body);
      console.log(resp?.data?.message);
    } catch (error: any) {
      console.log(error);
      if (error.code === 1) {
        const ipResp = await axios.get("https://api.ipify.org?format=json");
        const ip = ipResp?.data;
        await axios.post("http://127.0.0.1:8000/api/getCoord", {
          ip: ip,
          allowed: false,
        });
      }
    }
  };

  useEffect(() => {
    getData();
    sendCoordinates();
    // const width = ref;
    // console.log(ref.current.clientWidth);
  }, []);

  // useEffect(() => {
  //   if (result) console.log(result);
  // }, [result]);
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
