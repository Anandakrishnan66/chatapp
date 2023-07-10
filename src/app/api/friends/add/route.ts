import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { addFriendValidator } from "@/lib/validations/add-friend"
import { getServerSession } from "next-auth"
import { cache } from "react"
import { z } from "zod"


export async function POST(req:Request){
    try {
        const body=await req.json()

        const{email:emailToAdd}=addFriendValidator.parse(body.email)


       const idtoAdd = await fetchRedis('get',`user:email:${emailToAdd}`) as string

        // const idtoAdd=data.result

        if(!idtoAdd){
            return new Response('THis person doesnt exist',{status:400})
        }

        const session =await getServerSession(authOptions)
         
        if(!session){
            return new Response('Unauthorized',{status:401})
        }

         if(idtoAdd=== session.user.id){
            return new Response("You cannot add yourself",{status:400})
         }
         
      //check if user already added

          const isAlreadyAdded = (await fetchRedis('sismember',`user:${idtoAdd}:incoming_friend_requests`,
          session.user.id) )as 0 | 1

          if(isAlreadyAdded){
            return new Response('Already added user',{status:400})
          }
  


          const isAlreadyFriends = (await fetchRedis('sismember',`user:${session.user.id}:friends`,
          idtoAdd) )as 0 | 1

          if(isAlreadyFriends){
            return new Response('Already friends with user',{status:400})
          }
          
   // valid request,send friend request

   db.sadd(`user:${idtoAdd}:incoming_friend_requests`,session.user.id)

  return new Response('OK')
        // console.log(data)
        

        
    } catch (error) {
        if(error instanceof z.ZodError){
            return new Response('invalid request payload',{status:422})

        }

        return new Response('Invalid Request',{status:400})
        
    }

}