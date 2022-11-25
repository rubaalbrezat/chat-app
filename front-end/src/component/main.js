import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import LiveChat from "./liveChat";
import JoinChat from "./JoinChat";
import Send from "./Send";

export default function Chat() {
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState([]);
  const [date] = useState(Date.now());
  const [old, setOld] = useState([]);
  const [showOld, setShowOld] = useState(false);
  const [usersLogs, setUsersLogs] = useState([]);
  const bottomRef = useRef(null);
  const [sta, setSta] = useState("Show");

  const connect = async (name) => {
    await axios
      .post("http://localhost:3000/user", { user: name.toLowerCase() })
      .then(async (res) => {
        localStorage.setItem("name", res.data.user);
        localStorage.setItem("id", res.data.id);

        const q = await res.data.messages
          .filter((msg) => parseInt(msg.split(":")[5]) < Date.now())
          .reverse();
        setOld(q);
      
        setJoined(true);
      });

    const socket = io("ws://localhost:3000");

    socket.on("connection", () => {
      console.log("connected To server");
    });

    socket.on("joined", (newUser) => {
      setTimeout(() => {
        setUsersLogs((prev) => [...prev, `${newUser} joined the chat!`]);
        console.log(`${newUser} joined the chat!`);
      }, 100);
    });

    socket.on("left", (newUser) => {
      setTimeout(() => {
        setUsersLogs((prev) => [...prev, `${newUser} left the chat!`]);
        console.log(`${newUser} left the chat!`);
      }, 100);
    });

    socket.on("disconnect", () => {
      console.log("disconnected from server");
    });

    socket.on("message-added", () => {
      setTimeout(() => {
        first();
      }, 100);
    });

    setTimeout(async() => {
    await axios.post("http://localhost:3000/messages", { name, message:"" }).then((res) => {
      const q = res.data.messages.filter(
        (msg) => parseInt(msg.split(":")[5]) < date
        );
      
      let live = res.data.messages.slice(q.length);
      setMessage(live);
    });
  }, 100);
  };
  const joinHandler = async (e) => {
    e.preventDefault();
    if (e.target.name.value === "" || e.target.name.value.includes(":"))
      return alert("Please enter a valid name");
    connect(e.target.name.value);
  };

  const leaveHandler = async (e) => {
    e.preventDefault();
    await axios.post(
      `http://localhost:3000/user/${localStorage.getItem("name")}`
    );
    setJoined(false);
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    window.location.reload();
  };

  const first = async () => {
    const id = localStorage.getItem("id");
    await axios.get(`http://localhost:3000/user/${id}`).then((res) => {
      console.log(res.data.messages)
      const q = res.data.messages.filter(
        (msg) => parseInt(msg.split(":")[5]) < date
        );
      
      let live = res.data.messages.slice(q.length);
      setMessage(live);
    });
  };

  const sendHandler = async (e) => {
    e.preventDefault();
    if (e.target.message.value === "" || e.target.message.value.includes(":"))
      return alert("Please enter a valid message");
    // const socket = io("ws://localhost:3000");
    const message = e.target.message.value;
    const name = localStorage.getItem("name");
    await axios.post("http://localhost:3000/messages", { name, message });
    // socket.emit("message-added");
    e.target.message.value = "";
  };

  const checkOld = (e) => {
    e.preventDefault();
    setShowOld(!showOld);
    if (sta === "Show") {
      setSta("Hide");
    }
    if (sta === "Hide") {
      setSta("Show");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("name")) {
      setJoined(true);
      connect(localStorage.getItem("name"));
    }
  }, []);

  useEffect(() => {
    
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message, usersLogs]);

  return (
    <div>
        <div>
          <JoinChat
            joined={joined}
            joinHandler={joinHandler}
            leaveHandler={leaveHandler}
            
          />
        </div>

    
     <div>
        {message && joined && (
          <>
            <LiveChat message={message} bottomRef={bottomRef} />
          </>
        )}
        </div>

      <div>
        <Send joined={joined} sendHandler={sendHandler} />
        </div>
    </div>
  );
}