import { authOptions } from '@/lib/auth'
import { Link } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import {FC,ReactNode} from 'react'

interface LayoutProps{
    children:ReactNode
}

const Layout:FC<LayoutProps>= async ({children})=>{

    const session =await  getServerSession(authOptions)
    
    if(!session){
          notFound()

          return(
            <div className='w-full flex h-screen'>
                    <div className='flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white'>

                    </div>

                    <Link href='/dashboard'></Link>

                {children}
                </div>
        )
     }

    
}