import axios from "axios";
import React, { useEffect, useState } from "react";
import LineBar from "./LineBar";
import ScorePie from "./ScorePie";

export default function Charts(props:any){
  const [engines, setEngines] = useState<any[]>([]);
  useEffect(() => {
    console.log(props.project)
    loadStatistics();
  }, [props.project]);

  const loadStatistics = async ()=> {
    if (!!props.project){
      const result = await axios(
        './projects/'+props.project+'/statistics.json',
      );
      console.log(result.data);
      let enginesArray = []
      for (let engine in result.data){
          let engineDict = result.data[engine];
          engineDict["name"] = engine;
          engineDict["score"] = (engineDict["score"]*100).toFixed(2);
          engineDict["exact_rate"] = (engineDict["exact_rate"]*100).toFixed(2);
          engineDict["average_time"] = parseInt(engineDict["average_time"]);
          enginesArray.push(engineDict);
      }
      console.log(enginesArray);
      setEngines(enginesArray);
    }
  }

  return (
    <div>
        <div>
          <LineBar dataKey="score" enginesArray={engines} />
        </div>
        <div>
          <LineBar dataKey="exact_rate" enginesArray={engines} />
        </div>
        <div>
          <LineBar dataKey="average_time" enginesArray={engines} />
        </div>
        <div>
          <h2>Score</h2>
          {engines.map(engine => (
            <div>{engine.name}:
              <div style={{display:"flex"}}>
                <ScorePie chartId="Score" score={engine.score} style={{ height: '300px', width: '50%' }}/>
              </div>
            </div>
          ))}
          <h2>Exact Rate</h2>
          {engines.map(engine => (
            <div>{engine.name}:
              <div style={{display:"flex"}}>
                <ScorePie chartId="Exact Rate" score={engine.exact_rate} style={{ height: '300px', width: '50%' }}/>
              </div>
            </div>
          ))}
        </div>
        
    </div>
  )
}


