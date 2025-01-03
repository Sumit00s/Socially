"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { error } from "console";
import { rule } from "postcss";

export async function syncUser() {
    try{
        const {userId} = await auth();
        const user = await currentUser();

        //return if no user
        if(!user || !userId) return;

        //check if user already exist
        const existingUser = await prisma.user.findUnique({
            where:{
                clerkId:userId
            }
        })

        if(existingUser) return existingUser;

        //if no user exist then create one sync
        const dbUser = await prisma.user.create({
            data:{
                clerkId:userId,
                name: `${user.firstName || ""} ${user.lastName || ""}`,
                username: user.username ?? user.emailAddresses[0].emailAddress.split('@')[0],
                email:user.emailAddresses[0].emailAddress,
                image:user.imageUrl
            }
        })

        return dbUser;
    }
    catch(err){
        console.log("Error While Syncing User...",error);
    }
}

export async function  getUserByClerkId(clerkId:string) {
    return prisma.user.findUnique({
        where:{
            clerkId,
        },
        include:{
            _count:{
                select:{
                    followers:true,
                    following:true,
                    posts:true,
                }
            }
        }
    })
}