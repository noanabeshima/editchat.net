import { useState, useEffect, useRef, useLayoutEffect } from "react";
import "./Messages.css";
import "./styles.css";
import generateMessage from "./generateMessage.jsx";
import TextAreaAutosize from "react-textarea-autosize";

function roleText(role) {
  return role === "user"
    ? "You"
    : role === "assistant"
    ? "Assistant"
    : "System";
}

let StopGenerationButton = ({
  isGenerating,
  cancelGenerationWrapper,
  noMessages,
}) => {
  const onClick = isGenerating ? () => cancelGenerationWrapper.fn() : undefined;
  const isHidden = noMessages || !isGenerating;
  const stopGenerationClass = `stopGenerationButton system${
    isHidden ? "" : " visible"
  }`;

  return (
    <div className={stopGenerationClass} onClick={onClick}>
      Stop generation
    </div>
  );
};

function Role({ role, setRole }) {
  const handleClick = (event) => {
    if (event.ctrlKey || event.metaKey) {
      setRole(role === "system" ? "user" : "system");
    } else {
      setRole(role === "user" ? "assistant" : "user");
    }
  };

  return (
    <div className={`message-role ${role} no-select`} onClick={handleClick}>
      {roleText(role)}
    </div>
  );
}

function EditableMessage({
  children,
  setContent,
  deleteMessage,
  createMessageBelow,
  generate,
  role,
  focus,
  resetFocus,
  cursorPos,
  isGenerating,
  cancelGenerationWrapper,
  setScrollToBottom,
  enterToSend,
}) {
  // Get content between <EditableMessage> and </EditableMessage>
  const content = children;

  const textareaRef = useRef(null);

  useEffect(() => {
    if (focus) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(cursorPos, cursorPos);
      resetFocus();
    }
  }, [focus, cursorPos]);

  // onHeightChange is a callback that is called when the height of the textarea changes
  // it is used to update the height of the message
  let onHeightChange = () => {
    // if near bottom of screen, scroll down
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 90
    ) {
      setScrollToBottom(true);
    }
  };

  let handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.ctrlKey || e.metaKey) {
        generate();
        e.preventDefault();
        return;
      }
      if (!e.shiftKey) {
        e.preventDefault();
        if (enterToSend) {
          generate();
          return;
        } else {
          let cursorIndex = e.target.selectionStart;
          let text = content;
          setContent(text.slice(0, cursorIndex));

          createMessageBelow(text.slice(cursorIndex));
          return;
        }
      }
    }
    if (e.key === "Backspace") {
      let cursorStart = e.target.selectionStart;
      let cursorEnd = e.target.selectionEnd;
      if (cursorStart === cursorEnd && cursorStart === 0) {
        e.preventDefault();
        deleteMessage();
      }
    }
    // check for esc
    if (e.key === "Escape") {
      if (isGenerating) {
        cancelGenerationWrapper.fn();
      }
    }
    return;
  };

  return (
    <TextAreaAutosize
      className={`message-editable message-content ${role}`}
      value={content}
      onKeyDown={handleKeyDown}
      onHeightChange={onHeightChange}
      onChange={(event) => {
        setContent(event.target.value);
      }}
      ref={textareaRef}
    />
  );
}

export default function Messages({ model, apiKey, enterToSend }) {
  const [messages, setMessages] = useState([{ role: "user", content: "" }]);
  const [focusIndex, setFocusIndex] = useState(-1);
  const [cursorPos, setCursorPos] = useState(-1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cancelGenerationWrapper, setCancelGenerationWrapper] = useState({
    fn: () => {},
  });
  const [scrollToBottom, setScrollToBottom] = useState(false);

  useEffect(() => {
    if (isGenerating) {
      setScrollToBottom(true);
    }

    if (!isGenerating) {
      if (messages.length <= 1) {
        setFocusIndex(0);
      } else {
        setFocusIndex(messages.length);
        setCursorPos(0);
        setMessages([...messages, { role: "user", content: "" }]);
        setScrollToBottom(true);
      }
    }
  }, [isGenerating]);

  useLayoutEffect(() => {
    if (scrollToBottom) {
      window.scrollTo(0, document.body.scrollHeight);
      setScrollToBottom(false);
    }
  }, [scrollToBottom]);

  function generateFromNewMessages({ newMessages }) {
    setFocusIndex(newMessages.length);
    if (isGenerating) {
      // cancel previous generation
      cancelGenerationWrapper.fn();
      return;
    }
    let cancelGeneration = generateMessage({
      messages: newMessages,
      setMessages: setMessages,
      isGenerating: isGenerating,
      setIsGenerating: setIsGenerating,
      model: model,
      apiKey: apiKey,
    });
    setCancelGenerationWrapper({ fn: cancelGeneration });
    setScrollToBottom(true);
    return;
  }

  function getGenerationFnFromIndex(index) {
    return () => {
      let newMessages = [...messages];
      newMessages = newMessages.slice(0, index + 1);
      generateFromNewMessages({ newMessages });
    };
  }

  function getSetMessageContentFromIndex(index) {
    return (newText) => {
      let newMessages = [...messages];
      newMessages[index]["content"] = newText;
      setMessages(newMessages);
    };
  }

  function getSetRoleFromIndex(index) {
    return (role) => {
      let newMessages = [...messages];
      newMessages[index]["role"] = role;
      setMessages(newMessages);
    };
  }

  function getCreateMessageBelowFromIndex(index) {
    return (content) => {
      let newMessages = [...messages];
      let role = "user";
      newMessages.splice(index + 1, 0, { role: role, content: content });
      setCursorPos(0);
      setFocusIndex(index + 1);
      setMessages(newMessages);
    };
  }

  function getDeleteMessageFromIndex(index) {
    return () => {
      if (index > 0) {
        let newMessages = [...messages];
        let content = newMessages[index]["content"];
        setCursorPos(messages[index - 1]["content"].length);
        newMessages[index - 1]["content"] += content;
        newMessages.splice(index, 1);
        setMessages(newMessages);
        setFocusIndex(index - 1);
      }
    };
  }

  function resetFocus() {
    setFocusIndex(-1);
  }

  return (
    <>
      <div className="flexbox-column-container">
        <div className="messages-container">
          {messages.map((message, index) => {
            return (
              <div className={`message ${message["role"]}`} key={index}>
                <Role
                  role={message["role"]}
                  setRole={getSetRoleFromIndex(index)}
                />
                <EditableMessage
                  role={message["role"]}
                  startText={message["content"]}
                  setContent={getSetMessageContentFromIndex(index)}
                  deleteMessage={getDeleteMessageFromIndex(index)}
                  createMessageBelow={getCreateMessageBelowFromIndex(index)}
                  generate={getGenerationFnFromIndex(index)}
                  focus={index == focusIndex}
                  resetFocus={resetFocus}
                  cursorPos={cursorPos}
                  isGenerating={isGenerating}
                  cancelGenerationWrapper={cancelGenerationWrapper}
                  setScrollToBottom={setScrollToBottom}
                  enterToSend={enterToSend}
                >
                  {message["content"]}
                </EditableMessage>
              </div>
            );
          })}
        </div>
        <div className="flex-filler" />
      </div>
      <StopGenerationButton
        isGenerating={isGenerating}
        cancelGenerationWrapper={cancelGenerationWrapper}
        noMessages={messages.length == 0}
      />
    </>
  );
}
