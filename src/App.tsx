import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import ButtonAppBar from "./AppBar";
import axios from 'axios';
import "./App.css"
const Diff = require("diff");

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
  
  const getDiffElement = (ocr_result:string,ground_truth:string) => {
    var container = document.createElement("div");
    let diff = Diff.diffChars(ground_truth, ocr_result);
    diff.forEach((part:any) => {
      // green for additions, red for deletions
      // grey for common parts
      const color = part.added ? 'green' :
        part.removed ? 'red' : 'black';
      var span = document.createElement('span');
      span.style.color = color;
      span.appendChild(document
        .createTextNode(part.value));
      container.appendChild(span);
    });
    return container;
  }


  const getEnginesDiffOfImage = (image:any,ground_truth:string) => {
    let enginesDict = image.engines;
    var container = document.createElement("div");  
    for (const engine in enginesDict) {
      let engineData = enginesDict[engine];
      var span = document.createElement("span");
      span.innerText = engine+": ";
      container.appendChild(span);
      container.appendChild(getDiffElement(engineData["ocr_result"],ground_truth));
    }
    return container.outerHTML;
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
      row["diffs"] = getEnginesDiffOfImage(image, image["ground_truth"]);
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
              <div
                dangerouslySetInnerHTML={{__html: row.diffs }} />
              </td>
              {engines.map(engine => (
                <td>{getEngineScoreOfImage(engine, row.engines)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

