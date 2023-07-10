import { NextAuthOptions } from "next-auth";
import {UpstashRedisAdapter} from '@next-auth/upstash-redis-adapter'
import { db } from "./db";
import GoogleProvider from 'next-auth/providers/google'

function getGoogleCredentials(){
    const clientId="690755735037-r1db3e5bgkhren3lqdrkkcdcvdse8blg.apps.googleusercontent.com";
    const clientSecret = "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";

    if(!clientId || clientId.length==0){
        throw new Error("Missing Google client_id")
    }
    if(!clientSecret || clientSecret.length==0){
        throw new Error("Missing Google secret")
    }

    return {clientId,clientSecret}
    
}
export const authOptions:NextAuthOptions={
    secret:process.env.NEXTAUTH_SECRET,
    adapter:UpstashRedisAdapter(db),
    session:{
        strategy:'jwt'
    },
    pages:{
        signIn:'/login'
    },
    providers:[
        GoogleProvider({
            clientId:getGoogleCredentials().clientId,
            clientSecret:getGoogleCredentials().clientSecret

            
            })
    ],
    callbacks:{
        async jwt({token,user}){
            const dbUser = (await db.get(`user:${token.id}`)) as User | null
           
             if(!dbUser){
                token.id=user!.id
                return token
             }

             return{
                id:dbUser.id,
                name:dbUser.name,
                email:dbUser.email,
                picture:dbUser.image

             }
       
        },

        async session({session,token}){
            if(token){
                session.user.id=token.id
                session.user.name=token.name
                session.user.email=token.email
                session.user.image=token.picture
            }

            return session
        },
       

        redirect(){
            return '/dashboard'
        }

        
    }
}