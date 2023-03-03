import { useRef, useState, useEffect, useContext } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { AnimatePresence, motion } from "framer-motion";
import f from "../../public/bg/5.gif";
import noise from "../../public/noise.gif";
import Image from "next/image";
import TextareaAutosize from "react-textarea-autosize";
import { io } from "socket.io-client";
import { SocketContext } from "../context/SocketContext";
import { randomColor, randomUsername } from "../utils/usernames";

const Home = () => {
  const socket = useContext(SocketContext);
  const embedRef = useRef(undefined);
  const chatInput = useRef(undefined);
  const messagesRef = useRef(undefined);
  const [showChat, setShowChat] = useState(true);
  const [participants, setParticipants] = useState(null);
  const [state, setState] = useState({
    joined: false,
    username: null,
    usercolor: null,
    paused: true,
    fullscreen: false,
    autoscroll: true,
  });
  const [messages, setMessages] = useState([]);

  function scrollToLastMessage() {
    if (state.autoscroll) {
      if (messagesRef.current)
        messagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  useEffect(() => {
    const keyHandler = (e) => {
      if (state.joined == false) {
        join();
      }
    };
    window.addEventListener("keydown", keyHandler);
    return () => {
      window.removeEventListener("keydown", keyHandler);
    };
  }, [state.joined]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key == "Enter") {
        if (e.shiftKey) {
        } else {
          e.preventDefault();
          sendMessage();
        }
      }
    };
    if (chatInput) {
      chatInput.current.addEventListener("keypress", handler);
    }
    return () => {
      chatInput.current.removeEventListener("keypress", handler);
    };
  }, [chatInput, sendMessage]);

  useEffect(() => {
    if (state.joined) {
      socket.on("join-broadcast", (numParticipants) => {
        setParticipants(numParticipants);
      });

      socket.on("message-broadcast", (data) => {
        setMessages((old) => {
          let newMessages = [...old, data];
          // newMessages.sort((a, b) => {
          //   if (a.time < b.time) return -1;
          //   else if (a.time == b.time) return 0;
          //   else return 1;
          // });
          return newMessages;
        });
      });

      socket.emit("join");
    }
  }, [socket, state.joined]);

  useEffect(() => {
    scrollToLastMessage();
  }, [messages, messagesRef, scrollToLastMessage]);

  function enterFullscreen() {
    setState((old) => {
      return { ...old, fullscreen: true };
    });
    let elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
  }

  function exitFullscreen() {
    setState((old) => {
      return { ...old, fullscreen: false };
    });
    document.exitFullscreen();
  }

  function sendMessage() {
    if (!chatInput.current.value || chatInput.current.value == "") return;
    const message = chatInput.current.value;
    chatInput.current.value = "";
    chatInput.current.focus();
    socket.emit("message", {
      user: state.username,
      usercolor: state.usercolor,
      time: Date.now(),
      message,
    });
    // scrollToLastMessage();
  }

  function join() {
    embedRef.current?.internalPlayer.unMute();
    setState((old) => {
      return {
        ...old,
        username: randomUsername(),
        usercolor: randomColor(),
        joined: true,
        paused: false,
      };
    });
  }

  return (
    <div className="relative w-full h-screen selection:bg-orange-500/40">
      {/* Toolbar */}
      <div className="absolute top-0 z-50 flex p-4 space-x-2">
        <button
          className="text-white duration-200 hover:text-orange-500"
          onClick={() => {
            state.fullscreen ? exitFullscreen() : enterFullscreen();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
            />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {!state.joined && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={join}
            className="absolute top-0 left-0 z-50 flex flex-col items-center justify-center w-full h-screen space-y-10 text-white cursor-pointer select-none bg-black/50 backdrop-blur-3xl"
          >
            <motion.div
              initial={{ y: -40, scale: 0.7 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -40, scale: 0.7 }}
              className="flex flex-col items-center space-y-10"
            >
              <h2 className="text-4xl font-black">Cozy @ Caltech</h2>

              <motion.button
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 1.1, rotate: 20 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-10 h-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex w-full h-full bg-black">
        <main className="w-[70%] h-full z-10">
          <Image fill src={noise} className="opacity-[3%]" />
          <Image fill src={f} alt="" className="opacity-30" />
        </main>
        <div className="flex flex-col justify-between w-[30%] h-full backdrop-blur-xl bg-black/80 rounded-l-xl z-10 text-white px-6 py-5">
          {/* Chat header */}
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center justify-center space-x-2 select-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
              <h2 className="text-lg font-black">Chat</h2>
            </span>
            <motion.button className="flex items-center space-x-1 duration-200 hover:text-orange-500">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <p>{participants}</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
            </motion.button>
          </div>
          <div className="flex flex-col w-full h-full py-8 overflow-y-auto">
            {messages.map((m, index) => {
              return (
                <div
                  key={m.time}
                  className="flex w-full px-2 py-1 duration-100 rounded-sm hover:bg-gray-800"
                >
                  <pre>
                    <button
                      className="font-black hover:underline"
                      style={{
                        color: m.usercolor,
                      }}
                    >
                      {m.user}
                    </button>
                    : {m.message}
                  </pre>
                </div>
              );
            })}
            <div ref={messagesRef} />
          </div>
          <div className="flex items-center justify-between w-full rounded-md">
            <TextareaAutosize
              maxRows={4}
              className="w-full h-full px-2 py-2 duration-200 bg-transparent border-2 rounded-md outline-none resize-none border-white/40 hover:border-orange-500 focus:border-orange-500"
              onSubmit={sendMessage}
              placeholder="Send a message!"
              ref={chatInput}
            />
            <button
              className="h-full ml-2 duration-200 rounded-md text-white/40 hover:text-orange-500"
              onClick={sendMessage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className="absolute top-0 w-full h-full p-4 text-white bg-gradient-to-tr"
        onClick={async () => {
          console.log(embedRef.current.internalPlayer);
          if (state.paused) {
            embedRef.current.internalPlayer.unMute();
            setState((old) => {
              return {
                ...old,
                paused: false,
              };
            });
          } else {
            embedRef.current.internalPlayer.mute();
            setState((old) => {
              return {
                ...old,
                paused: true,
              };
            });
          }
        }}
      />
      <YouTube
        className="hidden w-full h-full pointer-events-none"
        videoId="jfKfPfyJRdk"
        opts={{
          height: "100%",
          width: "100%",
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            modestbranding: 1,
            disablekb: 1,
            rel: 1,
          },
        }}
        id="player"
        ref={embedRef}
      />
    </div>
  );
};

export default Home;
