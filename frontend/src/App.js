import React, { useState } from "react";
import axios from "axios";

function App() {
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("text");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/generate/", {
        prompt,
        content_type: contentType,
      });

      setOutput(response.data);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Multimodal Content Generator</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter your prompt:
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Choose content type:
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="music">Music</option>
          </select>
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {output && (
        <div className="output">
          <h2>Generated Content</h2>
          {contentType === "text" && <p>{output.output}</p>}
          {contentType === "image" && (
            <img
              src={`http://localhost:8000${output.image_path}`}
              alt="Generated"
            />
          )}
          {contentType === "music" && (
            <audio controls>
              <source
                src={`http://localhost:8000${output.music_path}`}
                type="audio/midi"
              />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
