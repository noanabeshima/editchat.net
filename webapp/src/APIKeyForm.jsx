import { useState, useEffect } from "react";
import "./APIKeyForm.css";
import "./styles.css";

export default function APIKeyForm({ apiKey, setApiKey, setFirstTimeLoad }) {
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setFirstTimeLoad(false);
    }
  };

  return (
    <div className="APIKeyContainer">
      <div className="flex-filler" />
      <div className="APIKeyForm">
        <div className="APIKeyLabel">Please enter your OpenAI API Key:</div>

        <label>
          <input
            className="APIKeyInput assistant"
            type="text"
            value={apiKey}
            placeholder="sk-xxxxxxxxxxxxxx"
            onKeyDown={onKeyDown}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </label>

        <div className="APIKeyLabel">
          They can be created{" "}
          <a
            href="https://platform.openai.com/account/api-keys"
            target="_blank"
          >
            here
          </a>
          .
        </div>
      </div>
      <div className="flex-filler" />
    </div>
  );
}
