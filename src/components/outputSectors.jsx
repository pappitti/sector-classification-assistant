function SectorItem({item, index, selected, setSelectedOutput, setParentFocus}) {
    return (
        <div className={`w-full cursor-pointer text-start p-1 text-sm ${selected?"bg-[rgb(var(--pitti-color))] text-white":""}`} onClick={(e)=>{
            setSelectedOutput(index);
            setParentFocus();
        }}>
            <div>{item}</div>
        </div>
    )
  }

export default SectorItem;