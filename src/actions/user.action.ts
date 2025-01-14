"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { error } from "console";
import { Turtle } from "lucide-react";
import { revalidatePath } from "next/cache";
import { useReducer } from "react";

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

export async function getDbUserId() {
    const {userId:clerkId} = await auth();
    if(!clerkId) return null;
    // if(!clerkId) throw new Error("Unauthroized");

    const user = await getUserByClerkId(clerkId);
    if(!user) throw new Error("User not found")

    return user.id;
}

export async function getRandomUser() {
    const userId = await getDbUserId();

    if(!userId) return[];

    //get random 3 user excludeing ouerselves & users that we alreay followed
    try{
        const randomUsers = await prisma.user.findMany({
            where:{
                AND:[
                    {NOT:{id:userId}},
                    {
                        NOT:{
                            followers:{
                                some:{
                                    followerId:userId
                                }
                            }
                        }
                    }
                ]
            },
            select:{
                id:true,
                name:true,
                username:true,
                image:true,
                _count:{
                    select:{
                        followers:true,
                    }
                }
            },
            take:3,
        })

        return randomUsers;
    }catch(error){
        console.log("Error while fetching random User from DB",error);
        return [];
    }
}

export async function toggleFollow(targetuserId:string) {
    try{
        const userId = await getDbUserId();

        if(!userId) return;

        if(userId === targetuserId) throw new Error("You Cannot Follow youself")
        
        const existingFollow = await prisma.follows.findUnique({
            where:{
                followerId_followingId:{
                    followerId:userId,
                    followingId:targetuserId
                }
            }
        })

        if(existingFollow){
            //unfollow
            await prisma.follows.delete({
                where:{
                    followerId_followingId:{
                        followerId:userId,
                        followingId:targetuserId
                    }
                }
            })
        }
        else{
            //follow
            await prisma.$transaction([
                prisma.follows.create({
                    data:{
                        followerId:userId,
                        followingId:targetuserId
                    }
                }),

                prisma.notification.create({
                    data:{
                        type:"FOLLOW",
                        userId:targetuserId,
                        creatorId:userId
                    }
                })
            ])
        }

        revalidatePath('/')
        return {success:true};
    }
    catch(error){
        console.log("Error While ToogleFollower",error)
    }
}