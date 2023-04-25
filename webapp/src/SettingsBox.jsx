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
  maxTokens,
  setMaxTokens,
  temperature,
  setTemperature
}) {
  let modelOptions = ["gpt-3.5-turbo", "gpt-4"];

  useEffect(() => {
    console.log(temperature)
  }, [temperature])
  

  return (
    <div className={`settingsBox ${visible ? "open" : ""}`} tabIndex={-1}>
      <div className="settingsLabel">API Key</div>
      <textarea
        tabIndex={-1}
        className="settingsItem apiKeyBox user"
        value={apiKey}
        placeholder="Your API Key"
        onChange={(e) => setApiKey(e.target.value)}
      />
      <div className="settingsLabel">Model</div>
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
      <div className="settingsLabel">Max Tokens</div>
      <div className="settingsItem enterToSend user noselect">
        <div style={{flexbox: "row"}}>
          <div>
            <label>
              <input
                className="settingsItem maxTokensBox user"
                style={{borderRadius: "5px", marginBottom: "0rem"}}
                tabIndex={-1}
                type="number"
                max={8192}
                value={maxTokens}
                onChange={(e) => setMaxTokens(e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>


      <div className="settingsLabel">Temperature</div>
      <div className="settingsItem enterToSend user noselect">
        <label style={{width: "100%", display: "flex"}}>
          <input className=" user settingsItem temperatureBox" type="number" min={0} max={1} step={0.01} value={temperature} onChange={(e) => setTemperature(e.target.value)}
          style={{}}></input>
          <div style={{flex: 1}}>
          <input
            className="settingsItem slider user"
            style={{marginBottom: "0rem", width: "100%"}}
            tabIndex={-1}
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
          />
          </div>
        </label>
      </div>

      <div className="settingsLabel">CMD+Enter to generate</div>
      <div className="settingsItem enterToSend user noselect">
        <label>
          <input
            tabIndex={-1}
            type="checkbox"
            checked={!enterToSend}
            onChange={(e) => setEnterToSend(!e.target.checked)}
          />
          <span className="checkmark"></span>
          <span /> 
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
  maxTokens,
  setMaxTokens,
  temperature,
  setTemperature
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
          maxTokens={maxTokens}
          setMaxTokens={setMaxTokens}
          temperature={temperature}
          setTemperature={setTemperature}
        />
      }
    </>
  );
}

export default SettingsButton;
