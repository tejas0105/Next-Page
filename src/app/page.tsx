/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState, useRef } from "react";
import { PiDotsThreeBold } from "react-icons/pi";
import { IoMdClose } from "react-icons/io";
import { useSearchParams } from "next/navigation";

import shares from "./shares";

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
  const [coordinates, setCoordinates] = useState<Coordinates>({
    latitude: 0,
    longitude: 0,
  });
  const [isModalOpen, setIsModelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [params, setParams] = useState("");
  const [highlightLink, setHighLightLink] = useState({
    id: "",
  });
  const [redirectLink, setRedirectLink] = useState("");
  const [redirectLinkLoading, setRedirectLinkLoading] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const searchParams = useSearchParams();

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
          },
          {
            maximumAge: 10000,
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser");
        reject(new Error("Geo location not supported"));
      }
    });
  };

  const getIp = async () => {
    const response = await axios.get("https://api.ipify.org?format=json");
    return response?.data;
  };

  const getData = async () => {
    const response = await axios.get(
      "https://nodejs-deploy-ruz9.onrender.com/api/finalpage"
    );
    console.log(response);
    setResult(response?.data?.data);

    // console.log(result);
    // console.log({ lat: result.latitude, long: result.longitude });
  };

  const handleResize = () => {
    const { innerWidth } = window;
    if (innerWidth <= 768) setDeviceType("mobile");
    else if (innerWidth > 768 && innerWidth <= 1024) setDeviceType("tablet");
    else setDeviceType("desktop");
  };

  const sendCoordinates = async () => {
    try {
      try {
        // setIsLoading(true);
        const result: Coordinates = await getCoordinates();
        setCoordinates({
          latitude: result?.latitude,
          longitude: result?.longitude,
        });
        // const ipResp = await axios.get("https://api.ipify.org?format=json");
        // const ip = ipResp?.data;
        // console.log(ip);
        // console.log(Date.now());
        const body: Body = {
          lat: result?.latitude,
          long: result?.longitude,
          deviceType: deviceType,
          ip: await getIp(),
        };
        await axios.post("http://127.0.0.1:8000/api/getCoord", body);
        // setIsLoading(false);
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

  const redirectTo = async (linkId: string) => {
    if (startTime === null) return;

    const currentTime = new Date().getTime();
    const timeToClick = (currentTime - startTime) / 1000;
    console.log("Time to click:", timeToClick, "seconds");
    const postData = await axios.post("http://127.0.0.1:8000/api/updateView", {
      linkId: linkId,
      lat: coordinates?.latitude,
      long: coordinates?.longitude,
      ip: await getIp(),
    });
    console.log(postData?.data?.message);
  };

  const handleMoreOptions = async (linkId: string) => {
    if (result && result.length > 0) {
      const foundId: Item = result.find((v: Item) => v?.shortId === linkId)!;
      setId(foundId?.shortId);
    }
  };

  const showMoreOptions = async (id: string) => {
    let more = document.getElementById(id);
    if (more) {
      more.style.display = "flex";
    }
  };

  const hideMoreOptions = async (id: string) => {
    let more = document.getElementById(id);
    if (more) {
      more.style.display = "none";
    }
  };

  const getUrlParams = () => {
    const params = searchParams.get("linkId")!;
    if (params) {
      setParams(params);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  }, [isCopied]);

  const getShareLink = async (linkId: string) => {
    setRedirectLinkLoading(true);
    const response = await axios.get(
      `http://127.0.0.1:8000/api/getsharelink/${linkId}`
    );
    setRedirectLink(response?.data?.message);
    setRedirectLinkLoading(false);
  };

  const highlight = () => {
    if (result && result.length > 0) {
      const foundId = result.find((v) => v.shortId === params);
      if (foundId) {
        setTimeout(() => {
          setHighLightLink({
            id: foundId?.shortId,
          });
        }, 450);
      }
    }
  };

  const handleTTC = async () => {
    const startTime = new Date().getTime();
    setStartTime(startTime);
  };

  useEffect(() => {
    let referrer = document.referrer;
    console.log(referrer);
  }, []);

  useEffect(() => {
    getData();
    handleResize();
    handleTTC();
  }, []);

  useEffect(() => {
    if (deviceType) {
      sendCoordinates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceType]);

  useEffect(() => {
    getUrlParams();
  }, []);

  useEffect(() => {
    if (params) {
      highlight();
    }
  }, [params, result]);

  useEffect(() => {
    setTimeout(() => {
      setHighLightLink({
        id: "",
      });
    }, 1400);
  }, [highlightLink?.id]);

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
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-70">
          <div className="bg-white p-5 rounded-2xl shadow-md w-[32rem] h-[48.87rem] flex flex-col">
            <section className="upperSection w-full flex justify-between items-center">
              <p className="ml-44">Share this link</p>
              <button
                className="hover:bg-gray-200 rounded-md p-2"
                onClick={() => {
                  setIsModelOpen(false);
                }}
              >
                <IoMdClose className="text-xl" />
              </button>
            </section>
            <section className="lowerSection h-[calc(100%-18%)] mt-16">
              {shares &&
                shares.map((item) => {
                  let Variable = item?.logo;
                  return (
                    <div
                      key={item?.id}
                      className="share-div flex items-center h-14 hover:bg-gray-200 cursor-pointer mb-4 rounded-md"
                    >
                      <div className="logo-div">{Variable}</div>
                      <a
                        className="ml-4 capitalize"
                        href={redirectLink && `${item?.link}${redirectLink}`}
                        target="_blank"
                      >{`Share ${
                        item?.service === "whatsapp" ||
                        item?.service === "messenger"
                          ? "via"
                          : "on"
                      } ${item?.service}`}</a>
                    </div>
                  );
                })}
              <div
                className="share-link flex justify-between items-center w-full border h-14 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(redirectLink);
                  setIsCopied(true);
                }}
              >
                {id && (
                  <>
                    {redirectLinkLoading ? (
                      <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
                        <svg
                          className="text-gray-300 animate-spin"
                          viewBox="0 0 64 64"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                        >
                          <path
                            d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                            stroke="currentColor"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                          <path
                            d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                            stroke="currentColor"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-900"
                          ></path>
                        </svg>
                      </div>
                    ) : (
                      <p className="ml-4">{redirectLink}</p>
                    )}
                    <p className="mr-7 cursor-pointer">
                      {isCopied ? "Copied" : "Copy"}
                    </p>
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center w-screen h-screen p-4 bg-gray-100">
        <div className="mt-16 sm:w-[35rem] md:w-[44rem] lg:w-[55rem] h-full">
          {result &&
            result.length > 0 &&
            result.map((item: Item) => {
              return (
                <a
                  key={item?._id}
                  href={item?.shortenLink}
                  target="_blank"
                  style={{
                    backgroundColor: `${
                      highlightLink?.id === item?.shortId
                        ? "gray"
                        : "rgb(249 250 251 / 1)"
                    }`,
                  }}
                  className={`flex items-center border w-full rounded-lg h-20 hover:bg-gray-100 bg-gray-50 shadow-md mb-3 duration-200 ease-in-out`}
                  onMouseEnter={() => {
                    showMoreOptions(item?.shortId);
                  }}
                  onMouseLeave={() => {
                    hideMoreOptions(item?.shortId);
                  }}
                  onClick={() => {
                    redirectTo(item?.shortId as string);
                  }}
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
                    <div
                      className="more hidden justify-center items-center options mr-8 p-1 rounded-full hover:bg-gray-300"
                      id={item?.shortId}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsModelOpen(true);
                        handleMoreOptions(item?.shortId);
                        getShareLink(item?.shortId);
                      }}
                    >
                      <PiDotsThreeBold className="text-2xl" />
                    </div>
                  </div>
                </a>
              );
            })}
        </div>
      </div>
    </>
  );
}
