import React, { useEffect, useState } from "react";

import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";
import userDefaultPic from "../userDefaultPic.png";

function User({ user1, user, selectUser, chat }) {
  const user2 = user?.uid;
  const [data, setData] = useState("");

  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setData(doc.data());
    });
    return () => unsub();
  }, []);

  return (
    <>
      <div
        className={`user_wrapper ${
          chat?.name === user.name && "selected_user"
        }`}
      >
        <div className="user_info" onClick={() => selectUser(user)}>
          <div className="user_details">
            <img
              src={user.avatar || userDefaultPic}
              alt="avatar"
              className="avatar"
            />
            <h4>{user.name}</h4>
            {data?.from !== user1 && data?.unread && (
              <small className="unread">New</small>
            )}
          </div>
          <div
            className={`user_status ${user.isOnline ? "online" : "offline"}`}
          ></div>
        </div>
        {data && (
          <p className="truncate">
            <strong> {data.from === user1 ? "Me:" : null} </strong>
            {data.text}{" "}
          </p>
        )}
      </div>

      <div
        onClick={() => selectUser(user)}
        className={`ph_container ${
          chat?.name === user.name && "selected_user"
        }`}
      >
        <img
          src={user.avatar || userDefaultPic}
          alt="avatar"
          className="avatar ph_screen"
        />
      </div>
    </>
  );
}

export default User;
