import { useState, useEffect } from "react";
import "./SettingsBox.css";
import "./styles.css";
import settingsIcon from "./assets/settings1.png";

function SettingsBox({
  visible,
  apiKey,
  setApiKey,
  model,
  setModel,
  setEnterToSend,
  enterToSend,
}) {
  let modelOptions = ["gpt-3.5-turbo", "gpt-4"];

  console.log("enterToSend: ", enterToSend);
  return (
    <div className={`settingsBox ${visible ? "open" : ""}`} tabIndex={-1}>
      <textarea
        tabIndex={-1}
        className="settingsItem apiKeyBox user"
        value={apiKey}
        placeholder="Your API Key"
        onChange={(e) => setApiKey(e.target.value)}
      />
      <select
        tabIndex={-1}
        className="settingsItem selectModel user"
        value={model}
        onChange={(e) => setModel(e.target.value)}
      >
        {modelOptions.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="settingsItem enterToSend user noselect">
        <label>
          <input
            tabIndex={-1}
            type="checkbox"
            checked={!enterToSend}
            onChange={(e) => setEnterToSend(!e.target.checked)}
          />
          <span className="checkmark"></span>
          {/* <div> */}
          <span /> Use CMD+Enter instead of Enter to send
          {/* </div> */}
        </label>
      </div>

      <div className="settingsItem system">
        <ul
          style={{
            fontSize: "1.1rem",
            paddingLeft: "0.45rem",
            marginTop: "0rem",
            marginBottom: "0rem",
          }}
        >
          <li>
            You can generate from a message that isn't the last message by
            clicking on earlier messages.
          </li>
          <li>Use CMD+Del to delete lines quickly</li>
          <li>Click on 'You' or 'Assistant' to swap the role.</li>
          <li style={{ marginBottom: 0 }}>
            You can also CMD+click on a role to create System messages.
          </li>
        </ul>
      </div>
      {/* </div> */}
    </div>
  );
}

function SettingsButton({
  apiKey,
  setApiKey,
  model,
  setModel,
  enterToSend,
  setEnterToSend,
}) {
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <>
      <img
        className="settingsButton"
        src={settingsIcon}
        alt="settings"
        onClick={() => {
          setSettingsVisible(!settingsVisible);
        }}
      />
      {
        <SettingsBox
          visible={settingsVisible}
          apiKey={apiKey}
          setApiKey={setApiKey}
          model={model}
          setModel={setModel}
          setEnterToSend={setEnterToSend}
          enterToSend={enterToSend}
        />
      }
    </>
  );
}

export default SettingsButton;
