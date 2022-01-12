const Diff = require("diff");

export default function CharsDiff(props:any) {
    const diff = Diff.diffChars(props.str1, props.str2);

    return ( 
        <pre>
            {
                diff.map((part:any) => {
                    const color = part.added ? "green" : part.removed ? "red" : "black";
                    return <span style={{ color }}>{part.value}</span>;
                })
            }
        </pre>
      );
}