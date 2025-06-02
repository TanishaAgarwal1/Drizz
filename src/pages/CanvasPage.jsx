import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CanvasPage.css";
import { instances as defaultInstances } from "../data";
import { useUser } from "../context/UserContext";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const CanvasPage = () => {
  const navigate = useNavigate();
  const { name } = useUser();
  const dragItem = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!name) navigate("/auth");
  }, [name, navigate]);

const tUser = JSON.parse(localStorage.getItem("tUser"));
const initialsSeed = tUser?.name || "User"; 
  const [instances, setInstances] = useState(() => {


    const stored = JSON.parse(localStorage.getItem("instances"));
    if (stored) return stored;
    const initialized = defaultInstances.map((item) => ({
      ...item,
      starred: item.starred || false,
    }));
    localStorage.setItem("instances", JSON.stringify(initialized));
    return initialized;
  });

  const [positions, setPositions] = useState(() =>
    defaultInstances.reduce((acc, inst) => {
      acc[inst.id] = { x: 0, y: 0 };
      return acc;
    }, {})
  );

  const [selectedInstance, setSelectedInstance] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    status: "Status",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [deviceDropdownOpen, setDeviceDropdownOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState("All Devices");
const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    if (selectedInstance) {
      setFormValues({
        title: selectedInstance.title || "",
        description: selectedInstance.description || "",
        status: selectedInstance.status || "Status",
      });
    }
  }, [selectedInstance]);

  const handleMouseMove = (e) => {
    if (!dragItem.current) return;
    const id = dragItem.current;
    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;
    setPositions((prev) => ({
      ...prev,
      [id]: { x: newX, y: newY },
    }));
  };

  const handleMouseUp = () => {
    dragItem.current = null;
  };

  const handleMouseDown = (e, id) => {
    dragItem.current = id;
    const rect = e.currentTarget.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleCardClick = (inst) => {
    if (selectedInstance?.id === inst.id) {
      setSelectedInstance({ ...inst });
    } else {
      setSelectedInstance(inst);
    }
    setShowSidebar(true);
  };

  const handleCollabClick = (instanceId) => {
    const user = JSON.parse(localStorage.getItem("tUser"));
    const currentUserEmail = user?.email;

    if (!currentUserEmail) {
      alert("User not logged in!");
      return;
    }

    const isCollaborator =
      selectedInstance?.collaborators &&
      currentUserEmail in selectedInstance.collaborators;

    if (isCollaborator) {
      navigate(`/collab/${instanceId}`);
    } else {
      alert("Please request access before collaborating.");
    }
  };

  const toggleStar = (id) => {
    const updatedInstances = instances.map((inst) =>
      inst.id === id ? { ...inst, starred: !inst.starred } : inst
    );
    setInstances(updatedInstances);
    localStorage.setItem("instances", JSON.stringify(updatedInstances));
  };

  const allDeviceNames = Array.from(new Set(instances.map((i) => i.device)));

  const filteredInstances = instances.filter((inst) => {
    const matchesSearch = `${inst.title} | ${inst.device}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDevice =
      selectedDevice === "All Devices" || inst.device === selectedDevice;

    if (filter === "starred") {
      return matchesSearch && inst.starred && matchesDevice;
    }

    return matchesSearch && matchesDevice;
  });

  const handleLogout = () => {
    localStorage.removeItem("tUser");
    navigate("/auth");
  };

  return (
    <>
    

      <div
        className="canvas-page"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        
        {selectedInstance && showSidebar && (
          <div className="sidebar">
            <button
              className="close-sidebar-buttn"
              onClick={() => setShowSidebar(false)}
            >
              ×
            </button>
            <h2>Testing Details</h2>
           <h5>Company</h5>
<p className="sidebar-input">{formValues.title}</p>

<h5>Description</h5>
<p className="sidebar-text">{formValues.description}</p>

            <select
              value={formValues.status}
              onChange={(e) =>
                setFormValues({ ...formValues, status: e.target.value })
              }
            >
              <option>Status</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Completed</option>
            </select>
            <p>Collaborators</p>
            <div className="collaborators-list">
              {selectedInstance.collaborators &&
                Object.entries(selectedInstance.collaborators).map(
                  ([email, name], i) => (
                    <div className="collaborator" key={i} data-name={name}>
                      <img
                        src={`https://i.pravatar.cc/30?img=${i + 7}`}
                        alt={name}
                        title={`${name} (${email})`}
                      />
                    </div>
                  )
                )}
            </div>
            <button
              className="buttn request-buttn"
              onClick={(e) => {
                e.stopPropagation();
                handleCollabClick(selectedInstance.id);
              }}
            >
              Collab
            </button>
            <button className="buttn enter-buttn">Request Access</button>
          </div>
        )}

        <div
          className="main-content"
          style={{
            width:
              selectedInstance && showSidebar ? "calc(100% - 340px)" : "100%",
          }}
        >
          <div className="top-bar">
 <input
            type="text"
            className="search-input"
            placeholder="Search by project name or type"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

 <div className="profile-dropdown">
  <img
  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(initialsSeed)}&backgroundColor=0D8ABC&fontSize=40`}
  alt="Profile"
  className="profile-icon"
  onClick={() => {
    setDeviceDropdownOpen(false);
    setShowProfileDropdown((prev) => !prev);
  }}
/>

  {showProfileDropdown && (
    <div className="profile-menu">
      <button onClick={handleLogout}>Logout</button>
    </div>
  )}
</div>

</div>

         

          <div className="filters">
            <button
              onClick={() => setFilter("all")}
              className={filter === "all" ? "active-filter" : ""}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter("starred")}
              className={filter === "starred" ? "active-filter" : ""}
            >
              Starred
            </button>

            <div className="device-filter">
              <button
                onClick={() => setDeviceDropdownOpen((prev) => !prev)}
                className="device-dropdown-toggle"
              >
                {selectedDevice} <span>{deviceDropdownOpen ? "▲" : "▼"}</span>
              </button>

              {deviceDropdownOpen && (
                <div className="device-dropdown">
                  <div
                    className={`device-option ${
                      selectedDevice === "All Devices" ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedDevice("All Devices");
                      setDeviceDropdownOpen(false);
                    }}
                  >
                    All Devices
                  </div>
                  {allDeviceNames.map((device) => (
                    <div
                      key={device}
                      className={`device-option ${
                        selectedDevice === device ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedDevice(device);
                        setDeviceDropdownOpen(false);
                      }}
                    >
                      {device}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="instance-list">
            {filteredInstances.map((inst) => (
              <div
                key={inst.id}
                className="instance-card"
                onMouseDown={(e) => handleMouseDown(e, inst.id)}
                onClick={() => handleCardClick(inst)}
                style={{
                  left: positions[inst.id]?.x,
                  top: positions[inst.id]?.y,
                }}
              >
                <div
                  className="star-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStar(inst.id);
                  }}
                  title="Star this instance"
                >
                  {inst.starred ? (
                    <AiFillStar size={20} color="#f5c518" />
                  ) : (
                    <AiOutlineStar size={20} color="#888" />
                  )}
                </div>

                <img src={inst.image} alt={inst.title} />
                <p className="title">
                  {inst.title} | {inst.device}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CanvasPage;
