import Image from 'next/image'

export default function Nav() {
  return (
    <nav className='w-full border-b border-slate-500'>
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
