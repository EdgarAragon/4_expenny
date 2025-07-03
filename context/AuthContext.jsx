'use client'

import { auth, db } from "@/firebase"
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { createContext, useContext, useState, useEffect } from "react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { subscriptions } from "@/utils"

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider(props) {
    const { children } = props

    const [currentUser, setCurrentUser] = useState(null)
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(false)

    function signup (email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login (email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout () {
        setCurrentUser(null)
        setUserData(null)
        return signOut(auth)
    }

    async function saveToFirebase(data) {
        try {
            const userRef = doc(db, 'users', currentUser.uid)
            const res = await setDoc(userRef, {
                subscriptions: data
            }, { merge: true})
        } catch (err) {
            console.log(err.message)
        }
    }

    async function handleAddSubscription(newSubscription) {
        //remove this line if you put in a paywall and actually are making money
        if (userData.subscriptions.length > 30) { return }

        //modify the local state(global context)
        const newSubscriptions = [...userData.subscriptions, newSubscription]
        setUserData({ subscriptions: newSubscriptions})

        //write the changes to our Firebase database(asynchronous)
        await saveToFirebase(newSubscriptions)
    }

    async function handleDeleteSubscription(index) {
        //delete the entry at that index
        const newSubscriptions = userData.subscriptions.filter((val, valIndex) => {
            return valIndex !== index
        })
        setUserData({ subscriptions: newSubscriptions})

        await saveToFirebase(newSubscriptions)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async user => {
            try {
                setCurrentUser(user)

                if(!user) {return}

                //the user was found, user is searched in database for info
                setLoading(true)

                //After finding the user, this will search the database for their info
                const docRef = doc(db, 'users', user.uid)
                const docSnap = await getDoc(docRef)
                console.log("Fetching user data")

                let firebaseData = { subscriptions: [] }
                // let firebaseData = {subscriptions}

                if(docSnap.exists()) {
                    //data was found
                    console.log("Found user data")
                    firebaseData = docSnap.data()
                } else {
                    //data was not found
                    setUserData(firebaseData)
                    setLoading(false)
                }
            } catch (err) {
                console.log(err.message)
            }
        })
        return unsubscribe
    }, [])

    const value = {
        currentUser, userData, loading, signup, login, logout, handleAddSubscription, handleDeleteSubscription
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}