import React from "react";
import { useState } from "react";

export default function DataTable(props:any){
    const [rows, setRows] = useState<any[]>([]);
    const [engines, setEngines] = useState<any[]>([]);
    React.useEffect(() => {
        setRows(props.rows);
        setEngines(props.engines);
      }, [props.rows,props.engines]);

    const getImageURLFromName = (name:String) => {
        return './projects/' + props.project + '/' + name;
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
    )
}