import React from "react";
import Attach from "./svg/Attach";

function MessageForm({ submitHandler, text, setText, setImg}) {
  return (
    <form className="message_form" onSubmit={submitHandler}>
      <label htmlFor="img">
        <Attach />
      </label>
      <input
        type="file"
        id="img"
        accept="image/*"
        onChange={(e) => setImg(e.target.files[0])}
        style={{ display: "none" }}
      />
      <div>
        <input
          type="text"
          placeholder="Enter message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div>
        <button className="btn">Send</button>
      </div>
    </form>
  );
}

export default MessageForm;
