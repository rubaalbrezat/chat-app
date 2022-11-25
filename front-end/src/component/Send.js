import React from "react";

export default function Send(props) {
  return (
    <div>
      {" "}
      {props.joined && (
        <>
          <h2>Send Message</h2>
          <div>
            <form onSubmit={props.sendHandler}>
              <input
                type="text"
                id="message"
                placeholder="Enter message"
                required
              />
              <button type="submit">Send message</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}