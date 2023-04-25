const DEFAULT_PARAMS = {
  // "model": "gpt-4",
  temperature: 1.0,
  stream: true,
};

async function get_stream({ generationMessages, model, apiKey, maxTokens, temperature }) {
  console.log('temperature', temperature)
  const params_ = {
    ...DEFAULT_PARAMS,
    messages: generationMessages,
    model: model,
    max_tokens: maxTokens,
    temperature: temperature
  };
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + String(apiKey),
    },
    body: JSON.stringify(params_),
  };
  return fetch("https://api.openai.com/v1/chat/completions", requestOptions);
}

export default function generateMessage({
  messages,
  setMessages,
  isGenerating,
  setIsGenerating,
  model,
  apiKey,
  maxTokens,
  temperature
}) {
  let cancelGenerationFlag = false;
  let generationMessages = [...messages];
  let reader;

  function cancelGeneration() {
    cancelGenerationFlag = true;
    if (reader) {
      reader.cancel();
    }
  }

  if (isGenerating) {
    cancelGeneration();
    return;
  }

  let newMessages = [...messages, { role: "assistant", content: "" }];
  setMessages(newMessages);

  setIsGenerating(true);
  let stream = get_stream({ generationMessages, model, apiKey, maxTokens, temperature });
  let readable_stream = stream.then((response) => {
    const reader = response.body.getReader();
    return new ReadableStream({
      start(controller) {
        let partial_message = "";
        return pump();
        function pump() {
          return reader.read().then(({ done, value }) => {
            // When no more data needs to be consumed, close the stream
            if (done || cancelGenerationFlag) {
              controller.close();
              setIsGenerating(false);

              return "done";
            }

            let full_str = new TextDecoder("utf-8").decode(value);

            let events = full_str.split("data: ");

            if (events[0] !== "") {
              console.log(
                "error! first element of events should be empty string"
              );
              console.log(events[0]);
              alert("Error generating text-- maybe your API key isn't valid?");
              setIsGenerating(false);
              return;
            }
            events.shift();

            for (let i = 0; i < events.length; i++) {
              let event = events[i].trim();
              if (event === "[DONE]") {
                console.log("[DONE] received");
                break;
              }
              try {
                let parsed_event = JSON.parse(event);

                let delta = parsed_event["choices"][0]["delta"]["content"];

                if (delta === undefined) {
                  continue;
                }

                partial_message = partial_message + delta;

                newMessages = [
                  ...newMessages.slice(0, newMessages.length - 1),
                  {
                    role: newMessages[newMessages.length - 1]["role"],
                    content: partial_message,
                  },
                ];
                setMessages(newMessages);
              } catch (err) {
                console.log(err);
              }
            }

            return pump();
          });
        }
      },
    });
  });

  return cancelGeneration;
}
