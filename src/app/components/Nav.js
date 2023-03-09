import Image from 'next/image'

function Wave() {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'>
      <path
        fill='#1e293b'
        fill-opacity='1'
        d='M0,192L120,176C240,160,480,128,720,144C960,160,1200,224,1320,256L1440,288L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z'
      ></path>
    </svg>
  )
}

export default function Nav() {
  return (
    <nav className="w-full border-b border-slate-500 bg-[url('/wave.svg')] bg-cover bg-left">
      <div className='justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8'>
        <div>
          <div className='flex items-center justify-between py-1 pb-3 md:py-5 md:block'>
            <a href='#'>
              <Image
                alt='logo'
                src='/logo.png'
                width='40'
                height='10'
                priority
              />
            </a>
            <div className='md:hidden'>
              <button className='py-1 mr-2'>
                <span className='px-2 py-1 text-sm font-semibold uppercase bg-orange-500 rounded text-blue-50'>
                  Pro
                </span>
              </button>
              <button className='py-1 mr-2'>
                <span className='px-2 py-1 text-sm font-semibold uppercase rounded text-blue-50 bg-slate-500'>
                  Login
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
