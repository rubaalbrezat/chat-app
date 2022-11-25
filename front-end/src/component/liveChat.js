import React from "react";

export default function LiveChat(props) {
    let ownerStyle = {
        backgroundColor: "lightgreen",
        padding: "10px",
        borderRadius: "10px",
        margin: "10px",
        width: "fit-content",
        alignSelf: "flex-end",
    };
    let otherStyle = {
        backgroundColor: "cyan",
        padding: "10px",
        borderRadius: "10px",
        margin: "10px",
        width: "fit-content",
        alignSelf: "flex-start",
    };


  return (
    <div>
      <h2>Live Chat</h2>
      <div
        style={{
          overflow: "auto",
          width: "100%",
          height: 200,
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <br></br>
        {props.message.map((msg) => (
          <div key={msg.id} ref={props.bottomRef}>
        <p style={msg?.split(":")[0] == localStorage.getItem("name")? ownerStyle :otherStyle}>
              {msg?.split(":")[0]}: {msg?.split(":")[1]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}