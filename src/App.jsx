
import './index.css';
import './App.css';
import { useState, useEffect, useRef } from 'react';
import Header from './components/header';
import Footer from './components/footer';
import Progress from './components/progressBar';
import Models from './components/modelSelector';
import Classification from './components/classificationSelector';
import Sector from './components/sectorDescription';
import SectorItem from './components/outputSectors';
import Warning from './components/importantNotice';
import Loader from './components/loader';


function App() {
  const [model, setModel] = useState(null); //null until user acknowledges warning. models keys for worker [ 'all-MiniLM','bge-small'] 
  const [progress, setProgress] = useState([]); //list of files when model is downloading
  const [classification, setClassification] = useState('GICS'); //keys for worker [ 'GICS','NACE'], GICS by default 
  const [disabled, setDisabled] = useState(true); //disable button until model is loaded
  const [inputText, setInputText] = useState(""); //can't be null
  const [output, setOutput] = useState([]); //output from the model
  const [selectedOutput, setSelectedOutput] = useState(null);//index of the selected output
  const [selectionFocus, setSelectionFocus] = useState(false); // to allow arrow key navigation
  const [selectionReduced, setSelectionReduced] = useState(false); //not used?
  const [processing, setProcessing] = useState(false); // to show loader


  const worker = useRef(null);
  const parentRef = useRef(null);

  function acknowledgeWarning() {
    // setting the model will trigger the useEffect hook to load the model
    setModel('bge-small');
  }
  
  function handleModelChange(e) {
     // setting the model will trigger the useEffect hook to load the model
    setModel(e.target.value);
  }

  function handleClassificationChange(e) {
    //changing classification will trigger the useEffect hook if an output for the same input has already been generated
    setClassification(e.target.value);
  }

  function handleClick() {  
    // clicking the button will trigger the worker to classify the input text
    setDisabled(true);
    setProcessing(true);
    worker.current.postMessage({ task: 'classify', text: inputText, model: model, classification: classification });
  }

  function handleOutputSelection(index) {
    // choosing a sector to display
    setSelectedOutput(index);
  }

  function parentFocus() {
    // necessary to allow arrow key navigation
    parentRef.current.focus();
  }

  function handleArrowKeyPress(e) {
    // when the sector list is in focus, arrow keys can be used to navigate the list
    if (e.key === 'ArrowUp') {
      setSelectedOutput(prevSelected => Math.max(prevSelected - 1, 0))
    }
    if (e.key === 'ArrowDown') {
      setSelectedOutput(prevSelected => Math.min(prevSelected + 1, 9))
    }
  }

  // We use the `useEffect` hook to setup the worker as soon as the `App` component is mounted.
  // this hook is largely inspired by https://huggingface.co/docs/transformers.js/tutorials/react
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL('./worker.js', import.meta.url), {
          type: 'module'
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e) => {
      setDisabled(true);
      switch (e.data.status) {
        case 'initiate':
          // Model file start load: add a new progress item to the list.
          setProgress(prev => [...prev, e.data]);
          break;
    
        case 'progress':
          // Model file progress: update one of the progress items.
          setProgress(
            prev => prev.map(item => {
              if (item.file === e.data.file) {
                return { ...item, progress: e.data.progress }
              }
              return item;
            })
          );
          break;
    
        case 'clean':
          // Model file loaded: remove the progress item from the list.
          setProgress([]);
          break;
    
        case 'ready':
          // Pipeline ready: the worker is ready to accept messages.
          setDisabled(false);
          break;
  
        case 'complete':
          // Generation complete: re-enable the "Translate" button
          setDisabled(false);
          setProcessing(false);
          setOutput(e.data.output);
          setSelectedOutput(0);
          //console.log(e.data.output);
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current.removeEventListener('message', onMessageReceived);
  });

  useEffect(() => {
      // Load model in the background (only if user has acknowledged the warning).
      if (model) {
      worker.current.postMessage({ task: 'initialize' , model: model });
      }
      if(inputText!==""){
        setProcessing(true);
        worker.current.postMessage({ task: 'classify', text: inputText, model: model, classification: classification });
      }
  },[model])

  useEffect(() => {
    // launch new classification if it has been done before
    if(output.length>0){
      setProcessing(true);
      worker.current.postMessage({ task: 'classify', text: inputText, model: model, classification: classification });
    }},[classification])

  useEffect(() => {
    // key handling only if list of results is in focus
    if (selectionFocus) {
      window.addEventListener('keydown', handleArrowKeyPress);
    }
    else {
      window.removeEventListener('keydown', handleArrowKeyPress);
    }
    return () => window.removeEventListener('keydown', handleArrowKeyPress);
  },[selectionFocus])

  return (
    <div className="h-fit w-full min-h-screen flex flex-col justify-between">
      <Header/>
      {!model &&
        <div className="relative w-full flex-grow p-4 max-w-[1280px] m-auto">
          <Warning acknowledgeWarning={acknowledgeWarning}/> 
        </div>
      }
      {model &&
        <div className="relative w-full flex-grow px-4 py-10 max-w-[1280px] m-auto">
          <div className='flex w-full flex-wrap justify-between'>
            <Models model={model} handleModelChange={handleModelChange}/> 
            <Progress items={progress} model={model}/>
          </div>
          <textarea className="w-full border-2 border-gray-300 rounded-lg p-2 h-36 mt-3 mb-2" placeholder={`${disabled?"You can enter company description whilst model is loading...":"Enter company description..."}`} value={inputText} onChange={(e) => setInputText(e.target.value)}></textarea>
          <div className='flex w-full flex-nowrap justify-between mb-10'>
            <Classification classification={classification} handleClassificationChange={handleClassificationChange}/> 
            <button className="text-white font-bold py-2 px-4 rounded" onClick={handleClick} disabled={disabled}>{disabled?"Wait":"Classify"}</button> 
          </div>
          {(classification=="GICS") &&
            <div className="my-4"> 
              <p className="text-start">GICS® is a four-tiered, hierarchical industry classification system used by both MSCI and S&P Dow Jones Indices. The four tiers are: Sectors, Industry Groups, Industries and Sub-Industries. Find out more <a href="https://www.msci.com/our-solutions/indexes/gics" target="_blank" rel="noreferrer noopener nofollow">here</a>.</p>
            </div>}
          {(classification=="NACE") &&
            <div className="my-4">
              <p className="text-start">NACE (Nomenclature of Economic Activities) is the European statistical classification of economic activities. NACE groups organizations according to their business activities. Find out more <a href="https://nacev2.com/en" target="_blank" rel="noreferrer noopener nofollow">here</a>.</p>
            </div>
          }
          {processing && <Loader/> }
          {(output.length>0 && !processing) && 
            <div className={`relative w-full flex flex-wrap justify-start ${selectionReduced?"":"min-[600px]:flex-nowrap"} gap-3 mt-10`}>
              <div className={`w-full ${selectionReduced?"max-w-[600px] mx-auto":"min-[600px]:w-[250px] min-[600px]:shrink-0"}`}>
                <div className="w-full flex flex-nowrap mb-2 justify-between">
                  <div className="text-start text-xs italic">Top 10 results:</div>
                  <div className="text-end text-xs cursor-pointer font-semibold text-[rgb(var(--pitti-color))]" onClick={()=>{setSelectionReduced(prev=>!prev)}}>{selectionReduced?"expand":"reduce"}</div>
                </div>
                {!selectionReduced &&
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden" tabIndex={0} ref={parentRef} onFocus={() => setSelectionFocus(true)} onBlur={() => setSelectionFocus(false)}>
                  {output.slice(0,10).map((item,index) => 
                      <SectorItem key={`topK${index}`} item={item["levels"]["level4"]} index={index} selected={index===selectedOutput} setSelectedOutput={handleOutputSelection} setParentFocus={parentFocus}/>
                    )} 
                </div>}
                {selectionReduced &&
                  <div className="flex flex-nowrap border-2 border-gray-300 min-h-[50px] rounded-lg items-center">
                     <svg className={`ml-3 pt-2 h-5 w-5 shrink-0 cursor-pointer rotate-90`} viewBox="0 0 11 6" xmlns="http://www.w3.org/2000/svg" onClick={()=>setSelectedOutput(prevSelected => Math.max(prevSelected - 1, 0))}> 
                        <path fill="rgb(var(--pitti-color))" d="M9.87564 0.224476C10.196 0.535394 10.2095 1.05326 9.90567 1.38115L6.01893 5.5763C5.49553 6.14123 4.62843 6.14123 4.10504 5.5763L0.218296 1.38115C-0.0854941 1.05325 -0.0720463 0.535394 0.248332 0.224475C0.568709 -0.086443 1.0747 -0.0726801 1.37849 0.255216L5.06198 4.231L8.74548 0.255216C9.04927 -0.0726798 9.55526 -0.0864426 9.87564 0.224476Z"></path>
                    </svg>
                    <div className="text-center text-sm grow overflow-hidden">{output[selectedOutput]["levels"]["level4"]}</div>
                    <svg className={`mr-3 pt-2 h-5 w-5 shrink-0 cursor-pointer -rotate-90`} viewBox="0 0 11 6" xmlns="http://www.w3.org/2000/svg" onClick={()=>setSelectedOutput(prevSelected => Math.min(prevSelected + 1, 9))}> 
                        <path fill="rgb(var(--pitti-color))" d="M9.87564 0.224476C10.196 0.535394 10.2095 1.05326 9.90567 1.38115L6.01893 5.5763C5.49553 6.14123 4.62843 6.14123 4.10504 5.5763L0.218296 1.38115C-0.0854941 1.05325 -0.0720463 0.535394 0.248332 0.224475C0.568709 -0.086443 1.0747 -0.0726801 1.37849 0.255216L5.06198 4.231L8.74548 0.255216C9.04927 -0.0726798 9.55526 -0.0864426 9.87564 0.224476Z"></path>
                    </svg>
                  </div>}
              </div>
              <div className="min-w-[300px] mt-4 grow">
                <Sector selectedOutput={selectedOutput} output={output}/>
              </div>
          </div>}
          <div className="mt-10 text-sm italic">
            <p className="w-full text-start py-1">This AI-powered classification assistant performs semantic search comparing your company description to all sectors (level 4) in the chosen classification and orders them by similarity scores. What matters is the relative order of the scores rather than the absolute values. This tool can narrow down the options but should not be trusted to identify the correct answer.</p>
            <p className="w-full text-start py-1">More powerful and/or finetuned models would be necessary to completely replace humans at this task. To allow inference on your device, we focused on smaller models. <a href="https://huggingface.co/Xenova/bge-small-en-v1.5">Bge-small-en-v1.5</a> is downloaded by default. We kept the option to use another model, <a href="https://huggingface.co/Xenova/all-MiniLM-L6-v2">all-MiniLM-L6-v2</a>, which may yield better results based on our tests. This app was built as a demo to illustrate real-life use cases of AI, working exclusively with basic building blocks in order to demystify this technology. Read about other solutions we tested to classify companies <a href="https://www.pitti.io/blogs/ELIAAM/sector-classification">here</a>.</p>
            </div>
        </div>}
      <Footer/>
    </div>
  );
}

export default App;
