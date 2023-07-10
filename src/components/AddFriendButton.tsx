"use client"

import { FC, useState } from 'react'
import Button from './ui/Button'
import { addFriendValidator } from '@/lib/validations/add-friend'
import { toast } from 'react-hot-toast'
import { ZodError, z } from 'zod'
import axios, {AxiosError} from 'axios'
import {useForm}from 'react-hook-form'
import{zodResolver} from '@hookform/resolvers/zod'

interface AddFriendButtonProps {
  
}

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {

  type FormData=z.infer<typeof addFriendValidator>
    
  const [showSuccessState,setShowSuccessState]=useState<boolean>(false)
  

    const { register , handleSubmit ,setError,formState:{errors} }= useForm<FormData>({
      resolver:zodResolver(addFriendValidator)
    })
  
    const addFriend =async (email:string)=>{
      
    try {
      const validatedEmail= addFriendValidator.parse({email})
      



      await axios.post('/api/friends/add',{
        email:validatedEmail
      })

      setShowSuccessState(true)


    } catch (error) {

      // toast.error('invalid email')
      if(error instanceof ZodError){
        setError('email',{message:error.message})
        return
      }

      if(error instanceof AxiosError){
        setError('email',{message:error.response?.data})
         return
      }


      setError('email',{message:'something went wrong'})
      
    }
  }


  const onSubmit =(data:FormData)=>{
    addFriend(data.email)
  }


  return <div>
    <form onSubmit={handleSubmit(onSubmit)}className='max-w-sm' >
        <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-400'>
            Add a Friend by email
        </label>

        <div className='mt-2 flex gap-4'>
            <input 
            {...register('email')}
            type='text' className='block w-full rounded-md  borer-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm  sm:leading-6'
            placeholder='you@example.com'

            />
            <Button>Add</Button>

            </div>
            <p className='mt-1 text-sm  text-red-600'>{errors.email?.message}</p>
           
             {showSuccessState?(
                <p className='mt-1 text-sm  text-green-700'>Friend request sent</p>

             ):null}
             
    </form>

  </div>
}

export default AddFriendButton