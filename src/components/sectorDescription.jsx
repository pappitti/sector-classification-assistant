import {useEffect, useState} from 'react';

function Sector({selectedOutput, output}) {
    const [level, setLevel] = useState(4);
    useEffect(()=>{setLevel(4)},[selectedOutput])
    
    function handleToggle(item){
        if (item===level) {
            setLevel(4)
        } else {
            setLevel(item)
        }
    }
    
    return (
        <div className="flex flex-wrap justify-start px-2">
            <div className="w-full flex flex-nowrap justify-between items-center">
                <div className="text-start text-2xl">{output[selectedOutput]["levels"]["level1"]}</div>
                <div 
                    className="text-end text-sm mx-3 cursor-pointer font-semibold text-[rgb(var(--pitti-color))] min-w-[40px]" 
                    onClick={()=>handleToggle(1)}
                >
                    {level===1?"reduce":"more level1"}
                </div>
            </div>
            {level===1 && <div className="w-full max-h-[70vh] overflow-y-auto mt-2 border-2 border-transparent border-t-[rgb(var(--pitti-color))]" >
                {output
                    .map((item, index)=>item["levels"]["level1"]===output[selectedOutput]["levels"]["level1"]?index:null)
                    .filter(item=>item!==null)
                    .slice(0,10)
                    .map(item=> <SectorDescription 
                        key={`level1${item}`} 
                        selectedOutput={item} 
                        output={output} 
                        origin={selectedOutput} 
                        level={1}
                    />)}
                </div>}
            <div className="w-full flex flex-nowrap justify-between pl-2 items-center">
                <div className="text-start text-xl">
                    {output[selectedOutput]["levels"]["level2"]}
                </div>
                <div 
                    className="text-end text-sm mx-3 cursor-pointer font-semibold text-[rgb(var(--pitti-color))] min-w-[40px]" 
                    onClick={()=>handleToggle(2)}>
                        {level===2?"reduce":"more level2"}
                </div>
            </div>
            {level===2 && <div className="w-full max-h-[70vh] overflow-y-auto mt-2 border-2 border-transparent border-t-[rgb(var(--pitti-color))]" >
                {output
                    .map((item, index)=>item["levels"]["level2"]===output[selectedOutput]["levels"]["level2"]?index:null)
                    .filter(item=>item!==null)
                    .slice(0,10)
                    .map(item=> <SectorDescription 
                        key={`level2${item}`} 
                        selectedOutput={item} 
                        output={output} 
                        origin={selectedOutput} 
                        level={2}
                    />)}
                </div>}
            <div className="w-full flex flex-nowrap justify-between pl-4 items-center">
                <div className="text-start text-lg">{output[selectedOutput]["levels"]["level3"]}</div>
                <div className="text-end text-sm mx-3 cursor-pointer font-semibold text-[rgb(var(--pitti-color))] min-w-[40px]" onClick={()=>handleToggle(3)}>
                    {level===3?"reduce":"more level3"}
                </div>
            </div>
            {level===3 && <div className="w-full max-h-[70vh] overflow-y-auto mt-2 border-2 border-transparent border-t-[rgb(var(--pitti-color))]" >
                {output
                    .map((item, index)=>item["levels"]["level3"]===output[selectedOutput]["levels"]["level3"]?index:null)
                    .filter(item=>item!==null)
                    .slice(0,10)
                    .map(item=> <SectorDescription 
                        key={`level3${item}`} 
                        selectedOutput={item} 
                        output={output} 
                        origin={selectedOutput} 
                        level={3}
                    />)}
                </div>}
            {level===4 && <SectorDescription 
                selectedOutput={selectedOutput} 
                output={output} 
                origin={selectedOutput} 
                level={4}
            /> }
        </div>
    )
  }


function  SectorDescription ({selectedOutput, output, origin, level}) {
    return (
        <div className={`w-full p-6 ${level===4?"pt-0":"border-2 border-x-transparent border-t-transparent"} ${(selectedOutput===origin)&&(level!==4)?"bg-gray-200/30":""}`}>
            <div className="w-full text-start">
                {output[selectedOutput]["levels"]["level4"]}
            </div>
            <div className="w-full text-start mt-4">
                {output[selectedOutput]["description"]}
            </div>
            {output[selectedOutput]["exclusions"] && 
                <>
                <div className="w-full text-start mt-4">Exclusions : </div>
                <div className="w-full text-start">
                    {output[selectedOutput]["exclusions"]}
                </div>
                </>
            }
            <div className="w-full text-start mt-4 text-xs italic">
                Similarity score : {(output[selectedOutput]["score"]*100).toFixed(2)}%.
            </div>
        </div>
    )
  }
export default Sector;