/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
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

export default function Home() {
  const [result, setResult] = useState([]);
  const getData = async () => {
    const response = await axios.get(
      "https://nodejs-deploy-rjf0.onrender.com/api/finalpage"
    );
    console.log(response);
    setResult(response?.data?.data);
  };
  useEffect(() => {
    console.log(
      navigator?.geolocation?.getCurrentPosition((position) => {
        console.log(position?.coords);
      })
    );
    getData();
  }, []);

  useEffect(() => {
    if (result) console.log(result);
  }, [result]);
  return (
    <div className="flex flex-col items-center h-screen border">
      <div className="mt-16 h-full">
        {result &&
          result.length > 0 &&
          result.map((item: Item) => {
            return (
              <a
                key={item?._id}
                href={item?.shortenLink}
                target="_blank"
                className="flex items-center border w-[50rem] rounded-lg h-20 hover:bg-gray-100 bg-gray-50 shadow-md mb-5 duration-200 ease-in-out "
              >
                <div className="h-full">
                  <img
                    className="h-full rounded-l-md"
                    src={item?.thumbnail}
                    alt={item?.title}
                  />
                </div>
                <p className="ml-4 text-lg">{item?.title}</p>
              </a>
            );
          })}
      </div>
    </div>
  );
}
