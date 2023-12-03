function Footer() {
    return (
      <footer className="relative bg-black w-full h-15 flex flex-wrap items-center px-5 py-3 justify-between min-[400px]:justify-center">
          <a className="relative mt-3 mx-auto justify-center text-white flex flex-nowrap items-center shrink-0 min-[740px]:mt-1" href="https://www.pitti.io/" target="_blank" rel="noreferrer">
          <div className="text-center px-2">Developed by PITTI</div>
            <svg className='h-7 w-10 pr-2' viewBox="0 0 64 30" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.73315363881402 0.001 L17.2641509433962 9.29919137466307 L24.5013477088949 26.4420485175202 L16.900269541779 29.5148247978437 L0.001 24.6630727762803 Z" fill="white"/>
                    <path d="M20.5390835579515 8.61185983827493 L45.0808625336927 0.363881401617251 L43.2614555256065 12.6549865229111 L34.0835579514825 29.1509433962264 L27.2911051212938 24.8652291105121 Z" fill="white"/>
                    <path d="M43.9083557951482 18.3962264150943 L58.2210242587601 6.06469002695418 L63.0727762803235 12.4528301886792 L63.7196765498652 29.99999 L37.9649595687332 29.2722371967655 Z" fill="white"/>
            </svg>
          </a>
          <a className="text-center px-2 github text-white mt-3 mx-auto shrink-0 pr-5 min-[740px]:mt-1" href="https://github.com/pappitti" rel="noreferrer" target="_blank">code available</a>
        <ul className='relative min-w-[360px] mt-3 justify-center text-white flex flex-nowrap items-center grow min-[740px]:mt-1 min-[740px]:justify-end'> 
          <li className="text-center px-2">Follow-us</li>
          <li className="px-2 flex flex-nowrap twitter maintwitter socials min-[740px]:mt-1">a
            <a href="https://twitter.com/PITTI_DATA" rel="noreferrer" target="_blank"><div className='px-3 text-sm subtweet twitter'>@PITTI_DATA</div></a>
            <a href="https://twitter.com/PITTI_FI" rel="noreferrer" target="_blank"><div className='px-2 text-sm subtweet twitter'>@PITTI_FI</div></a>
          </li>
        </ul>
      </footer>
    )
  };

export default Footer;