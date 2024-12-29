// import { Avatar } from "@chakra-ui/avatar";
// import { Tooltip } from "@chakra-ui/tooltip";
// import { FixedSizeList as List } from "react-window";
// import { ChatState } from "../Context/ChatProvider";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../context/ChatLogic";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import ScrollableFeed from "react-scrollable-feed";

const ScrollableChat = ({ messages }) => {
  const { user } = useContext(AppContext);

  

  return (
    <ScrollableFeed className="px-4 py-2">
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <a
                data-tooltip-id="my-tooltip"
                data-tooltip-content={m.sender.name}
                className="h-fit w-fit"
              >
                <div
                  className="mt-[7px] mr-1 w-8 h-8 cursor-pointer rounded-full overflow-hidden"
                  title="Sender Name"
                >
                  <img
                    src={m.sender.pic}
                    alt="Sender Name"
                    className="object-cover w-full h-full"
                  />
                </div>
              </a>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
