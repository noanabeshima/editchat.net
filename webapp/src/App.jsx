import { useState, useEffect } from "react";
import "./App.css";

import Messages from "./Messages";
import SettingsButton from "./SettingsBox";
import APIKeyForm from "./APIKeyForm";

function App() {
  const [model, setModel] = useState("gpt-4");
  const [apiKey, setApiKey] = useState("");
  const [enterToSend, setEnterToSend] = useState(true);

  const [firstTimeLoad, setFirstTimeLoad] = useState(true);

  if (firstTimeLoad) {
    return (
      <div className="App">
        <APIKeyForm
          apiKey={apiKey}
          setApiKey={setApiKey}
          setFirstTimeLoad={setFirstTimeLoad}
        />
      </div>
    );
  } else {
    return (
      <div className="App">
        <SettingsButton
          apiKey={apiKey}
          setApiKey={setApiKey}
          model={model}
          setModel={setModel}
          enterToSend={enterToSend}
          setEnterToSend={setEnterToSend}
        />
        <Messages apiKey={apiKey} model={model} enterToSend={enterToSend} />
      </div>
    );
  }
}

export default App;
