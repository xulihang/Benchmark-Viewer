import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import ButtonAppBar from "./AppBar";
import axios from 'axios';
import "./App.css"

function App() {
  const [rows, setRows] = useState<any[]>([]);
  const [engines, setEngines] = useState<any[]>([]);
  const [project, setProject] = useState("");
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

  const getImageURLFromName = (name:String) => {
    return './projects/' + project + '/' + name;
  }

  const getEngineScoreOfImage = (engine:string, engines:any) => {
    var score = engines[engine]["score"]; 
    score = score.toFixed(2);
    return score;
  }

  const loadEnginesFromImage = (image:any) => {
    let enginesDict = image.engines;
    var mEngines:String[] = [];
    for (const engine in enginesDict) {
      mEngines.push(engine);
    }
    setEngines(mEngines);
  }

  const getEnginesResultsOfImage = (image:any) => {
    let enginesDict = image.engines;
    var result = "";
    for (const engine in enginesDict) {
      let engineData = enginesDict[engine];
      result = result + engineData.ocr_result;
    }
    return result;
  }

  const loadRowsFromDetails = (details:any) => {
    var index = 0;
    var mRows = [];
    setEngines([]);
    for (const imageName in details) {
      index = index + 1;
      let image = details[imageName];
      var row:any = {};
      row["id"] = index;
      row["image"] = imageName;
      row["ground_truth"] = image["ground_truth"];
      row["result"] = getEnginesResultsOfImage(image);
      row["engines"] = image["engines"];
      //console.log(image);
      if (index == 1){
        loadEnginesFromImage(image);
      }
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
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Ground Truth</th>
            <th>Result</th>
            {engines.map(engine => (
             <th>{engine}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>
                <a href={getImageURLFromName(row.image)} target="_blank" >{row.image}</a>
              </td>
              <td>
                {row.ground_truth}
              </td>
              <td>
                {row.result}
              </td>
              {engines.map(engine => (
                <th>{getEngineScoreOfImage(engine, row.engines)}</th>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

