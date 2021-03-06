import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState } from 'react';
import DataTable from './DataTable';
import Charts from './Charts';
import ImageViewer from './ImageViewer';
import { Modal } from '@mui/material';
import "./modalBox.css"

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
  const [imagename, setImagename] = useState("");
  const [groundTruth, setGroundTruth] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    setProject(props.project);
  }, [props.project]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleClick = (event:any) => {
    console.log(event.target);
    console.log(event.target.innerText);
    setGroundTruth(event.target.getAttribute("ground-truth"));
    setImagename(event.target.innerText);
    setOpen(true)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Details" {...a11yProps(0)} />
          <Tab label="Charts" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <DataTable project={project} handleClick={handleClick}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Charts project={project}/>
      </TabPanel>
      <Modal open={open} onClose={handleClose}>
        <Box id="modalBox">
          <ImageViewer project={project} imagename={imagename} groundTruth={groundTruth}/>
        </Box>
      </Modal>
    </Box>
  );
}