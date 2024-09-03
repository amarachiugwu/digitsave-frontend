import { EyeIcon } from '@/icon'
import React from 'react'


export default function GuestBalance() {


  return (
    <section className="w-full m-h-screen w-4/4 px-6 py-10">

        <div className='flex gap-4 w-full'>
            <div className="w-3/5 flex flex-col gap-4 p-6 bg-center rounded-lg bg-[url('/images/stats-bg.png')]">
            
            <div className='flex gap-8 items-center'>
                <span className='text-sm'>Total Balance</span>
                <EyeIcon />
            </div>

            <p className='font-bold font-swiss text-4xl'>$0.00</p>

           

            </div>

            <div className="w-2/5 p-6 bg-[#2B2B2B80] rounded-lg">
            <div className='flex flex-col gap-4'>
                <span className='text-sm text-neutral-6'>Intrest Balance</span>
                <p className='font-bold font-swiss text-4xl text-neutral-6'>$0.00</p>
                {/* <span className='pt-2 text-neutral-3'>Feature coming soon</span>  */}

            </div>

            
            </div>
        </div>
        
    </section>
  )
}
