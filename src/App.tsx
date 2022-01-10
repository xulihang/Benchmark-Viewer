import { Box, Button, FormControl, InputLabel, MenuItem, Select, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import ButtonAppBar from "./AppBar";
import axios from 'axios';
import "./App.css"
import ScorePie from "./ScorePie";
import NavTabs from "./NavTabs";


function App() {
  const [selectedProject, setSelectedProject] = useState("");
  const [project, setProject] = useState("");
  const [existingProjects,setExistingProjects] = useState([{"id":"1","name":"test"}]);
  var loaded = false;
  const loadProjectsInfo = async () => {
    const result = await axios(
      './projects.json',
    );
    console.log(result.data);
    setExistingProjects(result.data);
  };

  useEffect(() => {
    loadProjectsInfo();
  }, []);

  
  
  const showResult = async () => {
    if (selectedProject == "") {
      alert("Please specify a project first.");
    }
    setProject(selectedProject);
  };

  const onProjectSelected = (event: any) => {
    setSelectedProject(event.target.value);
  };

  return (
    
    <div>
      <ButtonAppBar/>
      <FormControl fullWidth margin="normal">
        <InputLabel id="demo-simple-select-label">Project</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedProject}
          label="Project"
          onChange={onProjectSelected}
        >
          {existingProjects.map(item => (
             <MenuItem value={item["id"]} key={item["id"]} >{item["name"]}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={showResult} color="primary">
        Show Result
      </Button>
      <NavTabs project={project}/>
      
    </div>
  );
}

export default App;

