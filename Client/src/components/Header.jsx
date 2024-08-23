import React, { useEffect, useState } from "react";
import { SignedIn, SignedOut, UserButton, useUser,useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Header() {
    const {isLoaded} = useAuth();
    const { user } = useUser();
    const [name , setName] = useState('');
    
    useEffect(() => {
        if (isLoaded && user) {
            setName(user.fullName);
        }
    }, [isLoaded,user]);
        
    return (
        <header className="header">
            <div>
                <h1>Clerk Auth</h1>
            </div>
            <div className="navbar">
                <ul className="nav-ul">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/contact">Contact</Link>
                    </li>
                    <li>
                        <Link to="/dashboard">Dashboard</Link>
                    </li>
                </ul>
            </div>

            <div className='profile'>
                <SignedIn >
                    <UserButton />
                    <span>{name}</span>
                </SignedIn>
                <SignedOut>
                    <button className="nav-btn">
                        <Link to="/sign-in">Sign In</Link>
                    </button>
                </SignedOut>
            </div>
        </header>
    );
}
