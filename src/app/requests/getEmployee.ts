"use server"

import { auth } from "@/auth";

export default async function getEmployee() {
    const session = await auth();
    if(session) {
      // const url = `${process.env.NEXT_PUBLIC_API_BASE_PATH}/v1/employee/${session.user.email}` UNCOMMENT THIS LINE FOR PROD
      const url = `${process.env.NEXT_PUBLIC_API_BASE_PATH}/v1/employee/${process.env.TEST_EMAIL}` // Hardcoded email because everyone is this in test db
      console.log("GET Employee: ", url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: "Bearer "+session?.accessToken
        }
    })
    if(response.ok) {
        return response.json()
    } else {
        throw new Error("Failed to fetch entity forms")
    }
    } else {
        throw new Error("Failed to get session")
    }
    
}