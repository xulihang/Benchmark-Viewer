import React from "react";
import { useState } from "react";
import axios from 'axios';
const Diff = require("diff");

export default function DataTable(props:any){
    const [rows, setRows] = useState<any[]>([]);
    const [engines, setEngines] = useState<any[]>([]);
    const imageViewer = props.imageViewer;

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
            span.innerHTML = "<strong>"+engine+": <strong/>";
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
    
    const getEngineScoreOfImage = (engine:string, engines:any) => {
        var score = engines[engine]["score"]; 
        score = score.toFixed(2);
        return score;
    }

    return(
        <div>
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
                    <div ground-truth={row.ground_truth} style={{textDecoration:"underline",cursor:"pointer"}} onClick={props.handleClick}>{row.image}</div>
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
    )
}