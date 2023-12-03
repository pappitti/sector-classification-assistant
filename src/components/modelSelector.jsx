function Models({model,handleModelChange}) {
    return (
        <div className="">
            <div className="text-start text-xs italic">Model</div>
            <div className="flex flex-nowrap justify-start items-center mt-1 gap-3">
                <label className="text-sm"><input className="relative" name="filterOption" type="radio" value="bge-small" onChange={(e)=>handleModelChange(e)} checked={model==="bge-small"}/> bge-small</label>
                <label className="text-sm"><input className="relative" name="filterOption" type="radio" value="all-MiniLM" onChange={(e)=>handleModelChange(e)} checked={model==="all-MiniLM"}/> all-MiniLM</label>
            </div>
        </div>
    )
  }

export default Models;