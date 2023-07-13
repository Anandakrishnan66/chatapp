import { FC,useEffect,useState } from 'react'
import {pusherClient}  from '@/lib/pusher'
import{User } from 'lucide-react'
import Link from 'next/link'
import { toPusherKey } from '@/lib/utility'

interface FriendRequestSideBarOptionsProps {
    sessionId:string
    initialUnseenRequestCount:number


  
}

const FriendRequestSideBarOptions: FC<FriendRequestSideBarOptionsProps> = ({
    sessionId,
    initialUnseenRequestCount
}) => 

{

    const [unSeenRequestCount,setUnseenRequestCount] = useState<number>(
        initialUnseenRequestCount
    )

    useEffect(()=>{
        pusherClient.subscribe(
            toPusherKey(`user:${sessionId}:incoming_friend_requests`)
        )

        pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

        const friendRequestHandler=()=>{
            setUnseenRequestCount((prev)=>prev+1)
        }

        const addFriendHandler=()=>{
            setUnseenRequestCount((prev)=>prev-1)

        }

        pusherClient.bind('incoming_friend_requests',friendRequestHandler)
        pusherClient.bind('new_friend',addFriendHandler)

        return()=>{
            pusherClient.unsubscribe(
                toPusherKey(`user:${sessionId}:incoming_friend_requests`)
            )

            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))

            pusherClient.unbind('new_friend',addFriendHandler)
            pusherClient.unbind('incoming_friend_requests',friendRequestHandler)

        }

    },[sessionId])

    
  return (
  <Link 
  href='/dashboard/requests'
  className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
    <div className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
        <User className='h-4 w-4'/>
    </div>

    <p className=' truncate'>Friend Requests</p>
    {unSeenRequestCount>0 ? (
        <div className='rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600'>
        {unSeenRequestCount}
        </div>

    ):null}
    </Link>
  )
  

}

export default FriendRequestSideBarOptions