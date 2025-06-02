import React, { useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/InstanceCollab.css";
import phone from "../assets/phone.png";
import { useUser } from "../context/UserContext";

const InstanceCollab = () => {

  const { id: instanceId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const { name } = useUser(); 
    useEffect(() => {
      if (!name) navigate("/auth");
    }, [name, navigate]);

  useEffect(() => {
    const saved = localStorage.getItem(`code-${instanceId}`);
    if (saved) {
      editorRef.current.innerHTML = saved;
    }
  }, [instanceId]);

  const handleInput = () => {
    const lines = editorRef.current.innerText.split("\n");
    const highlighted = lines
      .map((line) => {
        if (line.trim().startsWith("#")) {
          return `<div class="green-line">${escapeHtml(line)}</div>`;
        } else {
          return `<div class="white-line">${escapeHtml(line)}</div>`;
        }
      })
      .join("");
    editorRef.current.innerHTML = highlighted;
    placeCaretAtEnd(editorRef.current);

    // ✅ Add current user to collaborators if not already present
    const instances = JSON.parse(localStorage.getItem("instances")) || [];
    console.log("tansha",instanceId)
    const updatedInstances = instances.map((inst) => {
        
      if (inst.id == instanceId) {
         console.log("yes",instanceId)
        const collabs = inst.collaborators || [];
        console.log("coll",collabs)
        
        if (!collabs.includes(name)) {
          return { ...inst, collaborators: [...collabs, name] };
        }
      }
      return inst;
    });
    localStorage.setItem("instances", JSON.stringify(updatedInstances));
     console.log("tansha 1234",instances)
  };

  const handleSave = () => {
    const content = editorRef.current.innerHTML;
    localStorage.setItem(`code-${instanceId}`, content);
    alert("Instance code saved successfully.");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const br = document.createElement("div");
      br.innerHTML = "<br/>";
      insertNodeAtCaret(br);
      return false;
    }
  };

  const insertNodeAtCaret = (node) => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(node);
    range.setStartAfter(node);
    range.setEndAfter(node);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const placeCaretAtEnd = (el) => {
    el.focus();
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const escapeHtml = (unsafe) =>
    unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  return (
    <div className="collab-container">
      <div className="editor-section">
        <div className="top-bar">
          <div className="project-title">
            Instance ID: {instanceId} <span className="tag">stag</span>
          </div>
          <div className="controls">
            <button className="btn run">Run</button>
            <button className="btn save" onClick={handleSave}>Save Instance</button>
            <button className="btn stop">Stop</button>
            <button className="btn upload">Upload</button>
            <button className="btn save-blue" onClick={handleSave}>Save</button>
            <div className="toggle">
              <span>Continuous Mode</span>
              <input type="checkbox" />
            </div>
            <button className="btn change" onClick={() => navigate("/")}>Change Instance</button>
          </div>
        </div>

        <div
          className="code-area editable"
          contentEditable
          ref={editorRef}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          suppressContentEditableWarning={true}
        >
          <div className="green-line"># Welcome to your new project!</div>
          <div className="green-line"># This is an example test file.</div>
        </div>

        <div className="tabs">
          <button className="tab">Test Status</button>
          <button className="tab active">Log</button>
        </div>

        <div className="log-area">
          <p>[2025-05-31T08:51:22.866Z] <strong>data:</strong> Current instance {instanceId} status: CREATING, waiting...</p>
          <p>[2025-05-31T08:51:33.921Z] <strong>data:</strong> Current instance {instanceId} status: CREATING, waiting...</p>
          <p>[2025-05-31T08:51:44.249Z] <strong>data:</strong> Current instance {instanceId} status: BOOTING, waiting...</p>
          <p>[2025-05-31T08:51:54.913Z] <strong>data:</strong> Current instance {instanceId} status: BOOTING, waiting...</p>
        </div>
      </div>

      <div className="mobile-preview">
        <img src={phone} alt="Mobile Preview" />
      </div>
    </div>
  );
};

export default InstanceCollab;
