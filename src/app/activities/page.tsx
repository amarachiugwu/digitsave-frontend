'use client'

import Header from '@/components/dashboard/Header'
import Sidebar from '@/components/dashboard/Sidebar'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { Circle, WalletIconPlain } from '@/icon';


export default function Activities() {
  const { isDisconnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isDisconnected) {
      router.push('/');
    }
  }, [isDisconnected, router]);
  return (
    <main className='text-neutral-2'>
        <Header />
        <section className='flex border-t border-tertiary-6'>

          <div className="w-1/5">
            <Sidebar />
          </div>
            

            <div className='w-4/5 flex flex-col'>
             

              {/* history */}
              <section className="w-full m-h-screen w-4/4 px-6 py-10">
                <div className='flex gap-4 w-full'>
                  <div className="w-full flex flex-col gap-4">
                    
                    <p className='font-semibold'>Recent activities</p>
                    <p className='text-tertiary-4'>Let’s see how well you are doing.</p>


                    <div className="mt-4 w-full flex flex-col rounded-lg bg-tertiary-6">
                      <div className='text-sm p-6'>
                        <div className="flex flex-col gap-6">
                          <div className="flex gap-8 justify-between items-center">
                            
                            <div className="flex gap-4">
                              <WalletIconPlain />
                              <div className="flex flex-col gap-1 ">
                                <p>Savings account credited</p>
                                <p className="text-xs">2 days ago</p>
                              </div>
                            </div>

                            <div className="flex gap-2 py-1 px-3 items-center bg-tertiary-7 rounded-xl">
                              <Circle />
                              <p>Successful</p>
                            </div>

                            <p>$120</p>

                            <p>24-04-2024</p>

                          </div>
                        </div>
                      </div>

                      <div className='text-sm p-6'>
                        <div className="flex flex-col gap-6">
                          <div className="flex gap-8 justify-between items-center">
                            
                            <div className="flex gap-4">
                              <WalletIconPlain />
                              <div className="flex flex-col gap-1 ">
                                <p>Savings account credited</p>
                                <p className="text-xs">2 days ago</p>
                              </div>
                            </div>

                            <div className="flex gap-2 py-1 px-3 items-center bg-tertiary-7 rounded-xl">
                              <Circle />
                              <p>Successful</p>
                            </div>

                            <p>$120</p>

                            <p>24-04-2024</p>

                          </div>
                        </div>
                      </div>

                      <div className='text-sm p-6'>
                        <div className="flex flex-col gap-6">
                          <div className="flex gap-8 justify-between items-center">
                            
                            <div className="flex gap-4">
                              <WalletIconPlain />
                              <div className="flex flex-col gap-1 ">
                                <p>Savings account credited</p>
                                <p className="text-xs">2 days ago</p>
                              </div>
                            </div>

                            <div className="flex gap-2 py-1 px-3 items-center bg-tertiary-7 rounded-xl">
                              <Circle />
                              <p>Successful</p>
                            </div>

                            <p>$120</p>

                            <p>24-04-2024</p>

                          </div>
                        </div>
                      </div>

                      <div className='text-sm p-6'>
                        <div className="flex flex-col gap-6">
                          <div className="flex gap-8 justify-between items-center">
                            
                            <div className="flex gap-4">
                              <WalletIconPlain />
                              <div className="flex flex-col gap-1 ">
                                <p>Savings account credited</p>
                                <p className="text-xs">2 days ago</p>
                              </div>
                            </div>

                            <div className="flex gap-2 py-1 px-3 items-center bg-tertiary-7 rounded-xl">
                              <Circle />
                              <p>Successful</p>
                            </div>

                            <p>$120</p>

                            <p>24-04-2024</p>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  
                </div>
              </section>

            </div>

            
        </section>
    </main>
  )
}
