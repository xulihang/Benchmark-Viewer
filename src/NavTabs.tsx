import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useState } from 'react';
import axios from 'axios';
import DataTable from './DataTable';
const Diff = require("diff");

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function NavTabs(props:any) {
  const [value, setValue] = useState(0);
  const [rows, setRows] = useState<any[]>([]);
  const [engines, setEngines] = useState<any[]>([]);

  React.useEffect(() => {
    console.log(props.project)
    loadDetails();
  }, [props.project]);

  const loadDetails = async ()=> {
    if (!!props.project){
      const result = await axios(
        './projects/'+props.project+'/details.json',
      );
      loadRowsFromDetails(result.data);
    }
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


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Details" {...a11yProps(0)} />
          <Tab label="Charts" {...a11yProps(1)} />
          <Tab label="Reader" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <DataTable engines={engines} rows={rows}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </Box>
  );
}