function Progress({items,model}) {
    const percentage=items?items.reduce((a,b)=>a+b.progress,0)/items.length:0;
    return (
      <div className={`relative min-w-[250px] h-10 grow flex justify-start`}>
        {percentage<100 &&
          <div className='bg-[rgb(var(--pitti-color))] text-end font-bold py-2 min-[460px]:ml-4' style={{ 'width': `${percentage}%` }}>
          </div>
        }
          <div className='absolute py-2 min-[460px]:right-0 font-bold min-[460px]:px-2'>
            {percentage==100?`${model} ready`:"downloading model files..."}
          </div>
      </div>
    );
  }

export default Progress;