import { FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, chipClasses } from "@mui/material";
import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import CharsDiff from "./CharsDiff";
import MRZTable from "./MRZTable";

let scale:number = 1;

export default function ImageViewer(props:any) {
  const [engines, setEngines] = useState<any[]>([]);
  const [raw, setRaw] = useState<boolean>(false);
  const [selectedEngine, setSelectedEngine] = useState<string>("");
  const [imagename, setImagename] = useState<string>("");
  const [width, setWidth] = useState<number>(480);
  const [height, setHeight] = useState<number>(480);
  const [groundTruth, setGroundTruth] = useState<string>("");
  const [ocrResult, setOcrResult] = useState<string>("");
  const canvasRef = React.useRef(null)
  const overlayCanvasRef = React.useRef(null)

  useEffect(() => {
    loadEngines();
    if (!!props.imagename){
      setImagename(props.imagename);
      setGroundTruth(props.groundTruth);
      drawImage();
    }
    
  }, [props.project,props.imagename]);

  const getImageURLFromName = (name:String) => {
    return './projects/' + props.project + '/' + name;
  }

  const loadEngines = async () => {
    if (!!props.project){
      const result = await axios(
        './projects/'+props.project+'/statistics.json',
      );
      let enginesArray = []
      for (let engine in result.data){
          enginesArray.push(engine);
      }
      setEngines(enginesArray);
    }
  }

  const onEngineSelected = (event:any) => {
    let engine = event.target.value;
    setSelectedEngine(engine);
    showResult(engine,raw);
    
  }

  const drawImage = () => {
    const canvas:any = canvasRef.current;
    const ctx = canvas.getContext('2d');
    var imageObj1 = new Image();
    imageObj1.onload = function() {
      console.log(imageObj1);
      let ratio = imageObj1.naturalWidth/imageObj1.naturalHeight;
      let new_height = width/ratio
      scale = 480/imageObj1.naturalWidth;
      setHeight(new_height);
      ctx.drawImage(imageObj1,0,0,480,new_height);
    }
    let url = getImageURLFromName(props.imagename)
    console.log(url);
    imageObj1.src = url;
  }

  const drawOverlays = (boxes:any[]) => {
    const canvas:any = overlayCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    console.log("scale: "+scale);
    for (var i=0;i<boxes.length;i++){
      let box = boxes[i];
      ctx.beginPath();
      ctx.moveTo(box.x1*scale,box.y1*scale);
      ctx.lineTo(box.x2*scale,box.y2*scale);
      ctx.lineTo(box.x3*scale,box.y3*scale);
      ctx.lineTo(box.x4*scale,box.y4*scale);
      ctx.lineTo(box.x1*scale,box.y1*scale);
      ctx.closePath();
      ctx.strokeStyle = '#ff0000';
      ctx.stroke();
    }
  }

  const getFilenameWithoutExtenstion = () => {
    return imagename.substring(0,imagename.lastIndexOf("."));
  }
  
  const onRawChecked = (event:any) => {
    setRaw(event.target.checked);
    showResult(selectedEngine,event.target.checked);
  }

  const showResult = async (engine:string, raw:boolean) => {
    if (!props.imagename){
      return;
    }
    const result = await axios(
      './projects/'+props.project+'/'+getFilenameWithoutExtenstion()+'-'+engine+'.json',
    );
    let boxes;
    if (raw == true){
      if ("raw_boxes" in result.data){
        boxes=result.data.raw_boxes;
      }else{
        boxes=result.data.boxes;
      }
    } else {
      boxes=result.data.boxes;
    }

    console.log(boxes);
    drawOverlays(boxes);
    let resultString = "";
    for (var i=0;i<boxes.length;i++){
        resultString = resultString + boxes[i].text + "\n";
    }
    setOcrResult(resultString);
  }

  return (
      <div>
        <FormControlLabel control={<Checkbox checked={raw} onChange={onRawChecked}/>} label="Raw" />
        <FormControl fullWidth margin="normal">
          <InputLabel id="demo-simple-select-label">Engine</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedEngine}
            label="Engine"
            onChange={onEngineSelected}
          >
            {engines.map(item => (
              <MenuItem value={item} key={item} >{item}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <div>
          <div style={{height:height}}>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{position:"absolute"}}
              />
            <canvas
                ref={overlayCanvasRef}
                width={width}
                height={height}
                style={{position:"absolute"}}
                id="overlay-canvas"
              />
          </div>
          <div>
            <div style={{fontSize:"large"}}>
              <p>Ground Truth:</p>
              <pre>{groundTruth}</pre>
              <p>Diff</p>
              <CharsDiff str1={groundTruth} str2={ocrResult}/>
              <p>OCR Result:</p>
              <pre>{ocrResult}</pre>
            </div>
            <div>
              <h2>Parsed</h2>
              <MRZTable OCRResult={ocrResult}/>
            </div>
          </div>
        </div>
      </div>
  )
}