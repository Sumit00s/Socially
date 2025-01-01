"use client"

import { useState,useEffect } from "react"
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";
import { BellIcon, HomeIcon, LogOutIcon, MenuIcon, UserIcon} from "lucide-react";
import {Sheet, SheetTrigger,SheetContent, SheetHeader, SheetTitle} from "./ui/sheet";
import Link from "next/link";
import { SignInButton, SignOutButton, useAuth } from "@clerk/nextjs";

export default function MobileNavbar(){
    const [showMobileMenu,setShowMobileMenu] = useState(false);
    const {isSignedIn} = useAuth();


    return(
        <div className="flex md:hidden items-center space-x-2">
           <ModeToggle/>

           <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>

                <SheetTrigger asChild>
                    <Button variant={"ghost"} size="icon">
                        <MenuIcon className="h-5 w-5"/>
                    </Button>
                </SheetTrigger>

                <SheetContent side={'right'} className="w-[300px]">
                    <SheetHeader>
                        <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    
                    <nav className="flex flex-col space-y-4 mt-6">
                        <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild>
                            <Link href="/">
                                <HomeIcon className="w-4 h-4" />
                                Home
                            </Link>
                        </Button>

                        {isSignedIn ? (
                           <>
                                <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild>
                                    <Link href="/notifications">
                                        <BellIcon className="w-4 h-4" />
                                        Notifications
                                    </Link>
                                </Button>

                                <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild>
                                    <Link href="/profile">
                                        <UserIcon className="w-4 h-4" />
                                        Profile
                                    </Link>
                                </Button>

                                <SignOutButton>
                                    <Button variant={"ghost"} className="flex items-center gap-3 justify-start w-full">
                                        <LogOutIcon className="w-4 h-4"/>
                                        Logout
                                    </Button>
                                </SignOutButton>
                           </>
                        ):(
                            <SignInButton mode="modal" >
                                <Button variant={"default"} className="w-full" onClick={() => setShowMobileMenu(false)}>Sign In</Button>
                            </SignInButton>
                        )

                        }
                    </nav>
                </SheetContent>
           </Sheet>
        </div>
    )
}