function Classification({classification,handleClassificationChange}) {
    return (
        <div className="">
            <div className="text-start text-xs italic">Classification</div>
            <div className="flex flex-nowrap justify-start items-center mt-1 gap-3">
                <label className="text-sm"><input className="relative" name="classificationOption" type="radio" value="GICS" onChange={(e)=>handleClassificationChange(e)} checked={classification==="GICS"}/> GICS<sup>®</sup></label>
                <label className="text-sm"><input className="relative" name="classificationOption" type="radio" value="NACE" onChange={(e)=>handleClassificationChange(e)} checked={classification==="NACE"}/> NACE</label>
            </div>
        </div>
    )
  }

export default Classification;