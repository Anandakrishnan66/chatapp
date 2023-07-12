'use client'
import { ButtonHTMLAttributes, FC, useState } from 'react'
import { toast, useToaster } from 'react-hot-toast'
import Button from './ui/Button'
import { signOut } from 'next-auth/react'
import { Loader2, LogOut } from 'lucide-react'

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{}


const SignOutButton: FC<SignOutButtonProps> = ({...props}) => {

    const [isSignout,setIsSignOut]=useState<boolean>(false)
 
 
 
 return <div>
   <Button {...props} variant='ghost' onClick={async()=>{
       setIsSignOut(true)
       try {
        
        await signOut()
       } catch (error) {

        toast.error("error in signout")
        
       }

       finally{
        setIsSignOut(false)
       }
   }}>

{ isSignout ?
 (<Loader2 className='animate-spin h-4 w-4'/>)
:
  (<LogOut className='w-4 h-4 '/>
  )}
   </Button>
  </div>

}

export default SignOutButton