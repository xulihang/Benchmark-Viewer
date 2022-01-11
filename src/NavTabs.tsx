import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState } from 'react';
import DataTable from './DataTable';
import Charts from './Charts';
import ImageViewer from './ImageViewer';


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
  const [project, setProject] = useState("");

  React.useEffect(() => {
    setProject(props.project);
  }, [props.project]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Details" {...a11yProps(0)} />
          <Tab label="Charts" {...a11yProps(1)} />
          <Tab label="Image" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <DataTable project={project}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Charts project={project}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ImageViewer/>
      </TabPanel>
    </Box>
  );
}