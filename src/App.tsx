import { AppBar, Box, Button, Container, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import ButtonAppBar from "./AppBar";
import axios from 'axios';

function App() {
  const [rows, setRows] = useState<any[]>([]);
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'image', headerName: 'Image', minWidth: 130 },
    { field: 'result', headerName: 'Result', minWidth: 130 },
  ];
  const [project,setProject] = useState("");
  const [existingProjects,setExistingProjects] = useState([{"id":"1","name":"test"}]);
  const loadProjectsInfo = async () => {
    const result = await axios(
      './projects.json',
    );
    setExistingProjects(result.data);
  };

  useEffect(() => {
    loadProjectsInfo();
  });
  
  const showResult = async () => {
    const result = await axios(
      './projects/'+project+'/details.json',
    );
    console.log(result);
    loadRowsFromDetails(result.data);
  };

  const loadRowsFromDetails = (details:any) => {
    var index = 0;
    var mRows = [];
    for (const imageName in details) {
      let image = details[imageName];
      index = index + 1;
      var row:any = {};
      row["id"] = index;
      row["result"] = image["ground_truth"];
      row["image"] = imageName;
      mRows.push(row);
    }
    setRows(mRows);
  }

  const onProjectSelected = (event: any) => {
    setProject(event.target.value);
  };

  return (
    
    <div>
      <ButtonAppBar/>
      <FormControl fullWidth margin="normal">
        <InputLabel id="demo-simple-select-label">Project</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={project}
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
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
        />
      </div>

    </div>
  );
}

export default App;

