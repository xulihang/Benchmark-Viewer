const parser = require("mrz-parser-js");

const keys=["doc_type","country","surname","names","date_of_birth","sex","expiration_date","personal_number"];


export default function MRZTable(props:any) {
    
    const getLinesFromOCRResult = (OCRResult:string) => {
        let rawLines = OCRResult.trim().split("\n");
        if (rawLines.length == 0){
            rawLines=['',''];
        }else if (rawLines.length == 1){
            rawLines.push('');
        }
        if (rawLines.length>2){
            rawLines=rawLines.slice(rawLines.length-2,rawLines.length);
        }
        return rawLines;
    }
    let lines = getLinesFromOCRResult(props.OCRResult);
    const parsedResults = parser.parse(lines[0],lines[1]);

    const getResult = (key:string) => {
        return parsedResults[key];
    }

    return ( 
        <table>
            <thead>
                <tr>
                {keys.map(key => (
                    <th>{key}</th>
                ))}
                </tr>
            </thead>
            <tbody>
                <tr>
                {keys.map(key => (
                    <th>{getResult(key)}</th>
                ))} 
                </tr>
            </tbody>
        </table>
      );
}