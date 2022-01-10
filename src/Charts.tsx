import ScorePie from "./ScorePie";

export default function Charts(props:any){
  return (
    <div style={{display:"flex"}}>
      <ScorePie chartId="Score" score={50} style={{ height: '300px', width: '50%' }}/>
      <ScorePie chartId="Score" score={50} style={{ height: '300px', width: '50%' }}/>
    </div>
  )
}

